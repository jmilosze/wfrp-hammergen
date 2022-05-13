package domain

import (
	"fmt"
)

const (
	UserNotFoundError = iota
	UserAlreadyExistsError
	UserInternalError
	UserIncorrectPassword
	UserInvalidArguments
)

type UserWrite struct {
	SharedAccountNames []string `json:"shared_accounts" validate:"omitempty,dive,email,required"`
}

type UserWriteCredentials struct {
	Username string `json:"username" validate:"omitempty,email"`
	Password string `json:"password" validate:"omitempty,gte=5"`
}

type UserWriteClaims struct {
	Admin *bool `json:"admin" validate:"omitempty"`
}

type User struct {
	Id                 string
	Username           *string
	Admin              *bool
	SharedAccountNames []string
}

type UserService interface {
	Get(id string) (*User, *UserError)
	Exists(username string) (bool, *UserError)
	Create(cred *UserWriteCredentials, user *UserWrite) (*User, *UserError)
	Update(id string, user *UserWrite) (*User, *UserError)
	UpdateCredentials(id string, currentPasswd string, cred *UserWriteCredentials) (*User, *UserError)
	UpdateClaims(id string, claims *UserWriteClaims) (*User, *UserError)
	Delete(id string) *UserError
	List() ([]*User, *UserError)
	Authenticate(username string, password string) (*User, *UserError)
	SendResetPassword(username string) *UserError
	ResetPassword(token string, newPassword string) *UserError
}

type UserError struct {
	Type int
	Err  error
}

func (e *UserError) Unwrap() error {
	return e.Err
}

func (e *UserError) Error() string {
	return fmt.Sprintf("user error, %s", e.Err)
}
