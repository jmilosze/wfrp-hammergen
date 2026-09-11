package mongodb

import (
	"context"
	"errors"
	"fmt"
	"log"

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

type whDocWrite struct {
	Id         bson.ObjectID        `bson:"_id"`
	OwnerId    string               `bson:"ownerid"`
	Visibility warhammer.Visibility `bson:"visibility"`
	Object     warhammer.WhObject   `bson:"object"`
}

type whDocRead struct {
	Id         bson.ObjectID        `bson:"_id"`
	OwnerId    string               `bson:"ownerid"`
	Visibility warhammer.Visibility `bson:"visibility"`
	Object     bson.Raw             `bson:"object"`
}

func NewWhDbService(db *DbService, createIndex bool) *WhDbService {
	collections := map[warhammer.WhType]*mongo.Collection{}

	for _, whCoreType := range warhammer.WhCoreTypes {
		collections[whCoreType] = db.Client.Database(db.DbName).Collection(string(whCoreType))
	}
	collections[warhammer.WhTypeOther] = db.Client.Database(db.DbName).Collection(warhammer.WhTypeOther)
	if createIndex {
		createIndexOnField("name", collections[warhammer.WhTypeOther])
	}

	return &WhDbService{Db: db, Collections: collections}
}

func createIndexOnField(fieldName string, collection *mongo.Collection) {
	mod := mongo.IndexModel{
		Keys:    bson.D{{Key: fieldName, Value: 1}},
		Options: options.Index().SetUnique(true),
	}
	_, err := collection.Indexes().CreateOne(context.TODO(), mod)
	if err != nil {
		log.Fatal(err)
	}
}

func newWhDocWrite(w *warhammer.Wh) (*whDocWrite, error) {
	id, err := bson.ObjectIDFromHex(w.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to calculate object id of %s: %w", w.Id, err)
	}

	return &whDocWrite{
		Id:         id,
		OwnerId:    w.OwnerId,
		Visibility: w.Visibility,
		Object:     w.Object,
	}, nil
}

func (s *WhDbService) Create(ctx context.Context, t warhammer.WhType, w *warhammer.Wh) (*warhammer.Wh, error) {
	whDoc, err := newWhDocWrite(w)
	if err != nil {
		return nil, fmt.Errorf("failed to convert wh to write doc: %w", err)
	}

	_, err = s.Collections[t].InsertOne(ctx, whDoc)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			return nil, &d.DbError{Type: d.ErrorDbConflict, Err: fmt.Errorf("failed to insert wh %v", w)}
		}
		return nil, fmt.Errorf("failed to insert wh %v: %w", w, err)
	}

	return w, nil
}

func (s *WhDbService) Update(ctx context.Context, t warhammer.WhType, w *warhammer.Wh, userId string) (*warhammer.Wh, error) {
	whDoc, err := newWhDocWrite(w)
	if err != nil {
		return nil, fmt.Errorf("failed to convert wh to write doc: %w", err)
	}

	findByIdQuery := bson.M{"$and": bson.A{bson.M{"_id": whDoc.Id}, bson.M{"ownerid": userId}}}

	result, err := s.Collections[t].ReplaceOne(ctx, findByIdQuery, whDoc)
	if err != nil {
		return nil, fmt.Errorf("failed to update wh in db: %w", err)
	}

	if result.MatchedCount == 0 {
		return nil, &d.DbError{Type: d.ErrorDbNotFound, Err: fmt.Errorf("wh not found in db")}
	}

	return w, nil
}

func (s *WhDbService) Delete(ctx context.Context, t warhammer.WhType, whId string, userId string) error {
	id, err := bson.ObjectIDFromHex(whId)
	if err != nil {
		return fmt.Errorf("failed to calculate object id of %s: %w", whId, err)
	}

	_, err = s.Collections[t].DeleteOne(ctx, bson.M{"$and": bson.A{bson.M{"_id": id}, bson.M{"ownerid": userId}}})
	if err != nil {
		return fmt.Errorf("failed to delete wh from db: %w", err)
	}

	return nil
}

func (s *WhDbService) Retrieve(ctx context.Context, t warhammer.WhType, userIds []string, sharedUserIds []string, whIds []string) ([]*warhammer.Wh, error) {
	var filter bson.M

	if len(whIds) != 0 {
		ids, err := idsQuery(whIds)
		if err != nil {
			return nil, err
		}
		filter = bson.M{"$and": bson.A{ids, allAllowedOwnersQuery(userIds, sharedUserIds)}}
	} else {
		filter = allAllowedOwnersQuery(userIds, sharedUserIds)
	}

	cur, err := s.Collections[t].Find(ctx, filter)

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

		wh, err := whDocToWh(&doc, t)
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
		ids = append(ids, bson.M{"_id": id})
	}
	if len(ids) == 0 {
		return bson.M{"_id": bson.M{"$in": bson.A{}}}, nil
	}
	return bson.M{"$or": ids}, nil
}

func allAllowedOwnersQuery(userIds []string, sharedUserIds []string) bson.M {
	allowedConditions := bson.A{
		bson.M{"visibility": int(warhammer.VisibilityPublic)},
	}

	for _, v := range userIds {
		allowedConditions = append(allowedConditions, bson.M{"ownerid": v})
	}

	if len(sharedUserIds) > 0 {
		sharedOwners := bson.A{}
		for _, v := range sharedUserIds {
			sharedOwners = append(sharedOwners, bson.M{"ownerid": v})
		}
		sharedFilter := bson.M{
			"$and": bson.A{
				bson.M{"$or": sharedOwners},
				bson.M{"visibility": int(warhammer.VisibilityShared)},
			},
		}
		allowedConditions = append(allowedConditions, sharedFilter)
	}

	return bson.M{"$or": allowedConditions}
}

func whDocToWh(doc *whDocRead, t warhammer.WhType) (*warhammer.Wh, error) {
	wh := warhammer.Wh{
		Id:         doc.Id.Hex(),
		OwnerId:    doc.OwnerId,
		Visibility: doc.Visibility,
		Object:     warhammer.NewWhObject(t),
	}

	if err := bson.Unmarshal(doc.Object, wh.Object); err != nil {
		return nil, fmt.Errorf("failed to unmarshal object: %w", err)
	}

	return &wh, nil
}

func (s *WhDbService) RetrieveGenerationProps(ctx context.Context) (*warhammer.GenProps, error) {
	filter := bson.M{"name": "generationProps"}
	var genProps warhammer.GenProps

	err := s.Collections[warhammer.WhTypeOther].FindOne(ctx, filter).Decode(&genProps)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, &d.DbError{Type: d.ErrorDbNotFound, Err: fmt.Errorf("generationProps not found in db: %w", err)}
		} else {
			return nil, fmt.Errorf("failed to get generationProps from db")
		}
	}

	return &genProps, nil
}

func (s *WhDbService) CreateGenerationProps(ctx context.Context, gp *warhammer.GenProps) (*warhammer.GenProps, error) {
	_, err := s.Collections[warhammer.WhTypeOther].InsertOne(ctx, gp)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			return nil, &d.DbError{Type: d.ErrorDbConflict, Err: fmt.Errorf("generationProps already exists: %w", err)}
		}
		return nil, fmt.Errorf("failed to create generationProps: %w", err)
	}

	return gp, nil
}
