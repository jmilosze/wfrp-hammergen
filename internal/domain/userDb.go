package domain

import (
	"context"
)

type UserDbService interface {
	Create(ctx context.Context, user *User) (*User, *DbError)
	Update(ctx context.Context, user *User) (*User, *DbError)
	Retrieve(ctx context.Context, fieldName string, fieldValue string) (*User, *DbError)
	RetrieveAll(ctx context.Context) ([]*User, *DbError)
	Delete(ctx context.Context, id string) *DbError
}
