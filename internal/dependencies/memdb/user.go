package memdb

import (
	"context"
	"errors"
	"fmt"
	"github.com/hashicorp/go-memdb"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/user"
	"golang.org/x/exp/slices"
)

type UserDbService struct {
	Db *memdb.MemDB
}

func NewUserDbService() *UserDbService {
	db, err := createNewUserMemDb()
	if err != nil {
		panic(err)
	}

	return &UserDbService{Db: db}
}

func createNewUserMemDb() (*memdb.MemDB, error) {
	schema := &memdb.DBSchema{
		Tables: map[string]*memdb.TableSchema{
			"user": {
				Name: "user",
				Indexes: map[string]*memdb.IndexSchema{
					"id": {
						Name:    "id",
						Unique:  true,
						Indexer: &memdb.StringFieldIndex{Field: "Id"},
					},
					"username": {
						Name:    "username",
						Unique:  true,
						Indexer: &memdb.StringFieldIndex{Field: "Username"},
					},
				},
			},
		},
	}
	return memdb.NewMemDB(schema)
}

func (s *UserDbService) Retrieve(ctx context.Context, fieldName string, fieldValue string) (*user.User, *domain.DbError) {
	if fieldName != "username" && fieldName != "id" {
		return nil, &domain.DbError{Type: domain.DbInvalidUserFieldError, Err: fmt.Errorf("invalid field name %s", fieldName)}
	}

	user, dbErr := getOneUser(s.Db, fieldName, fieldValue)
	if dbErr != nil {
		return nil, dbErr
	}

	linkedUsers, dbErr := getManyUsers(s.Db, "id", user.SharedAccountIds)
	if dbErr != nil {
		return nil, dbErr
	}

	user.SharedAccountNames = idsToUsernames(user.SharedAccountIds, linkedUsers)

	return user, nil
}

func getOneUser(db *memdb.MemDB, fieldName string, fieldValue string) (*user.User, *domain.DbError) {
	txn := db.Txn(false)
	userRaw, err := txn.First("user", fieldName, fieldValue)
	if err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	if userRaw == nil {
		return nil, &domain.DbError{Type: domain.DbNotFoundError, Err: errors.New("user not found")}
	}
	user := userRaw.(*user.User)

	return user.Copy(), nil
}

func getManyUsers(db *memdb.MemDB, fieldName string, fieldValues []string) ([]*user.User, *domain.DbError) {
	getAll := false
	if fieldValues == nil {
		getAll = true
	} else {
		if len(fieldValues) == 0 {
			return []*user.User{}, nil
		}
	}

	txn := db.Txn(false)

	it, err := txn.Get("user", "id")
	if err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	var users []*user.User
	for obj := it.Next(); obj != nil; obj = it.Next() {
		u := obj.(*user.User)
		if getAll {
			users = append(users, u.Copy())
		} else {
			if fieldName == "username" && slices.Contains(fieldValues, u.Username) {
				users = append(users, u.Copy())
			}
			if fieldName == "id" && slices.Contains(fieldValues, u.Id) {
				users = append(users, u.Copy())
			}
		}
	}
	return users, nil
}

func idsToUsernames(ids []string, us []*user.User) []string {
	userDbMap := map[string]string{}
	for _, u := range us {
		userDbMap[u.Id] = u.Username
	}

	usernames := make([]string, 0)
	for _, id := range ids {
		if username, ok := userDbMap[id]; ok {
			usernames = append(usernames, username)
		}
	}
	return usernames
}

func (s *UserDbService) RetrieveAll(ctx context.Context) ([]*user.User, *domain.DbError) {
	users, err := getManyUsers(s.Db, "username", nil)
	if err != nil {
		return nil, err
	}

	for _, u := range users {
		u.SharedAccountNames = idsToUsernames(u.SharedAccountIds, users)
	}

	return users, nil
}

func (s *UserDbService) Create(ctx context.Context, u *user.User) (*user.User, *domain.DbError) {
	return upsertUser(s, u, true)
}

func (s *UserDbService) Update(ctx context.Context, u *user.User) (*user.User, *domain.DbError) {
	return upsertUser(s, u, false)
}

func upsertUser(s *UserDbService, user *user.User, failIfUsernameExists bool) (*user.User, *domain.DbError) {
	_, dbErr := getOneUser(s.Db, "username", user.Username)
	if failIfUsernameExists && dbErr == nil {
		return nil, &domain.DbError{Type: domain.DbAlreadyExistsError, Err: errors.New("user already exists")}
	}
	if dbErr != nil && dbErr.Type != domain.DbNotFoundError {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: dbErr.Unwrap()}
	}

	userUpsert := user.Copy()

	linkedUsers, dbErr := getManyUsers(s.Db, "username", userUpsert.SharedAccountNames)
	if dbErr != nil {
		return nil, dbErr
	}
	userUpsert.SharedAccountIds = usernamesToIds(userUpsert.SharedAccountNames, linkedUsers)
	userUpsert.SharedAccountNames = idsToUsernames(userUpsert.SharedAccountIds, linkedUsers)

	txn := s.Db.Txn(true)
	defer txn.Abort()
	if err := txn.Insert("user", userUpsert); err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}
	txn.Commit()

	return userUpsert.Copy(), nil
}

func usernamesToIds(usernames []string, us []*user.User) []string {
	userDbMap := map[string]string{}
	for _, u := range us {
		userDbMap[u.Username] = u.Id
	}

	ids := make([]string, 0)
	for _, u := range usernames {
		if id, ok := userDbMap[u]; ok {
			ids = append(ids, id)
		}
	}
	return ids
}

func (s *UserDbService) Delete(ctx context.Context, id string) *domain.DbError {
	txn := s.Db.Txn(true)
	defer txn.Abort()
	if _, err := txn.DeleteAll("user", "id", id); err != nil {
		return &domain.DbError{Type: domain.DbInternalError, Err: err}
	}
	txn.Commit()

	return nil
}
