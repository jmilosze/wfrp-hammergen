package memdb

import (
	"context"
	"errors"
	"fmt"
	"github.com/hashicorp/go-memdb"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"strings"
)

type UserDbService struct {
	Db *memdb.MemDB
}

func NewUserDbService() *UserDbService {
	db, err := createNewMemDb()
	if err != nil {
		panic(err)
	}

	return &UserDbService{Db: db}
}

func createNewMemDb() (*memdb.MemDB, error) {
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

func (s *UserDbService) Retrieve(ctx context.Context, fieldName string, fieldValue string) (*domain.UserDb, *domain.DbError) {
	if fieldName != "username" && fieldName != "id" {
		return nil, &domain.DbError{Type: domain.DbInvalidUserFieldError, Err: fmt.Errorf("invalid field name %s", fieldName)}
	}

	user, err1 := getOne(s.Db, fieldName, fieldValue)
	if err1 != nil {
		return nil, err1
	}

	linkedUsers, err2 := getMany(s.Db, "id", user.SharedAccounts)
	if err2 != nil {
		return nil, err2
	}

	user.SharedAccounts = idsToUsernames(user.SharedAccounts, linkedUsers)

	return user, nil
}

func getOne(db *memdb.MemDB, fieldName string, fieldValue string) (*domain.UserDb, *domain.DbError) {
	txn := db.Txn(false)
	userRaw, err := txn.First("user", fieldName, fieldValue)
	if err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	if userRaw == nil {
		return nil, &domain.DbError{Type: domain.DbNotFoundError, Err: errors.New("user not found")}
	}
	user := userRaw.(*domain.UserDb)

	return copyUserDb(user), nil
}

func getMany(db *memdb.MemDB, fieldName string, fieldValues []string) ([]*domain.UserDb, *domain.DbError) {
	getAll := false
	if fieldValues == nil {
		getAll = true
	} else {
		if len(fieldValues) == 0 {
			return []*domain.UserDb{}, nil
		}
	}

	txn := db.Txn(false)

	it, err := txn.Get("user", "id")
	if err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	var users []*domain.UserDb
	for obj := it.Next(); obj != nil; obj = it.Next() {
		u := obj.(*domain.UserDb)
		if getAll {
			users = append(users, copyUserDb(u))
		} else {
			if fieldName == "username" && contains(fieldValues, u.Username) {
				users = append(users, copyUserDb(u))
			}
			if fieldName == "id" && contains(fieldValues, u.Id) {
				users = append(users, copyUserDb(u))
			}
		}
	}
	return users, nil
}

func contains(elems []string, v string) bool {
	for _, s := range elems {
		if v == s {
			return true
		}
	}
	return false
}

func idsToUsernames(ids []string, userDbs []*domain.UserDb) []string {
	userDbMap := map[string]string{}
	for _, u := range userDbs {
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

func (s *UserDbService) RetrieveAll(ctx context.Context) ([]*domain.UserDb, *domain.DbError) {
	users, err := getMany(s.Db, "username", nil)
	if err != nil {
		return nil, err
	}

	for _, u := range users {
		u.SharedAccounts = idsToUsernames(u.SharedAccounts, users)
	}

	return users, nil
}

func copyUserDb(from *domain.UserDb) *domain.UserDb {
	if from == nil {
		return nil
	}
	to := *from
	to.Username = strings.Clone(from.Username)
	to.PasswordHash = make([]byte, len(from.PasswordHash))
	copy(to.PasswordHash, from.PasswordHash)
	to.SharedAccounts = make([]string, len(from.SharedAccounts))
	for i, s := range from.SharedAccounts {
		to.SharedAccounts[i] = strings.Clone(s)
	}

	to.LastAuthOn = from.LastAuthOn.UTC()
	to.CreatedOn = from.CreatedOn.UTC()

	return &to
}

func (s *UserDbService) Create(ctx context.Context, user *domain.UserDb) (*domain.UserDb, *domain.DbError) {
	_, err1 := getOne(s.Db, "username", user.Username)
	if err1 == nil {
		return nil, &domain.DbError{Type: domain.DbAlreadyExistsError, Err: errors.New("user already exists")}
	}
	if err1 != nil && err1.Type != domain.DbNotFoundError {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err1.Unwrap()}
	}

	linkedUsers := make([]*domain.UserDb, 0)
	userDbCreate := copyUserDb(user)
	if user.SharedAccounts != nil {
		var err2 *domain.DbError
		linkedUsers, err2 = getMany(s.Db, "username", user.SharedAccounts)
		if err2 != nil {
			return nil, err2
		}
		userDbCreate.SharedAccounts = usernamesToIds(userDbCreate.SharedAccounts, linkedUsers)
	}

	txn := s.Db.Txn(true)
	defer txn.Abort()
	if err := txn.Insert("user", userDbCreate); err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}
	txn.Commit()

	userDbRet := copyUserDb(userDbCreate)
	userDbRet.SharedAccounts = idsToUsernames(userDbCreate.SharedAccounts, linkedUsers)

	return userDbRet, nil
}

func usernamesToIds(usernames []string, userDbs []*domain.UserDb) []string {
	userDbMap := map[string]string{}
	for _, u := range userDbs {
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

func updateUserDb(to *domain.UserDb, from *domain.UserDb) *domain.UserDb {
	if len(from.Username) != 0 {
		to.Username = strings.Clone(from.Username)
	}

	if from.PasswordHash != nil {
		to.PasswordHash = make([]byte, len(from.PasswordHash))
		for i, s := range from.PasswordHash {
			to.PasswordHash[i] = s
		}
	}

	if from.Admin != nil {
		*to.Admin = *from.Admin
	}

	if !from.LastAuthOn.IsZero() {
		to.LastAuthOn = from.LastAuthOn.UTC()
	}

	if !from.CreatedOn.IsZero() {
		to.CreatedOn = from.CreatedOn.UTC()
	}

	if from.SharedAccounts != nil {
		to.SharedAccounts = make([]string, len(from.SharedAccounts))
		for i, s := range from.SharedAccounts {
			to.SharedAccounts[i] = s
		}
	}

	return to
}

func (s *UserDbService) Update(ctx context.Context, user *domain.UserDb) (*domain.UserDb, *domain.DbError) {
	userDb, err := getOne(s.Db, "id", user.Id)
	if err != nil {
		return nil, err
	}

	updateUserDb(userDb, user)

	linkedUsers, err2 := getMany(s.Db, "username", userDb.SharedAccounts)
	if err2 != nil {
		return nil, err2
	}

	if userDb.SharedAccounts != nil {
		userDb.SharedAccounts = usernamesToIds(userDb.SharedAccounts, linkedUsers)

	}

	txn := s.Db.Txn(true)
	defer txn.Abort()
	if err := txn.Insert("user", userDb); err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}
	txn.Commit()

	userDbRet := copyUserDb(userDb)
	userDbRet.SharedAccounts = idsToUsernames(userDb.SharedAccounts, linkedUsers)

	return userDbRet, nil
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
