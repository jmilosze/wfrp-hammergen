package user

const (
	ErrorNotFound = iota
	ErrorConflict
	ErrorIncorrectPassword
	ErrorInvalidArguments
	ErrorUnauthorized
	ErrorTokenExpired
	ErrorInvalidToken
)

type Error struct {
	Type int
	Err  error
}

func (e *Error) Unwrap() error {
	return e.Err
}

func (e *Error) Error() string {
	return e.Err.Error()
}
