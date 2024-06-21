package user

import "fmt"

const (
	NotFoundError = iota
	ConflictError
	IncorrectPasswordError
	InvalidArgumentsError
	SendEmailError
	UnauthorizedError
	TokenExpiredError
)

type Error struct {
	Type int
	Err  error
}

func (e *Error) Unwrap() error {
	return e.Err
}

func (e *Error) Error() string {
	return fmt.Sprintf("user error, %s", e.Err)
}
