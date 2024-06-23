package mongodb

import (
	"context"
	"errors"
	"fmt"
	d "github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
)

type WhDbService struct {
	Db          *DbService
	Collections map[warhammer.WhType]*mongo.Collection
}

func NewWhDbService(db *DbService, createIndex bool) *WhDbService {
	collections := map[warhammer.WhType]*mongo.Collection{}

	for _, whType := range warhammer.WhCoreTypes {
		collections[whType] = db.Client.Database(db.DbName).Collection(string(whType))
	}
	collections[warhammer.WhTypeOther] = db.Client.Database(db.DbName).Collection(warhammer.WhTypeOther)
	if createIndex {
		createIndexOnField("name", collections[warhammer.WhTypeOther])
	}

	return &WhDbService{Db: db, Collections: collections}
}

func createIndexOnField(fieldName string, collection *mongo.Collection) {
	unique := true
	mod := mongo.IndexModel{Keys: bson.M{fieldName: 1}, Options: &options.IndexOptions{Unique: &unique}}
	_, err := collection.Indexes().CreateOne(context.TODO(), mod)
	if err != nil {
		log.Fatal(err)
	}
}

func (s *WhDbService) Create(ctx context.Context, t warhammer.WhType, w *warhammer.Wh) (*warhammer.Wh, error) {
	whBsonM, err := whToBsonM(w)
	if err != nil {
		return nil, fmt.Errorf("failed to convert wh to bson map: %w", err)
	}

	_, err = s.Collections[t].InsertOne(ctx, whBsonM)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			return nil, &d.DbError{Type: d.ErrorDbConflict, Err: fmt.Errorf("failed to insert wh %v", whBsonM)}
		}
		return nil, fmt.Errorf("failed to insert wh %v", whBsonM)
	}

	return w, nil
}

func whToBsonM(w *warhammer.Wh) (bson.M, error) {
	wBson, err := bson.Marshal(w)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal object: %w", err)
	}

	var whMap bson.M
	err = bson.Unmarshal(wBson, &whMap)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal object: %w", err)
	}

	id, err := primitive.ObjectIDFromHex(w.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to calculate object id of %s: %w", w.Id, err)
	}

	delete(whMap, "canedit")
	delete(whMap, "id")
	whMap["_id"] = id

	return whMap, err
}

func (s *WhDbService) Update(ctx context.Context, t warhammer.WhType, w *warhammer.Wh, userId string) (*warhammer.Wh, error) {
	id, err := primitive.ObjectIDFromHex(w.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to calculate object id of %s: %w", w.Id, err)
	}

	whBsonM, err := whToBsonM(w)
	if err != nil {
		return nil, fmt.Errorf("failed to convert wh to bson map: %w", err)
	}

	findByIdQuery := bson.M{"$and": bson.A{bson.M{"_id": id}, bson.M{"ownerid": userId}}}

	result, err := s.Collections[t].UpdateOne(ctx, findByIdQuery, bson.M{"$set": whBsonM})
	if err != nil {
		return nil, fmt.Errorf("failed to update wh in db: %w", err)
	}

	if result.MatchedCount == 0 {
		return nil, &d.DbError{Type: d.ErrorDbNotFound, Err: fmt.Errorf("wh not found in db")}
	}

	return w, nil
}

func (s *WhDbService) Delete(ctx context.Context, t warhammer.WhType, whId string, userId string) error {
	id, err := primitive.ObjectIDFromHex(whId)
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
	defer cur.Close(ctx)

	if err != nil {
		return nil, fmt.Errorf("failed to execute find db: %w", err)
	}

	var whList []*warhammer.Wh

	for cur.Next(context.Background()) {
		var whMap bson.M
		err := cur.Decode(&whMap)
		if err != nil {
			return nil, fmt.Errorf("failed to decode wh: %w", err)
		}

		wh, err := bsonMToWh(whMap, t)
		if err != nil {
			return nil, fmt.Errorf("failed to convert bsonM to wh: %w", err)
		}

		whList = append(whList, wh)
	}

	return whList, nil
}

func idsQuery(whIds []string) (bson.M, error) {
	ids := bson.A{}
	for _, v := range whIds {
		id, err := primitive.ObjectIDFromHex(v)
		if err != nil {
			return nil, fmt.Errorf("failed to calculate object id of %s: %w", v, err)
		}
		ids = append(ids, bson.M{"_id": id})
	}
	return bson.M{"$or": ids}, nil
}

func allAllowedOwnersQuery(userIds []string, sharedUserIds []string) bson.M {
	owners := bson.A{}
	for _, v := range userIds {
		owners = append(owners, bson.M{"ownerid": v})
	}

	if sharedUserIds != nil && len(sharedUserIds) > 0 {
		sharedOwners := bson.A{}
		for _, v := range sharedUserIds {
			sharedOwners = append(sharedOwners, bson.M{"ownerid": v})
		}
		owners = append(owners, bson.M{"$and": bson.A{bson.M{"object.shared": true}, bson.M{"$or": sharedOwners}}})
	}
	return bson.M{"$or": owners}
}

func bsonMToWh(whMap bson.M, t warhammer.WhType) (*warhammer.Wh, error) {
	id, ok := whMap["_id"].(primitive.ObjectID)
	if !ok {
		return nil, fmt.Errorf("invalid object id")
	}

	ownerId, ok := whMap["ownerid"].(string)
	if !ok {
		return nil, fmt.Errorf("invalid owner id")
	}

	bsonRaw, err := bson.Marshal(whMap["object"])
	if err != nil {
		return nil, fmt.Errorf("error marshaling object")
	}

	wh := warhammer.Wh{Id: id.Hex(), OwnerId: ownerId, CanEdit: false}
	wh.Object = warhammer.NewWhObject(t)

	if err = bson.Unmarshal(bsonRaw, wh.Object); err != nil {
		return nil, fmt.Errorf("error marshaling object")
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
