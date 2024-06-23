package memdb

import (
	"context"
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

func (s *UserDbService) Retrieve(ctx context.Context, fieldName string, fieldValue string) (*user.User, error) {
	if fieldName != "username" && fieldName != "id" {
		return nil, fmt.Errorf("invalid field name %s", fieldName)
	}

	txn := s.Db.Txn(false)
	userRaw, err := txn.First("user", fieldName, fieldValue)
	if err != nil {
		return nil, fmt.Errorf("could not get first object from memdb : %w", err)
	}

	if userRaw == nil {
		return nil, &domain.DbError{Type: domain.DbNotFoundError, Err: fmt.Errorf("user %s not found", fieldValue)}
	}
	udb, ok := userRaw.(*user.User)
	if !ok {
		return nil, fmt.Errorf("could not populate wh from object %v", userRaw)
	}

	u := udb.Copy()

	linkedUsers, dbErr := getManyUsers(s.Db, "id", u.SharedAccountIds)
	if dbErr != nil {
		return nil, dbErr
	}

	u.SharedAccountNames = idsToUsernames(u.SharedAccountIds, linkedUsers)

	return u, nil
}

func getManyUsers(db *memdb.MemDB, fieldName string, fieldValues []string) ([]*user.User, error) {
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
		return nil, fmt.Errorf("could not get result iterator in memdb: %w", err)
	}

	var users []*user.User
	for obj := it.Next(); obj != nil; obj = it.Next() {
		u, ok := obj.(*user.User)
		if !ok {
			return nil, fmt.Errorf("could not populate wh from object %v", obj)
		}
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

func (s *UserDbService) RetrieveAll(ctx context.Context) ([]*user.User, error) {
	users, err := getManyUsers(s.Db, "username", nil)
	if err != nil {
		return nil, err
	}

	for _, u := range users {
		u.SharedAccountNames = idsToUsernames(u.SharedAccountIds, users)
	}

	return users, nil
}

func (s *UserDbService) Create(ctx context.Context, u *user.User) (*user.User, error) {
	return upsertUser(s, u, false)
}

func (s *UserDbService) Update(ctx context.Context, u *user.User) (*user.User, error) {
	return upsertUser(s, u, true)
}

func upsertUser(s *UserDbService, u *user.User, isUpdate bool) (*user.User, error) {
	userUpsert := u.Copy()

	linkedUsers, dbErr := getManyUsers(s.Db, "username", userUpsert.SharedAccountNames)
	if dbErr != nil {
		return nil, dbErr
	}
	userUpsert.SharedAccountIds = usernamesToIds(userUpsert.SharedAccountNames, linkedUsers)
	userUpsert.SharedAccountNames = idsToUsernames(userUpsert.SharedAccountIds, linkedUsers)

	txn := s.Db.Txn(true)
	defer txn.Abort()

	it, err := txn.Get("user", "id")
	if err != nil {
		return nil, fmt.Errorf("could not get result iterator in memdb: %w", err)
	}

	var currentUsers []*user.User
	for obj := it.Next(); obj != nil; obj = it.Next() {
		nextUser, ok := obj.(*user.User)
		if !ok {
			return nil, fmt.Errorf("could not populate wh from object %v", obj)
		}
		currentUsers = append(currentUsers, nextUser)
	}

	indexFound := false
	for _, currentUser := range currentUsers {
		if currentUser.Id == userUpsert.Id {
			indexFound = true
		}
		if currentUser.Id != userUpsert.Id && currentUser.Username == userUpsert.Username {
			return nil, &domain.DbError{Type: domain.DbConflictError, Err: fmt.Errorf("user %s already exists", userUpsert.Username)}
		}
	}

	if !indexFound && isUpdate {
		return nil, &domain.DbError{Type: domain.DbNotFoundError, Err: fmt.Errorf("user %s not found", userUpsert.Username)}
	}

	if indexFound && !isUpdate {
		return nil, &domain.DbError{Type: domain.DbConflictError, Err: fmt.Errorf("user %s already exists", userUpsert.Id)}
	}

	if err := txn.Insert("user", userUpsert); err != nil {
		return nil, fmt.Errorf("cloud not inset into memdb: %w", err)
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

func (s *UserDbService) Delete(ctx context.Context, id string) error {
	txn := s.Db.Txn(true)
	defer txn.Abort()
	if _, err := txn.DeleteAll("user", "id", id); err != nil {
		return fmt.Errorf("cloud not delete from memdb: %w", err)
	}
	txn.Commit()

	return nil
}
