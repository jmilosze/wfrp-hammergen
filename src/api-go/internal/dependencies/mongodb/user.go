package mongodb

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/user"
	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

const userCollectionName = "user"

type UserDbService struct {
	Db         *DbService
	Collection *mongo.Collection
}

type userDocWrite struct {
	Id               bson.ObjectID   `bson:"_id"`
	Username         string          `bson:"username"`
	PasswordHash     []byte          `bson:"passwordHash"`
	Admin            bool            `bson:"admin"`
	SharedAccountIds []bson.ObjectID `bson:"sharedAccountIds"`
	CreatedOn        time.Time       `bson:"createdOn"`
	LastAuthOn       time.Time       `bson:"lastAuthOn"`
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

	var query bson.D
	if fieldName == "id" {
		id, err := bson.ObjectIDFromHex(fieldValue)
		if err != nil {
			return nil, fmt.Errorf("failed to calculate object id of %s: %w", fieldValue, err)
		}
		query = bson.D{{"_id", id}}
	} else {
		query = bson.D{{"username", fieldValue}}
	}

	var userMongo userDocWrite
	err := s.Collection.FindOne(ctx, query).Decode(&userMongo)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, &domain.DbError{Type: domain.ErrorDbNotFound, Err: fmt.Errorf("user not found db")}
		}
		return nil, fmt.Errorf("failed to find user: %w", err)
	}

	linkedUsers, err := getLinkedUsersByIds(ctx, s.Collection, userMongo.SharedAccountIds)
	if err != nil {
		return nil, fmt.Errorf("failed to get linked-users from db: %w", err)
	}

	return newUserFromMongo(&userMongo, linkedUsers), nil
}

func (s *UserDbService) RetrieveAll(ctx context.Context) ([]*user.User, error) {
	mongoUsers, err := findUsers(ctx, s.Collection, bson.D{{}})
	if err != nil {
		return nil, fmt.Errorf("failed to get users from db: %w", err)
	}

	users := make([]*user.User, len(mongoUsers))
	for i, u := range mongoUsers {
		users[i] = newUserFromMongo(u, mongoUsers)
	}

	return users, nil
}

func getLinkedUsersByIds(ctx context.Context, col *mongo.Collection, ids []bson.ObjectID) ([]*userDocWrite, error) {
	if len(ids) == 0 {
		return []*userDocWrite{}, nil
	}
	return findUsers(ctx, col, bson.D{{"_id", bson.D{{"$in", ids}}}})
}

func findUsers(ctx context.Context, coll *mongo.Collection, query bson.D) ([]*userDocWrite, error) {
	cur, err := coll.Find(ctx, query)
	if cur != nil {
		defer cur.Close(ctx)
	}
	if err != nil {
		return nil, fmt.Errorf("failed to execute find query: %w", err)
	}

	users := make([]*userDocWrite, 0)
	for cur.Next(ctx) {
		var u userDocWrite
		if err := cur.Decode(&u); err != nil {
			return nil, fmt.Errorf("failed to unmarshal users: %w", err)
		}
		users = append(users, &u)
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

func getLinkedUsers(ctx context.Context, col *mongo.Collection, sharedAccounts []string) ([]*userDocWrite, error) {
	if len(sharedAccounts) == 0 {
		return []*userDocWrite{}, nil
	}
	return findUsers(ctx, col, bson.D{{"username", bson.D{{"$in", sharedAccounts}}}})
}

func newMongoFromUser(u *user.User, linkedUsers []*userDocWrite) (*userDocWrite, error) {
	id, err := bson.ObjectIDFromHex(u.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to calculate object id of %s: %w", u.Id, err)
	}

	userMongo := userDocWrite{
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

func usernamesToIds(usernames []string, us []*userDocWrite) []bson.ObjectID {
	userMap := map[string]bson.ObjectID{}
	for _, u := range us {
		userMap[u.Username] = u.Id
	}

	ids := make([]bson.ObjectID, 0)
	for _, u := range usernames {
		if id, ok := userMap[u]; ok {
			ids = append(ids, id)
		}
	}
	return ids
}

func newUserFromMongo(u *userDocWrite, linkedUsers []*userDocWrite) *user.User {
	sharedAccountIds := make([]string, len(u.SharedAccountIds))
	for i, sa := range u.SharedAccountIds {
		sharedAccountIds[i] = sa.Hex()
	}

	user := user.New()
	user.Id = u.Id.Hex()
	user.Username = u.Username
	user.Admin = u.Admin
	user.SharedAccountIds = sharedAccountIds
	user.SharedAccountNames = idsToUsernames(u.SharedAccountIds, linkedUsers)
	if u.PasswordHash != nil {
		user.PasswordHash = u.PasswordHash
	}
	user.CreatedOn = u.CreatedOn
	user.LastAuthOn = u.LastAuthOn

	return &user
}

func idsToUsernames(ids []bson.ObjectID, users []*userDocWrite) []string {
	userMap := map[bson.ObjectID]string{}
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
	idObject, err := bson.ObjectIDFromHex(id)
	if err != nil {
		return fmt.Errorf("failed to calculate object id of %s: %w", id, err)
	}

	_, err = s.Collection.DeleteOne(ctx, bson.D{{"_id", idObject}})
	if err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}

	return nil
}
