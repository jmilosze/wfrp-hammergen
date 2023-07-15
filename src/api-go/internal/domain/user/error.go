package user

import "fmt"

const (
	NotFoundError = iota
	ConflictError
	InternalError
	IncorrectPasswordError
	InvalidArgumentsError
	SendEmailError
	UnauthorizedError
	TokenExpiredError
)

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
