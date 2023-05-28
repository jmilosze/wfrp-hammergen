package warhammer

import "fmt"

const (
	WhInvalidArgumentsError = iota
	WhNotFoundError
	WhInternalError
	WhUnauthorizedError
)

type WhError struct {
	WhType  WhType
	ErrType int
	Err     error
}

func (e *WhError) Unwrap() error {
	return e.Err
}

func (e *WhError) Error() string {
	return fmt.Sprintf("wh error, %s", e.Err)
}
