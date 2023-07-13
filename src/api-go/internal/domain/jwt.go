package domain

import (
	"errors"
)

var (
	ErrTokenExpired = errors.New("token is expired")
)

const (
	TokenExpiredError uint32 = 1 << iota
)

type Claims struct {
	Id             string
	Admin          bool
	SharedAccounts []string
	ResetPassword  bool
}

type JwtService interface {
	GenerateAccessToken(claims *Claims) (string, error)
	GenerateResetPasswordToken(claims *Claims) (string, error)
	ParseToken(token string) (*Claims, error)
}

type InvalidTokenError struct {
	Inner  error
	Errors uint32
	Text   string
}

func (e *InvalidTokenError) Unwrap() error {
	return e.Inner
}

func (e *InvalidTokenError) Error() string {
	message := "validating token"
	if e.Inner != nil {
		message += " " + e.Inner.Error()
	}
	if e.Text != "" {
		message += " " + e.Text
	}
	return message
}

func (e *InvalidTokenError) Is(err error) bool {
	if errors.Is(errors.Unwrap(e), err) {
		return true
	}

	switch err {
	case ErrTokenExpired:
		return e.Errors&TokenExpiredError != 0
	}

	return false
}
