package memdb

import (
	"errors"
	"fmt"
	"github.com/hashicorp/go-memdb"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/rs/xid"
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

func (s *UserDbService) NewUserDb() *domain.UserDb {
	newId := xid.New().String()
	admin := false
	username := ""
	return &domain.UserDb{Id: newId, Username: &username, PasswordHash: []byte{}, Admin: &admin, SharedAccountIds: []string{}}
}

func (s *UserDbService) Retrieve(fieldName string, fieldValue string) (*domain.UserDb, *domain.DbError) {
	if fieldName != "username" && fieldName != "id" {
		return nil, &domain.DbError{Type: domain.DbInvalidUserFieldError, Err: fmt.Errorf("invalid field name %s", fieldName)}
	}

	txn := s.Db.Txn(false)
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

func (s *UserDbService) RetrieveMany(fieldName string, fieldValues []string) ([]*domain.UserDb, *domain.DbError) {
	if fieldName != "username" && fieldName != "id" {
		return nil, &domain.DbError{Type: domain.DbInvalidUserFieldError, Err: fmt.Errorf("invalid field name %s", fieldName)}
	}

	txn := s.Db.Txn(false)

	it, err := txn.Get("user", "id")
	if err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	var users []*domain.UserDb
	for obj := it.Next(); obj != nil; obj = it.Next() {
		u := obj.(*domain.UserDb)
		if fieldName == "username" && u.Username != nil && contains(fieldValues, *u.Username) {
			users = append(users, copyUserDb(u))
		}
		if fieldName == "id" && contains(fieldValues, u.Id) {
			users = append(users, copyUserDb(u))
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

func copyUserDb(from *domain.UserDb) *domain.UserDb {
	if from == nil {
		return nil
	}
	userCopy := *from
	*userCopy.Username = strings.Clone(*from.Username)
	userCopy.PasswordHash = make([]byte, len(from.PasswordHash))
	copy(userCopy.PasswordHash, from.PasswordHash)
	userCopy.SharedAccountIds = make([]string, len(from.SharedAccountIds))
	for i, s := range from.SharedAccountIds {
		userCopy.SharedAccountIds[i] = strings.Clone(s)
	}

	return &userCopy
}

func (s *UserDbService) Create(user *domain.UserDb) *domain.DbError {
	_, err := s.Retrieve("username", *user.Username)

	if err == nil {
		return &domain.DbError{Type: domain.DbAlreadyExistsError, Err: errors.New("user already exists")}
	}

	if err != nil && err.Type != domain.DbNotFoundError {
		return &domain.DbError{Type: domain.DbInternalError, Err: err.Unwrap()}
	}

	txn := s.Db.Txn(true)
	defer txn.Abort()
	if err := txn.Insert("user", copyUserDb(user)); err != nil {
		return &domain.DbError{Type: domain.DbInternalError, Err: err}
	}
	txn.Commit()
	return nil
}

func (s *UserDbService) Update(user *domain.UserDb) (*domain.UserDb, *domain.DbError) {
	userDb, err := s.Retrieve("id", user.Id)
	if err != nil {
		return nil, err
	}

	if user.Username != nil {
		*userDb.Username = strings.Clone(*user.Username)
	}

	if user.PasswordHash != nil {
		userDb.PasswordHash = make([]byte, len(user.PasswordHash))
		for i, s := range user.PasswordHash {
			userDb.PasswordHash[i] = s
		}
	}

	if user.SharedAccountIds != nil {
		userDb.SharedAccountIds = make([]string, len(user.SharedAccountIds))
		for i, s := range user.SharedAccountIds {
			userDb.SharedAccountIds[i] = strings.Clone(s)
		}
	}

	if user.Admin != nil {
		*userDb.Admin = *user.Admin
	}

	txn := s.Db.Txn(true)
	defer txn.Abort()
	if err := txn.Insert("user", userDb); err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}
	txn.Commit()
	return userDb, nil
}

func (s *UserDbService) Delete(id string) *domain.DbError {
	txn := s.Db.Txn(true)
	defer txn.Abort()
	if _, err := txn.DeleteAll("user", "id", id); err != nil {
		return &domain.DbError{Type: domain.DbInternalError, Err: err}
	}
	txn.Commit()

	return nil
}

func (s *UserDbService) List() ([]*domain.UserDb, *domain.DbError) {
	txn := s.Db.Txn(false)

	it, err := txn.Get("user", "id")
	if err != nil {
		return nil, &domain.DbError{Type: domain.DbInternalError, Err: err}
	}

	var users []*domain.UserDb
	for obj := it.Next(); obj != nil; obj = it.Next() {
		u := obj.(*domain.UserDb)
		users = append(users, copyUserDb(u))
	}
	return users, nil
}
