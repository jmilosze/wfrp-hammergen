package mongodb

import (
	"context"
	"errors"
	"fmt"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/user"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"time"
)

const userCollectionName = "user"

type Mongo struct {
	Id                 primitive.ObjectID   `bson:"_id"`
	Username           string               `bson:"username"`
	PasswordHash       []byte               `bson:"passwordHash"`
	Admin              bool                 `bson:"admin"`
	SharedAccountIds   []primitive.ObjectID `bson:"sharedAccountIds"`
	SharedAccountNames []string             `bson:"sharedAccountNames,omitempty"`
	CreatedOn          time.Time            `bson:"createdOn"`
	LastAuthOn         time.Time            `bson:"lastAuthOn"`
}

type UserDbService struct {
	Db         *DbService
	Collection *mongo.Collection
}

func NewUserDbService(db *DbService, createIndex bool) *UserDbService {
	coll := db.Client.Database(db.DbName).Collection(userCollectionName)

	if createIndex {
		unique := true
		mod := mongo.IndexModel{Keys: bson.M{"username": 1}, Options: &options.IndexOptions{Unique: &unique}}
		_, err := coll.Indexes().CreateOne(context.TODO(), mod)
		if err != nil {
			log.Fatal(err)
		}
	}

	return &UserDbService{Db: db, Collection: coll}
}

func (s *UserDbService) Retrieve(ctx context.Context, fieldName string, fieldValue string) (*user.User, *domain.DbError) {
	if fieldName != "username" && fieldName != "id" {
		return nil, &domain.DbError{Type: domain.DbInvalidUserFieldError, Err: fmt.Errorf("invalid field name %s", fieldName)}
	}

	var matchStage bson.D
	if fieldName == "id" {
		id, err := primitive.ObjectIDFromHex(fieldValue)
		if err != nil {
			return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
		}
		matchStage = bson.D{{"$match", bson.D{{"_id", id}}}}
	} else {
		matchStage = bson.D{{"$match", bson.D{{"username", fieldValue}}}}
	}
	unwindStage := bson.D{{"$unwind", bson.D{
		{"path", "$sharedAccountIds"},
		{"preserveNullAndEmptyArrays", true},
	}}}
	lookupStage := bson.D{{"$lookup", bson.D{
		{"from", s.Collection.Name()},
		{"localField", "sharedAccountIds"},
		{"foreignField", "_id"},
		{"as", "sharedAcc"},
	}}}
	groupStage := bson.D{{"$group", bson.D{
		{"_id", "$_id"},
		{"sharedAccountIds", bson.D{{"$push", bson.D{{"$arrayElemAt", bson.A{"$sharedAcc._id", 0}}}}}},
		{"sharedAccountNames", bson.D{{"$push", bson.D{{"$arrayElemAt", bson.A{"$sharedAcc.username", 0}}}}}},
		{"username", bson.D{{"$first", "$username"}}},
		{"passwordHash", bson.D{{"$first", "$passwordHash"}}},
		{"admin", bson.D{{"$first", "$admin"}}},
		{"createdOn", bson.D{{"$first", "$createdOn"}}},
		{"lastAuthOn", bson.D{{"$first", "$lastAuthOn"}}},
	}}}

	cur, err := s.Collection.Aggregate(ctx, mongo.Pipeline{matchStage, unwindStage, lookupStage, groupStage})
	defer cur.Close(ctx)
	if err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	var userMongo Mongo
	ok := cur.Next(ctx)
	if !ok {
		return nil, &domain.DbError{Type: domain.DbNotFoundError, Err: errors.New("user not found")}
	}
	err = cur.Decode(&userMongo)
	if err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	return newUserFromMongo(&userMongo, nil), nil
}

func getMany(ctx context.Context, coll *mongo.Collection, fieldName string, fieldValues []string) ([]*Mongo, *domain.DbError) {
	getAll := false
	if fieldValues == nil {
		getAll = true
	} else {
		if len(fieldValues) == 0 {
			return []*Mongo{}, nil
		}
	}

	var query bson.D
	if !getAll {
		var queryValueList []bson.D
		for _, fieldValue := range fieldValues {
			if fieldName == "username" {
				queryValueList = append(queryValueList, bson.D{{"username", fieldValue}})
			} else {
				id, err := primitive.ObjectIDFromHex(fieldValue)
				if err != nil {
					return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
				}
				queryValueList = append(queryValueList, bson.D{{"_id", id}})
			}
		}
		query = bson.D{{"$or", queryValueList}}
	} else {
		query = bson.D{{}}
	}

	cur, err := coll.Find(ctx, query)
	if err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	users := make([]*Mongo, 0)
	for cur.Next(ctx) {
		var user Mongo
		if err := cur.Decode(&user); err != nil {
			return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
		}
		users = append(users, &user)
	}

	if err := cur.Close(ctx); err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	return users, nil
}

