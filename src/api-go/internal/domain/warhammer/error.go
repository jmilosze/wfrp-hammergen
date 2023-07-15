package warhammer

import "fmt"

const (
	InvalidArgumentsError = iota
	NotFoundError
	InternalError
	UnauthorizedError
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
