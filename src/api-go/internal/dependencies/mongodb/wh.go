package mongodb

import (
	"context"
	"errors"
	"fmt"

	d "github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type WhDbService struct {
	Db          *DbService
	Collections map[warhammer.WhType]*mongo.Collection
}

// Content documents store each edition variant under editions.<edition>.
// Characters have a single fixed edition in edition and store their data under object.
type whDocWrite struct {
	Id         bson.ObjectID                            `bson:"_id"`
	OwnerId    string                                   `bson:"ownerid"`
	Visibility warhammer.Visibility                     `bson:"visibility"`
	Edition    warhammer.Edition                        `bson:"edition,omitempty"`
	Object     warhammer.WhObject                       `bson:"object,omitempty"`
	Editions   map[warhammer.Edition]warhammer.WhObject `bson:"editions,omitempty"`
}

type whDocRead struct {
	Id         bson.ObjectID                  `bson:"_id"`
	OwnerId    string                         `bson:"ownerid"`
	Visibility warhammer.Visibility           `bson:"visibility"`
	Edition    warhammer.Edition              `bson:"edition"`
	Object     bson.Raw                       `bson:"object"`
	Editions   map[warhammer.Edition]bson.Raw `bson:"editions"`
}

func variantPath(e warhammer.Edition) string {
	return "editions." + string(e)
}

// editionQuery matches content documents that have the edition variant and characters of the edition.
func editionQuery(t warhammer.WhType, e warhammer.Edition) bson.M {
	if warhammer.HasEditions(t) {
		return bson.M{variantPath(e): bson.M{"$exists": true}}
	}
	return bson.M{"edition": e}
}

func NewWhDbService(db *DbService, createIndex bool) (*WhDbService, error) {
	collections := map[warhammer.WhType]*mongo.Collection{}

	for _, whCoreType := range warhammer.WhCoreTypes {
		collections[whCoreType] = db.Client.Database(db.DbName).Collection(string(whCoreType))
	}
	collections[warhammer.WhTypeOther] = db.Client.Database(db.DbName).Collection(warhammer.WhTypeOther)
	if createIndex {
		if err := createIndexOnField("name", collections[warhammer.WhTypeOther]); err != nil {
			return nil, err
		}
	}

	return &WhDbService{Db: db, Collections: collections}, nil
}

func createIndexOnField(fieldName string, collection *mongo.Collection) error {
	mod := mongo.IndexModel{
		Keys:    bson.D{{Key: fieldName, Value: 1}},
		Options: options.Index().SetUnique(true),
	}
	_, err := collection.Indexes().CreateOne(context.TODO(), mod)
	if err != nil {
		return fmt.Errorf("failed to create index on field %s: %w", fieldName, err)
	}
	return nil
}

func newWhDocWrite(t warhammer.WhType, w *warhammer.Wh) (*whDocWrite, error) {
	id, err := bson.ObjectIDFromHex(w.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to calculate object id of %s: %w", w.Id, err)
	}

	whDoc := whDocWrite{
		Id:         id,
		OwnerId:    w.OwnerId,
		Visibility: w.Visibility,
	}
	if warhammer.HasEditions(t) {
		whDoc.Editions = w.Editions
	} else {
		whDoc.Edition = w.Edition
		whDoc.Object = w.Object
	}

	return &whDoc, nil
}

func (s *WhDbService) Create(ctx context.Context, t warhammer.WhType, w *warhammer.Wh) (*warhammer.Wh, error) {
	whDoc, err := newWhDocWrite(t, w)
	if err != nil {
		return nil, fmt.Errorf("failed to convert wh to write doc: %w", err)
	}

	_, err = s.Collections[t].InsertOne(ctx, whDoc)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			return nil, fmt.Errorf("wh already exists: %w", d.ErrConflict)
		}
		return nil, fmt.Errorf("failed to insert wh %v: %w", w, err)
	}

	return w, nil
}

