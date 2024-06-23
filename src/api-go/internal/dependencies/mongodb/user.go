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
		createIndexOnField("username", coll)
	}

	return &UserDbService{Db: db, Collection: coll}
}

func (s *UserDbService) Retrieve(ctx context.Context, fieldName string, fieldValue string) (*user.User, error) {
	if fieldName != "username" && fieldName != "id" {
		return nil, fmt.Errorf("invalid field name %s", fieldName)
	}

	var matchStage bson.D
	if fieldName == "id" {
		id, err := primitive.ObjectIDFromHex(fieldValue)
		if err != nil {
			return nil, fmt.Errorf("failed to calculate object id of %s: %w", fieldValue, err)
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
		return nil, fmt.Errorf("failed to query aggregate: %w", err)
	}

	var userMongo Mongo
	ok := cur.Next(ctx)
	if !ok {
		return nil, &domain.DbError{Type: domain.ErrorDbNotFound, Err: fmt.Errorf("user not found db")}
	}
	err = cur.Decode(&userMongo)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal user: %w", err)
	}

	newUser := newUserFromMongo(&userMongo, nil)

	return newUser, nil
}

func getMany(ctx context.Context, coll *mongo.Collection, fieldName string, fieldValues []string) ([]*Mongo, error) {
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
					return nil, fmt.Errorf("failed to calculate object id of %s: %w", fieldValue, err)
				}
				queryValueList = append(queryValueList, bson.D{{"_id", id}})
			}
		}
		query = bson.D{{"$or", queryValueList}}
	} else {
		query = bson.D{{}}
	}

	cur, err := coll.Find(ctx, query)
	defer cur.Close(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to executre find query: %w", err)
	}

	users := make([]*Mongo, 0)
	for cur.Next(ctx) {
		var u Mongo
		if err := cur.Decode(&u); err != nil {
			return nil, fmt.Errorf("failed to unmarshal users: %w", err)
		}
		users = append(users, &u)
	}

	return users, nil
}

func (s *UserDbService) RetrieveAll(ctx context.Context) ([]*user.User, error) {
	mongoUsers, err := getMany(ctx, s.Collection, "username", nil)
	if err != nil {
		return nil, fmt.Errorf("failed to get users from db: %w", err)
	}

	users := make([]*user.User, len(mongoUsers))
	for i, u := range mongoUsers {
		users[i] = newUserFromMongo(u, mongoUsers)
	}

	return users, nil
}

func (s *UserDbService) Create(ctx context.Context, u *user.User) (*user.User, error) {
	linkedUsers, dbErr := getLinkedUsers(ctx, s.Collection, u.SharedAccountNames)
	if dbErr != nil {
		return nil, dbErr
	}

	userMongoDb, err := newMongoFromUser(u, linkedUsers)
	if err != nil {
		return nil, fmt.Errorf("failed to create mongo-user from user: %w", err)
	}

	_, err = s.Collection.InsertOne(ctx, userMongoDb)
	if err != nil {
		wErr := fmt.Errorf("failed to insert mongo-user: %w", err)
		if mongo.IsDuplicateKeyError(err) {
			return nil, &domain.DbError{Type: domain.ErrorDbConflict, Err: wErr}
		} else {
			return nil, wErr
		}
	}

	return newUserFromMongo(userMongoDb, linkedUsers), nil
}

func getLinkedUsers(ctx context.Context, col *mongo.Collection, sharedAccounts []string) ([]*Mongo, error) {
	linkedUsers := make([]*Mongo, 0)
	if sharedAccounts != nil {
		var err error
		linkedUsers, err = getMany(ctx, col, "username", sharedAccounts)
		if err != nil {
			return nil, fmt.Errorf("failed to get linked-users from db: %w", err)
		}
	}
	return linkedUsers, nil
}

func newMongoFromUser(u *user.User, linkedUsers []*Mongo) (*Mongo, error) {
	id, err := primitive.ObjectIDFromHex(u.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to calculate object id of %s: %w", u.Id, err)
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

	user := user.New()
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

	return &user
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

func (s *UserDbService) Update(ctx context.Context, user *user.User) (*user.User, error) {
	linkedUsers, dbErr := getLinkedUsers(ctx, s.Collection, user.SharedAccountNames)
	if dbErr != nil {
		return nil, dbErr
	}

	userMongo, err := newMongoFromUser(user, linkedUsers)
	if err != nil {
		return nil, fmt.Errorf("failed to create mongo-user from user: %w", err)
	}

	result, err := s.Collection.UpdateOne(ctx, bson.D{{"_id", userMongo.Id}}, bson.D{{"$set", userMongo}})
	if err != nil {
		wErr := fmt.Errorf("failed to insert mongo-user: %w", err)
		if mongo.IsDuplicateKeyError(err) {
			return nil, &domain.DbError{Type: domain.ErrorDbConflict, Err: wErr}
		} else {
			return nil, wErr
		}
	}

	if result.MatchedCount == 0 {
		return nil, &domain.DbError{Type: domain.ErrorDbNotFound, Err: errors.New("user not found in db")}
	}

	return newUserFromMongo(userMongo, linkedUsers), nil
}

func (s *UserDbService) Delete(ctx context.Context, id string) error {
	idObject, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("failed to calculate object id of %s: %w", id, err)
	}

	_, err = s.Collection.DeleteOne(ctx, bson.D{{"_id", idObject}})
	if err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}

	return nil
}
