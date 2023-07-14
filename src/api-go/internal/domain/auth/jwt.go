package auth

const (
	ErrorInvalidToken  = "token is invalid"
	ErrorExpiredToken  = "token is expired"
	ErrorInvalidClaims = "invalid claims"
	ErrorTokenRead     = "could not read token"
	ErrorCreateToken   = "could not create token"
)

type Claims struct {
	Id             string
	Admin          bool
	SharedAccounts []string
	ResetPassword  bool
}

type JwtService interface {
	GenerateAccessToken(claims *Claims) (string, *Error)
	GenerateResetPasswordToken(claims *Claims) (string, *Error)
	ParseToken(token string) (*Claims, *Error)
}

type Error struct {
	Type string
	Err  error
}

func NewError(errType string, err error) *Error {
	return &Error{Type: errType, Err: err}
}

func (e *Error) Unwrap() error {
	return e.Err
}

func (e *Error) Error() string {
	return e.Type + " -> " + e.Err.Error()
}
