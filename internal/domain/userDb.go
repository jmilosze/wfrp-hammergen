package domain

import (
	"context"
	"github.com/rs/xid"
	"time"
)

type UserDb struct {
	Id             string
	Username       string
	PasswordHash   []byte
	Admin          *bool
	SharedAccounts []string
	CreatedOn      time.Time
	LastAuthOn     time.Time
}

func NewUserDb() *UserDb {
	newId := xid.New().String()
	admin := false
	return &UserDb{
		Id:             newId,
		Username:       "",
		PasswordHash:   []byte{},
		Admin:          &admin,
		SharedAccounts: []string{},
		CreatedOn:      time.Now(),
		LastAuthOn:     time.Time{},
	}
}

func (u *UserDb) ToUser() *User {
	var isAdmin bool
	if u.Admin != nil {
		isAdmin = *u.Admin
	}

	return &User{
		Id:             u.Id,
		Admin:          isAdmin,
		Username:       u.Username,
		SharedAccounts: u.SharedAccounts,
		CreatedOn:      u.CreatedOn,
		LastAuthOn:     u.LastAuthOn,
	}
}

type UserDbService interface {
	Create(ctx context.Context, user *UserDb) (*UserDb, *DbError)
	Retrieve(ctx context.Context, fieldName string, fieldValue string) (*UserDb, *DbError)
	RetrieveAll(ctx context.Context) ([]*UserDb, *DbError)
	Update(ctx context.Context, user *UserDb) (*UserDb, *DbError)
	Delete(ctx context.Context, id string) *DbError
}
