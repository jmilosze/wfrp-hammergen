package domain

import (
	"fmt"
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
	Err error
}

func (e *InvalidTokenError) Unwrap() error {
	return e.Err
}

func (e *InvalidTokenError) Error() string {
	return fmt.Sprintf("invalid token, %s", e.Err)
}