func (s *WhDbService) Update(ctx context.Context, t warhammer.WhType, w *warhammer.Wh, userId string) (*warhammer.Wh, error) {
	id, err := bson.ObjectIDFromHex(w.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to calculate object id of %s: %w", w.Id, err)
	}

	findByIdQuery := bson.M{"$and": bson.A{bson.M{"_id": id}, bson.M{"ownerid": userId}}}

	// $set only the variants being written so other edition variants of the document are kept.
	set := bson.M{"visibility": w.Visibility}
	if warhammer.HasEditions(t) {
		for e, obj := range w.Editions {
			set[variantPath(e)] = obj
		}
	} else {
		set["object"] = w.Object
	}

	result, err := s.Collections[t].UpdateOne(ctx, findByIdQuery, bson.M{"$set": set})
	if err != nil {
		return nil, fmt.Errorf("failed to update wh in db: %w", err)
	}

	if result.MatchedCount == 0 {
		return nil, fmt.Errorf("wh not found in db: %w", d.ErrNotFound)
	}

	return w, nil
}

func (s *WhDbService) Delete(ctx context.Context, t warhammer.WhType, e warhammer.Edition, whId string, userId string) error {
	id, err := bson.ObjectIDFromHex(whId)
	if err != nil {
		return fmt.Errorf("failed to calculate object id of %s: %w", whId, err)
	}

	findByIdQuery := bson.A{bson.M{"_id": id}, bson.M{"ownerid": userId}}
	if e != "" {
		findByIdQuery = append(findByIdQuery, editionQuery(t, e))
	}

	if e == "" || !warhammer.HasEditions(t) {
		if _, err = s.Collections[t].DeleteOne(ctx, bson.M{"$and": findByIdQuery}); err != nil {
			return fmt.Errorf("failed to delete wh from db: %w", err)
		}
		return nil
	}

	// Remove the edition variant, then the document if it was the last variant.
	if _, err = s.Collections[t].UpdateOne(ctx, bson.M{"$and": findByIdQuery}, bson.M{"$unset": bson.M{variantPath(e): ""}}); err != nil {
		return fmt.Errorf("failed to delete wh edition from db: %w", err)
	}

	emptyQuery := bson.M{"$and": bson.A{bson.M{"_id": id}, bson.M{"ownerid": userId}, bson.M{"editions": bson.M{}}}}
	if _, err = s.Collections[t].DeleteOne(ctx, emptyQuery); err != nil {
		return fmt.Errorf("failed to delete wh from db: %w", err)
	}

	return nil
}

func (s *WhDbService) Retrieve(ctx context.Context, t warhammer.WhType, userIds []string, sharedUserIds []string, filter warhammer.WhFilter) ([]*warhammer.Wh, error) {
	andConditions := bson.A{allAllowedOwnersQuery(userIds, sharedUserIds)}

	if filter.Edition != "" {
		andConditions = append(andConditions, editionQuery(t, filter.Edition))
	}

	if len(filter.WhIds) != 0 {
		ids, err := idsQuery(filter.WhIds)
		if err != nil {
			return nil, err
		}
		andConditions = append(andConditions, ids)
	}

	if t == warhammer.WhTypeCareer {
		if len(filter.SkillIds) > 0 {
			andConditions = append(andConditions, careerLevelContainsQuery(filter.Edition, "skills", filter.SkillIds))
		}
		if len(filter.TalentIds) > 0 {
			andConditions = append(andConditions, careerLevelContainsQuery(filter.Edition, "talents", filter.TalentIds))
		}
	}

	cur, err := s.Collections[t].Find(ctx, bson.M{"$and": andConditions})

	if cur != nil {
		defer cur.Close(ctx)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to execute find db: %w", err)
	}

	whList := make([]*warhammer.Wh, 0)

	for cur.Next(context.Background()) {
		var doc whDocRead
		err := cur.Decode(&doc)
		if err != nil {
			return nil, fmt.Errorf("failed to decode wh: %w", err)
		}

		wh, err := whDocToWh(&doc, t, filter.Edition)
		if err != nil {
			return nil, fmt.Errorf("failed to convert doc to wh: %w", err)
		}

		whList = append(whList, wh)
	}

	return whList, nil
}

