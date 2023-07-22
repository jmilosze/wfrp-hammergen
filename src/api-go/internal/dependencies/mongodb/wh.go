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
)

type WhDbService struct {
	Db          *DbService
	Collections map[warhammer.WhType]*mongo.Collection
}

func NewWhDbService(db *DbService) *WhDbService {
	collections := map[warhammer.WhType]*mongo.Collection{}

	for _, whType := range warhammer.WhApiTypes {
		collections[whType] = db.Client.Database(db.DbName).Collection(string(whType))
	}
	collections[warhammer.WhTypeOther] = db.Client.Database(db.DbName).Collection(warhammer.WhTypeOther)

	return &WhDbService{Db: db, Collections: collections}
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

func idsQuery(whIds []string) (bson.M, error) {
	ids := bson.A{}
	for _, v := range whIds {
		id, err := primitive.ObjectIDFromHex(v)
		if err != nil {
			return nil, errors.New("invalid id")
		}
		ids = append(ids, bson.M{"_id": id})
	}
	return bson.M{"$or": ids}, nil
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

	bsonRaw, err := bson.Marshal(whMap["object"])
	if err != nil {
		return nil, errors.New("error marshaling object")
	}

	wh := warhammer.Wh{Id: id.Hex(), OwnerId: ownerId, CanEdit: false}
	switch t {
	case warhammer.WhTypeMutation:
		mutation := warhammer.Mutation{}
		if err = bson.Unmarshal(bsonRaw, &mutation); err != nil {
			return nil, err
		}
		wh.Object = mutation
	case warhammer.WhTypeSpell:
		spell := warhammer.Spell{}
		if err = bson.Unmarshal(bsonRaw, &spell); err != nil {
			return nil, err
		}
		wh.Object = spell
	case warhammer.WhTypeProperty:
		property := warhammer.Property{}
		if err = bson.Unmarshal(bsonRaw, &property); err != nil {
			return nil, err
		}
		wh.Object = property
	case warhammer.WhTypeItem:
		item := warhammer.Item{}
		if err = bson.Unmarshal(bsonRaw, &item); err != nil {
			return nil, err
		}
		wh.Object = item
	case warhammer.WhTypeTalent:
		talent := warhammer.Talent{}
		if err = bson.Unmarshal(bsonRaw, &talent); err != nil {
			return nil, err
		}
		wh.Object = talent
	case warhammer.WhTypeSkill:
		skill := warhammer.Skill{}
		if err = bson.Unmarshal(bsonRaw, &skill); err != nil {
			return nil, err
		}
		wh.Object = skill
	case warhammer.WhTypeCareer:
		career := warhammer.Career{}
		if err = bson.Unmarshal(bsonRaw, &career); err != nil {
			return nil, err
		}
		wh.Object = career
	case warhammer.WhTypeCharacter:
		character := warhammer.Character{}
		if err = bson.Unmarshal(bsonRaw, &character); err != nil {
			return nil, err
		}
		wh.Object = character
	default:
		return nil, fmt.Errorf("invalid Wh type %s", t)
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
			return nil, d.CreateDbError(d.DbConflictError, err)
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

func (s *WhDbService) Retrieve(ctx context.Context, t warhammer.WhType, userIds []string, sharedUserIds []string, whIds []string) ([]*warhammer.Wh, *d.DbError) {
	var filter bson.M

	if len(whIds) != 0 {
		ids, err := idsQuery(whIds)
		if err != nil {
			return nil, d.CreateDbError(d.DbInternalError, err)
		}
		filter = bson.M{"$and": bson.A{ids, allAllowedOwnersQuery(userIds, sharedUserIds)}}
	} else {
		filter = allAllowedOwnersQuery(userIds, sharedUserIds)
	}

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

	if len(whIds) != 0 && len(whList) != len(whIds) {
		return nil, d.CreateDbError(d.DbNotFoundError, errors.New("some of the ids not found"))
	}

	return whList, nil
}

func (s *WhDbService) RetrieveGenerationProps(ctx context.Context) (*warhammer.GenProps, *d.DbError) {
	filter := bson.M{"name": "generationProps"}
	var genProps warhammer.GenProps

	err := s.Collections[warhammer.WhTypeOther].FindOne(ctx, filter).Decode(&genProps)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, d.CreateDbError(d.DbNotFoundError, err)
		} else {
			return nil, d.CreateDbError(d.DbInternalError, err)
		}
	}

	return &genProps, nil
}

func (s *WhDbService) CreateGenerationProps(ctx context.Context, gp *warhammer.GenProps) (*warhammer.GenProps, *d.DbError) {
	_, err := s.Collections[warhammer.WhTypeOther].InsertOne(ctx, gp)
	if err != nil {
		if mongo.IsDuplicateKeyError(err) {
			return nil, d.CreateDbError(d.DbConflictError, err)
		}
		return nil, d.CreateDbError(d.DbWriteToDbError, err)
	}

	return gp, nil
}
