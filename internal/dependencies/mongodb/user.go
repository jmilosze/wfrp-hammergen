package mongodb

import (
	"context"
	"errors"
	"fmt"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"time"
)

type UserMongoDb struct {
	Id             primitive.ObjectID   `bson:"_id,omitempty"`
	Username       string               `bson:"username,omitempty"`
	PasswordHash   []byte               `bson:"passwordHash,omitempty"`
	Admin          *bool                `bson:"admin,omitempty"`
	SharedAccounts []primitive.ObjectID `bson:"sharedAccounts,omitempty"`
	CreatedOn      time.Time            `bson:"createdOn,omitempty"`
	LastAuthOn     time.Time            `bson:"lastAuthOn,omitempty"`
}

type UserDbAnnotated struct {
	Id             string    `bson:"_id,omitempty"`
	Username       string    `bson:"username,omitempty"`
	PasswordHash   []byte    `bson:"passwordHash,omitempty"`
	Admin          *bool     `bson:"admin,omitempty"`
	SharedAccounts []string  `bson:"sharedAccounts,omitempty"`
	CreatedOn      time.Time `bson:"createdOn,omitempty"`
	LastAuthOn     time.Time `bson:"lastAuthOn,omitempty"`
}

func fromUserDb(u *domain.UserDb, linkedUsers []*UserMongoDb) (*UserMongoDb, error) {
	id, err := primitive.ObjectIDFromHex(u.Id)
	if err != nil {
		return nil, err
	}

	userMongoDb := UserMongoDb{
		Id:             id,
		Username:       u.Username,
		PasswordHash:   u.PasswordHash,
		Admin:          u.Admin,
		SharedAccounts: usernamesToIds(u.SharedAccounts, linkedUsers),
		CreatedOn:      u.CreatedOn,
		LastAuthOn:     u.LastAuthOn,
	}

	return &userMongoDb, nil
}

func usernamesToIds(usernames []string, users []*UserMongoDb) []primitive.ObjectID {
	userMap := map[string]primitive.ObjectID{}
	for _, u := range users {
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

func toUserDb(u *UserMongoDb, linkedUsers []*UserMongoDb) *domain.UserDb {
	var sharedAccounts []string
	if u.SharedAccounts != nil {
		sharedAccounts = make([]string, len(u.SharedAccounts))
		for i, sa := range u.SharedAccounts {
			sharedAccounts[i] = sa.Hex()
		}
	} else {
		sharedAccounts = nil
	}

	userMongoDb := domain.UserDb{
		Id:             u.Id.Hex(),
		Username:       u.Username,
		PasswordHash:   u.PasswordHash,
		Admin:          u.Admin,
		SharedAccounts: idsToUsernames(u.SharedAccounts, linkedUsers),
		CreatedOn:      u.CreatedOn,
		LastAuthOn:     u.LastAuthOn,
	}
	return &userMongoDb
}

func idsToUsernames(ids []primitive.ObjectID, users []*UserMongoDb) []string {
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

type UserDbService struct {
	Db         *DbService
	Collection *mongo.Collection
}

func NewUserDbService(db *DbService, userCollection string, createIndex bool) *UserDbService {
	coll := db.Client.Database(db.DbName).Collection(userCollection)

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

func (s *UserDbService) Retrieve(ctx context.Context, fieldName string, fieldValue string) (*domain.UserDb, *domain.DbError) {
	if fieldName != "username" && fieldName != "id" {
		return nil, &domain.DbError{Type: domain.DbInvalidUserFieldError, Err: fmt.Errorf("invalid field name %s", fieldName)}
	}

	var matchStage bson.D
	if fieldName == "id" {
		id, err1 := primitive.ObjectIDFromHex(fieldValue)
		if err1 != nil {
			return nil, &domain.DbError{Type: domain.DbInternalError, Err: err1}
		}
		matchStage = bson.D{{"$match", bson.D{{"_id", id}}}}
	} else {
		matchStage = bson.D{{"$match", bson.D{{"username", fieldValue}}}}
	}
	unwindStage := bson.D{{"$unwind", bson.D{
		{"path", "$sharedAccounts"},
		{"preserveNullAndEmptyArrays", true},
	}}}
	lookupStage := bson.D{{"$lookup", bson.D{
		{"from", s.Collection.Name()},
		{"localField", "sharedAccounts"},
		{"foreignField", "_id"},
		{"as", "sharedAcc"},
	}}}
	groupStage := bson.D{{"$group", bson.D{
		{"_id", bson.D{{"$toString", "$_id"}}},
		{"sharedAccounts", bson.D{{"$push", bson.D{{"$arrayElemAt", bson.A{"$sharedAcc.username", 0}}}}}},
		{"username", bson.D{{"$first", "$username"}}},
		{"passwordHash", bson.D{{"$first", "$passwordHash"}}},
		{"admin", bson.D{{"$first", "$admin"}}},
		{"createdOn", bson.D{{"$first", "$createdOn"}}},
		{"lastAuthOn", bson.D{{"$first", "$lastAuthOn"}}},
	}}}

	cur, err2 := s.Collection.Aggregate(ctx, mongo.Pipeline{matchStage, unwindStage, lookupStage, groupStage})
	if err2 != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err2}
	}

	var userDoc UserDbAnnotated
	ok := cur.Next(ctx)
	if !ok {
		return nil, &domain.DbError{Type: domain.DbNotFoundError, Err: errors.New("user not found")}
	}
	err3 := cur.Decode(&userDoc)
	if err3 != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err3}
	}

	if err4 := cur.Close(ctx); err4 != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err4}
	}

	return (*domain.UserDb)(&userDoc), nil
}

