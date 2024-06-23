package warhammer

const (
	ErrorInvalidArguments = iota
	ErrorNotFound
	ErrorUnauthorized
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
	return e.Err.Error()
}
