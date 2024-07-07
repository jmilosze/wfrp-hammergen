package auth

const (
	ErrorExpiredToken = "token is expired"
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

type Error struct {
	Type string
	Err  error
}

func (e *Error) Unwrap() error {
	return e.Err
}

func (e *Error) Error() string {
	return e.Type + ", " + e.Err.Error()
}
