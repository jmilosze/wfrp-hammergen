package user

import (
	"context"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
)

type UserService interface {
	Get(ctx context.Context, c *auth.Claims, id string) (*User, error)
	Exists(ctx context.Context, username string) (bool, error)
	Create(ctx context.Context, u *User) (*User, error)
	Update(ctx context.Context, c *auth.Claims, u *User) (*User, error)
	UpdateCredentials(ctx context.Context, c *auth.Claims, currentPasswd string, u *User) (*User, error)
	UpdateClaims(ctx context.Context, c *auth.Claims, u *User) (*User, error)
	Delete(ctx context.Context, c *auth.Claims, currentPasswd string, id string) error
	List(ctx context.Context, c *auth.Claims) ([]*User, error)
	Authenticate(ctx context.Context, username string, password string) (*User, error)
	SendResetPassword(ctx context.Context, username string) error
	ResetPassword(ctx context.Context, token string, newPassword string) error
}

type UserDbService interface {
	Create(ctx context.Context, user *User) (*User, error)
	Update(ctx context.Context, user *User) (*User, error)
	Retrieve(ctx context.Context, fieldName string, fieldValue string) (*User, error)
	RetrieveAll(ctx context.Context) ([]*User, error)
	Delete(ctx context.Context, id string) error
}