func getMany(ctx context.Context, coll *mongo.Collection, fieldName string, fieldValues []string) ([]*UserMongoDb, *domain.DbError) {
	getAll := false
	if fieldValues == nil {
		getAll = true
	} else {
		if len(fieldValues) == 0 {
			return []*UserMongoDb{}, nil
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

	cur, err1 := coll.Find(ctx, query)
	if err1 != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err1}
	}

	users := make([]*UserMongoDb, 0)
	for cur.Next(ctx) {
		var user UserMongoDb
		if err2 := cur.Decode(&user); err2 != nil {
			return nil, &domain.DbError{Type: domain.DbInternalError, Err: err2}
		}
		users = append(users, &user)
	}

	if err3 := cur.Close(ctx); err3 != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err3}
	}

	return users, nil
}

func (s *UserDbService) RetrieveAll(ctx context.Context) ([]*domain.UserDb, *domain.DbError) {
	users, err := getMany(ctx, s.Collection, "username", nil)
	if err != nil {
		return nil, err
	}

	userDbs := make([]*domain.UserDb, len(users))
	for i, u := range users {
		userDbs[i] = toUserDb(u, users)
	}

	return userDbs, nil
}

func (s *UserDbService) Create(ctx context.Context, user *domain.UserDb) (*domain.UserDb, *domain.DbError) {
	linkedUsers, err1 := getLinkedUsers(ctx, s.Collection, user.SharedAccounts)
	if err1 != nil {
		return nil, err1
	}

	userMongoDb, err2 := fromUserDb(user, linkedUsers)
	if err2 != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err2}
	}

	filter := bson.D{{"_id", userMongoDb.Id}}
	opts := options.Replace().SetUpsert(true)
	if _, err := s.Collection.ReplaceOne(ctx, filter, userMongoDb, opts); err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	return toUserDb(userMongoDb, linkedUsers), nil
}

func getLinkedUsers(ctx context.Context, col *mongo.Collection, sharedAccounts []string) ([]*UserMongoDb, *domain.DbError) {
	linkedUsers := make([]*UserMongoDb, 0)
	if sharedAccounts != nil {
		var err *domain.DbError
		linkedUsers, err = getMany(ctx, col, "username", sharedAccounts)
		if err != nil {
			return nil, err
		}
	}
	return linkedUsers, nil
}

func (s *UserDbService) Update(ctx context.Context, user *domain.UserDb) (*domain.UserDb, *domain.DbError) {
	linkedUsers, err1 := getLinkedUsers(ctx, s.Collection, user.SharedAccounts)
	if err1 != nil {
		return nil, err1
	}

	userMongoDb, err2 := fromUserDb(user, linkedUsers)
	if err2 != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err2}
	}

	result, err4 := s.Collection.UpdateOne(ctx, bson.D{{"_id", userMongoDb.Id}}, bson.D{{"$set", userMongoDb}})
	if err4 != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err4}
	}

	if result.MatchedCount == 0 {
		return nil, &domain.DbError{Type: domain.DbNotFoundError, Err: errors.New("user not found")}
	}

	return toUserDb(userMongoDb, linkedUsers), nil
}

func (s *UserDbService) Delete(ctx context.Context, id string) *domain.DbError {
	idObject, err1 := primitive.ObjectIDFromHex(id)
	if err1 != nil {
		return &domain.DbError{Type: domain.DbInternalError, Err: err1}
	}

	_, err2 := s.Collection.DeleteOne(ctx, bson.D{{"_id", idObject}})
	if err2 != nil {
		return &domain.DbError{Type: domain.DbInternalError, Err: err2}
	}

	return nil
}