func (s *UserDbService) RetrieveAll(ctx context.Context) ([]*user.User, *domain.DbError) {
	mongoUsers, err := getMany(ctx, s.Collection, "username", nil)
	if err != nil {
		return nil, err
	}

	users := make([]*user.User, len(mongoUsers))
	for i, u := range mongoUsers {
		users[i] = newUserFromMongo(u, mongoUsers)
	}

	return users, nil
}

func (s *UserDbService) Create(ctx context.Context, u *user.User) (*user.User, *domain.DbError) {
	linkedUsers, dbErr := getLinkedUsers(ctx, s.Collection, u.SharedAccountNames)
	if dbErr != nil {
		return nil, dbErr
	}

	userMongoDb, err := newMongoFromUser(u, linkedUsers)
	if err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	filter := bson.D{{"_id", userMongoDb.Id}}
	opts := options.Replace().SetUpsert(true)
	if _, err := s.Collection.ReplaceOne(ctx, filter, userMongoDb, opts); err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	return newUserFromMongo(userMongoDb, linkedUsers), nil
}

func getLinkedUsers(ctx context.Context, col *mongo.Collection, sharedAccounts []string) ([]*Mongo, *domain.DbError) {
	linkedUsers := make([]*Mongo, 0)
	if sharedAccounts != nil {
		var err *domain.DbError
		linkedUsers, err = getMany(ctx, col, "username", sharedAccounts)
		if err != nil {
			return nil, err
		}
	}
	return linkedUsers, nil
}

func newMongoFromUser(u *user.User, linkedUsers []*Mongo) (*Mongo, error) {
	id, err := primitive.ObjectIDFromHex(u.Id)
	if err != nil {
		return nil, err
	}

	userMongo := Mongo{
		Id:               id,
		Username:         u.Username,
		PasswordHash:     u.PasswordHash,
		Admin:            u.Admin,
		SharedAccountIds: usernamesToIds(u.SharedAccountNames, linkedUsers),
		CreatedOn:        u.CreatedOn,
		LastAuthOn:       u.LastAuthOn,
	}

	return &userMongo, nil
}

func usernamesToIds(usernames []string, us []*Mongo) []primitive.ObjectID {
	userMap := map[string]primitive.ObjectID{}
	for _, u := range us {
		userMap[u.Username] = u.Id
	}

	ids := make([]primitive.ObjectID, 0)
	for _, u := range usernames {
		if id, ok := userMap[u]; ok {
			ids = append(ids, id)
		}
	}
	return ids
}

func newUserFromMongo(u *Mongo, linkedUsers []*Mongo) *user.User {
	var sharedAccountIds []string
	if u.SharedAccountIds != nil {
		sharedAccountIds = make([]string, len(u.SharedAccountIds))
		for i, sa := range u.SharedAccountIds {
			sharedAccountIds[i] = sa.Hex()
		}
	} else {
		sharedAccountIds = nil
	}

	user := user.EmptyUser()
	user.Id = u.Id.Hex()
	user.Username = u.Username
	user.Admin = u.Admin
	user.SharedAccountIds = sharedAccountIds
	if linkedUsers != nil {
		user.SharedAccountNames = idsToUsernames(u.SharedAccountIds, linkedUsers)
	} else {
		user.SharedAccountNames = u.SharedAccountNames
	}
	if u.PasswordHash != nil {
		user.PasswordHash = u.PasswordHash
	}
	user.CreatedOn = u.CreatedOn
	user.LastAuthOn = u.LastAuthOn

	return user
}

func idsToUsernames(ids []primitive.ObjectID, users []*Mongo) []string {
	userMap := map[primitive.ObjectID]string{}
	for _, u := range users {
		userMap[u.Id] = u.Username
	}

	usernames := make([]string, 0)
	for _, id := range ids {
		if username, ok := userMap[id]; ok {
			usernames = append(usernames, username)
		}
	}
	return usernames
}

func (s *UserDbService) Update(ctx context.Context, user *user.User) (*user.User, *domain.DbError) {
	linkedUsers, dbErr := getLinkedUsers(ctx, s.Collection, user.SharedAccountNames)
	if dbErr != nil {
		return nil, dbErr
	}

	userMongo, err := newMongoFromUser(user, linkedUsers)
	if err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	result, err := s.Collection.UpdateOne(ctx, bson.D{{"_id", userMongo.Id}}, bson.D{{"$set", userMongo}})
	if err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	if result.MatchedCount == 0 {
		return nil, &domain.DbError{Type: domain.DbNotFoundError, Err: errors.New("user not found")}
	}

	return newUserFromMongo(userMongo, linkedUsers), nil
}

func (s *UserDbService) Delete(ctx context.Context, id string) *domain.DbError {
	idObject, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	_, err = s.Collection.DeleteOne(ctx, bson.D{{"_id", idObject}})
	if err != nil {
		return &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	return nil
}
