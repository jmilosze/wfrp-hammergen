package domain

import "fmt"

const (
	DbNotFoundError = iota
	DbAlreadyExistsError
	DbInternalError
	DbInvalidUserFieldError
)

type DbError struct {
	Type int
	Err  error
}

func (e *DbError) Unwrap() error {
	return e.Err
}

func (e *DbError) Error() string {
	return fmt.Sprintf("db error, %s", e.Err)
}
