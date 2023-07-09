package user

import (
	"context"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
)

type UserService interface {
	Get(ctx context.Context, c *domain.Claims, id string) (*User, *UserError)
	Exists(ctx context.Context, username string) (bool, *UserError)
	Create(ctx context.Context, u *User) (*User, *UserError)
	Update(ctx context.Context, c *domain.Claims, u *User) (*User, *UserError)
	UpdateCredentials(ctx context.Context, c *domain.Claims, currentPasswd string, u *User) (*User, *UserError)
	UpdateClaims(ctx context.Context, c *domain.Claims, u *User) (*User, *UserError)
	Delete(ctx context.Context, c *domain.Claims, id string) *UserError
	List(ctx context.Context, c *domain.Claims) ([]*User, *UserError)
	Authenticate(ctx context.Context, username string, password string) (u *User, ue *UserError)
	SendResetPassword(ctx context.Context, username string) *UserError
	ResetPassword(ctx context.Context, token string, newPassword string) *UserError
}

type UserDbService interface {
	Create(ctx context.Context, user *User) (*User, *domain.DbError)
	Update(ctx context.Context, user *User) (*User, *domain.DbError)
	Retrieve(ctx context.Context, fieldName string, fieldValue string) (*User, *domain.DbError)
	RetrieveAll(ctx context.Context) ([]*User, *domain.DbError)
	Delete(ctx context.Context, id string) *domain.DbError
}