func idsQuery(whIds []string) (bson.M, error) {
	ids := bson.A{}
	for _, v := range whIds {
		id, err := bson.ObjectIDFromHex(v)
		if err != nil {
			continue
		}
		ids = append(ids, id)
	}
	return bson.M{"_id": bson.M{"$in": ids}}, nil
}

func allAllowedOwnersQuery(userIds []string, sharedUserIds []string) bson.M {
	allowedConditions := bson.A{
		bson.M{"visibility": int(warhammer.VisibilityPublic)},
	}

	if len(userIds) > 0 {
		allowedConditions = append(allowedConditions, bson.M{"ownerid": bson.M{"$in": userIds}})
	}

	if len(sharedUserIds) > 0 {
		sharedFilter := bson.M{
			"$and": bson.A{
				bson.M{"ownerid": bson.M{"$in": sharedUserIds}},
				bson.M{"visibility": int(warhammer.VisibilityShared)},
			},
		}
		allowedConditions = append(allowedConditions, sharedFilter)
	}

	return bson.M{"$or": allowedConditions}
}

func careerLevelContainsQuery(e warhammer.Edition, field string, ids []string) bson.M {
	path := variantPath(e)
	orConditions := bson.A{}
	for i := 1; i <= 5; i++ {
		orConditions = append(orConditions, bson.M{
			fmt.Sprintf("%s.level%d.exists", path, i):    true,
			fmt.Sprintf("%s.level%d.%s", path, i, field): bson.M{"$in": ids},
		})
	}
	return bson.M{"$or": orConditions}
}

// whDocToWh decodes a document; for content only variant e is decoded, or all variants when e is empty.
func whDocToWh(doc *whDocRead, t warhammer.WhType, e warhammer.Edition) (*warhammer.Wh, error) {
	wh := warhammer.Wh{
		Id:         doc.Id.Hex(),
		OwnerId:    doc.OwnerId,
		Visibility: doc.Visibility,
	}

	if !warhammer.HasEditions(t) {
		wh.Edition = doc.Edition
		wh.Object = warhammer.NewWhObject(t)
		if err := bson.Unmarshal(doc.Object, wh.Object); err != nil {
			return nil, fmt.Errorf("failed to unmarshal object: %w", err)
		}
		return &wh, nil
	}

	wh.Editions = make(map[warhammer.Edition]warhammer.WhObject, len(doc.Editions))
	for docEdition, raw := range doc.Editions {
		if e != "" && docEdition != e {
			continue
		}
		obj := warhammer.NewWhObject(t)
		if err := bson.Unmarshal(raw, obj); err != nil {
			return nil, fmt.Errorf("failed to unmarshal %s variant: %w", docEdition, err)
		}
		wh.Editions[docEdition] = obj
	}

	return &wh, nil
}

func (s *WhDbService) RetrieveGenerationProps(ctx context.Context) (*warhammer.GenProps, error) {
	filter := bson.M{"name": "generationProps"}
	var genProps warhammer.GenProps

	err := s.Collections[warhammer.WhTypeOther].FindOne(ctx, filter).Decode(&genProps)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, fmt.Errorf("generationProps not found in db: %w", d.ErrNotFound)
		}
		return nil, fmt.Errorf("failed to get generationProps from db: %w", err)
	}

	return &genProps, nil
}

func (s *WhDbService) CreateGenerationProps(ctx context.Context, gp *warhammer.GenProps) (*warhammer.GenProps, error) {
	_, err := s.Collections[warhammer.WhTypeOther].InsertOne(ctx, gp)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			return nil, fmt.Errorf("generationProps already exists: %w", d.ErrConflict)
		}
		return nil, fmt.Errorf("failed to create generationProps: %w", err)
	}

	return gp, nil
}
