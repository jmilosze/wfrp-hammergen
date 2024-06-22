package domain

import "fmt"

const (
	DbNotFoundError = iota
	DbConflictError
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

func CreateDbError(t int, e error) *DbError {
	return &DbError{
		Type: t,
		Err:  e,
	}
}
