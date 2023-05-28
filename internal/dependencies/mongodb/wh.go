package mongodb

import (
	"context"
	"errors"
	d "github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type WhDbService struct {
	Db          *DbService
	Collections map[warhammer.WhType]*mongo.Collection
}

func NewWhDbService(db *DbService) *WhDbService {
	collections := map[warhammer.WhType]*mongo.Collection{}

	for _, whType := range warhammer.WhTypes {
		collections[whType] = db.Client.Database(db.DbName).Collection(string(whType))
	}
	return &WhDbService{Db: db, Collections: collections}
}

func (s *WhDbService) Retrieve(ctx context.Context, t warhammer.WhType, whId string, userIds []string, sharedUserIds []string) (*warhammer.Wh, *d.DbError) {
	id, err := primitive.ObjectIDFromHex(whId)
	if err != nil {
		return nil, d.CreateDbError(d.DbInternalError, err)
	}

	filter := bson.M{"$and": bson.A{bson.M{"_id": id}, allAllowedOwnersQuery(userIds, sharedUserIds)}}
	var whMap bson.M

	err = s.Collections[t].FindOne(ctx, filter).Decode(&whMap)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, d.CreateDbError(d.DbNotFoundError, err)
		} else {
			return nil, d.CreateDbError(d.DbInternalError, err)
		}
	}

	wh, err := bsonMToWh(whMap, t)
	if err != nil {
		return nil, d.CreateDbError(d.DbInternalError, err)
	}

	return wh, nil
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
		owners = append(owners, bson.M{"$and": bson.A{bson.M{"shared": true}, bson.M{"$or": sharedOwners}}})
	}
	return bson.M{"$or": owners}
}

func bsonMToWh(whMap bson.M, t warhammer.WhType) (*warhammer.Wh, error) {
	id, ok := whMap["_id"].(primitive.ObjectID)
	if !ok {
		return nil, errors.New("invalid object id")
	}

	ownerId, ok := whMap["ownerid"].(string)
	if !ok {
		return nil, errors.New("invalid owner id")
	}

	wh, err := warhammer.NewWh(t)
	if err != nil {
		return nil, err
	}

	wh.Id = id.Hex()
	wh.OwnerId = ownerId
	wh.CanEdit = false

	bsonRaw, err := bson.Marshal(whMap["object"])
	if err != nil {
		return nil, errors.New("error marshaling object")
	}

	if err = bson.Unmarshal(bsonRaw, wh.Object); err != nil {
		return nil, errors.New("error unmarshalling object")
	}

	return &wh, nil
}

func (s *WhDbService) Create(ctx context.Context, t warhammer.WhType, w *warhammer.Wh) (*warhammer.Wh, *d.DbError) {
	whBsonM, err := whToBsonM(w)
	if err != nil {
		return nil, d.CreateDbError(d.DbWriteToDbError, err)
	}

	_, err = s.Collections[t].InsertOne(ctx, whBsonM)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			return nil, d.CreateDbError(d.DbAlreadyExistsError, err)
		}
		return nil, d.CreateDbError(d.DbWriteToDbError, err)
	}

	return w, nil
}

func whToBsonM(w *warhammer.Wh) (bson.M, error) {
	wBson, err := bson.Marshal(w)
	if err != nil {
		return nil, err
	}

	var whMap bson.M
	err = bson.Unmarshal(wBson, &whMap)
	if err != nil {
		return nil, err
	}

	id, err := primitive.ObjectIDFromHex(w.Id)
	if err != nil {
		return nil, err
	}

	delete(whMap, "canedit")
	delete(whMap, "id")
	whMap["_id"] = id

	return whMap, err
}

func (s *WhDbService) Update(ctx context.Context, t warhammer.WhType, w *warhammer.Wh, userId string) (*warhammer.Wh, *d.DbError) {
	id, err := primitive.ObjectIDFromHex(w.Id)
	if err != nil {
		return nil, d.CreateDbError(d.DbInternalError, err)
	}

	whBsonM, err := whToBsonM(w)
	if err != nil {
		return nil, d.CreateDbError(d.DbWriteToDbError, err)
	}

	findByIdQuery := bson.M{"$and": bson.A{bson.M{"_id": id}, bson.M{"ownerid": userId}}}

	result, err := s.Collections[t].UpdateOne(ctx, findByIdQuery, bson.M{"$set": whBsonM})
	if err != nil {
		return nil, d.CreateDbError(d.DbInternalError, err)
	}

	if result.MatchedCount == 0 {
		return nil, d.CreateDbError(d.DbNotFoundError, err)
	}

	return w, nil
}

func (s *WhDbService) Delete(ctx context.Context, t warhammer.WhType, whId string, userId string) *d.DbError {
	id, err := primitive.ObjectIDFromHex(whId)
	if err != nil {
		return d.CreateDbError(d.DbInternalError, err)
	}

	_, err = s.Collections[t].DeleteOne(ctx, bson.M{"$and": bson.A{bson.M{"_id": id}, bson.M{"ownerid": userId}}})
	if err != nil {
		return d.CreateDbError(d.DbInternalError, err)
	}

	return nil
}

func (s *WhDbService) RetrieveAll(ctx context.Context, t warhammer.WhType, userIds []string, sharedUserIds []string) ([]*warhammer.Wh, *d.DbError) {
	filter := allAllowedOwnersQuery(userIds, sharedUserIds)

	cur, err := s.Collections[t].Find(ctx, filter)
	defer cur.Close(ctx)

	if err != nil {
		return nil, d.CreateDbError(d.DbInternalError, err)
	}

	var whList []*warhammer.Wh

	for cur.Next(context.Background()) {
		var whMap bson.M
		err := cur.Decode(&whMap)
		if err != nil {
			return nil, d.CreateDbError(d.DbInternalError, err)
		}

		wh, err := bsonMToWh(whMap, t)
		if err != nil {
			return nil, d.CreateDbError(d.DbInternalError, err)
		}

		whList = append(whList, wh)
	}

	return whList, nil
}
