package services

import (
	"context"
	"encoding/hex"
	"errors"
	"fmt"
	"github.com/go-playground/validator/v10"
	"github.com/jmilosze/wfrp-hammergen-go/internal/config"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/user"
	"github.com/rs/xid"
	"golang.org/x/crypto/bcrypt"
	"net/url"
	"path"
	"time"
)

type UserService struct {
	BcryptCost    int
	Validator     *validator.Validate
	UserDbService user.UserDbService
	EmailService  domain.EmailService
	JwtService    domain.JwtService
	FrontEndUrl   *url.URL
}

func NewUserService(cfg *config.UserService, db user.UserDbService, email domain.EmailService, jwt domain.JwtService, v *validator.Validate) *UserService {
	return &UserService{
		BcryptCost:    cfg.BcryptCost,
		UserDbService: db,
		EmailService:  email,
		JwtService:    jwt,
		Validator:     v,
		FrontEndUrl:   cfg.FrontEndUrl,
	}

}

func (s *UserService) Get(ctx context.Context, c *domain.Claims, id string) (*user.User, *user.UserError) {
	if c.Id == "anonymous" || !(id == c.Id || c.Admin) {
		return nil, &user.UserError{Type: user.UserUnauthorizedError, Err: errors.New("unauthorized")}
	}

	u, dbErr := s.UserDbService.Retrieve(ctx, "id", id)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &user.UserError{Type: user.UserNotFoundError, Err: dbErr}
		default:
			return nil, &user.UserError{Type: user.UserInternalError, Err: dbErr}
		}
	}

	return u, nil
}

func (s *UserService) Exists(ctx context.Context, username string) (bool, *user.UserError) {
	_, dbErr := s.UserDbService.Retrieve(ctx, "username", username)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return false, nil
		default:
			return false, &user.UserError{Type: user.UserInternalError, Err: dbErr}
		}
	}
	return true, nil
}

func (s *UserService) Authenticate(ctx context.Context, username string, password string) (*user.User, *user.UserError) {
	u, dbErr := s.UserDbService.Retrieve(ctx, "username", username)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &user.UserError{Type: user.UserNotFoundError, Err: dbErr}
		default:
			return nil, &user.UserError{Type: user.UserInternalError, Err: dbErr}
		}
	}

	if !authenticate(u, password) {
		return nil, &user.UserError{Type: user.UserIncorrectPasswordError, Err: errors.New("incorrect password")}
	}

	u.LastAuthOn = time.Now()

	if _, dbErr = s.UserDbService.Update(ctx, u); dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &user.UserError{Type: user.UserNotFoundError, Err: dbErr}
		default:
			return nil, &user.UserError{Type: user.UserInternalError, Err: dbErr}
		}
	}

	return u, nil
}

func authenticate(u *user.User, password string) (success bool) {
	if bcrypt.CompareHashAndPassword(u.PasswordHash, []byte(password)) == nil {
		return true
	}
	return false
}

func (s *UserService) Create(ctx context.Context, u *user.User) (*user.User, *user.UserError) {
	if len(u.Username) == 0 || len(u.Password) == 0 {
		return nil, &user.UserError{Type: user.UserInvalidArgumentsError, Err: errors.New("missing username or password")}
	}

	if err := validateCreateUser(s.Validator, u); err != nil {
		return nil, &user.UserError{Type: user.UserInvalidArgumentsError, Err: err}
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(u.Password), s.BcryptCost)
	if err != nil {
		return nil, &user.UserError{Type: user.UserInternalError, Err: err}
	}
	u.PasswordHash = passwordHash
	u.Id = hex.EncodeToString(xid.New().Bytes())
	u.CreatedOn = time.Now()

	createdUser, dbErr := s.UserDbService.Create(ctx, u)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbAlreadyExistsError:
			return nil, &user.UserError{Type: user.UserAlreadyExistsError, Err: dbErr}
		default:
			return nil, &user.UserError{Type: user.UserInternalError, Err: dbErr}
		}
	}

	return createdUser, nil
}

func validateCreateUser(v *validator.Validate, u *user.User) error {
	if err := v.Var(u.Username, "email"); err != nil {
		return err
	}
	if err := v.Var(u.Password, "gte=5"); err != nil {
		return err
	}
	if err := v.Var(u.SharedAccountNames, "dive,email,required"); err != nil {
		return err
	}
	return nil
}

func (s *UserService) Update(ctx context.Context, c *domain.Claims, u *user.User) (*user.User, *user.UserError) {
	if c.Id == "anonymous" || u.Id != c.Id {
		return nil, &user.UserError{Type: user.UserUnauthorizedError, Err: errors.New("unauthorized")}
	}

	if err := validateUpdateUser(s.Validator, u); err != nil {
		return nil, &user.UserError{Type: user.UserInvalidArgumentsError, Err: err}
	}

	currentUser, dbErr := s.UserDbService.Retrieve(ctx, "id", u.Id)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &user.UserError{Type: user.UserNotFoundError, Err: dbErr}
		default:
			return nil, &user.UserError{Type: user.UserInternalError, Err: dbErr}
		}
	}

	currentUser.SharedAccountNames = make([]string, len(u.SharedAccountNames))
	copy(currentUser.SharedAccountNames, u.SharedAccountNames)

	updatedUser, dbErr := s.UserDbService.Update(ctx, currentUser)

	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &user.UserError{Type: user.UserNotFoundError, Err: dbErr}
		default:
			return nil, &user.UserError{Type: user.UserInternalError, Err: dbErr}
		}
	}

	return updatedUser, nil
}

func validateUpdateUser(v *validator.Validate, u *user.User) error {
	if err := v.Var(u.SharedAccountNames, "dive,email,required"); err != nil {
		return err
	}
	return nil
}

func (s *UserService) UpdateCredentials(ctx context.Context, c *domain.Claims, currentPasswd string, u *user.User) (*user.User, *user.UserError) {
	if c.Id == "anonymous" || u.Id != c.Id {
		return nil, &user.UserError{Type: user.UserUnauthorizedError, Err: errors.New("unauthorized")}
	}

	if err := validateUpdateCredentials(s.Validator, u); err != nil {
		return nil, &user.UserError{Type: user.UserInvalidArgumentsError, Err: err}
	}

	currentUser, dbErr := s.UserDbService.Retrieve(ctx, "id", u.Id)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &user.UserError{Type: user.UserNotFoundError, Err: dbErr}
		default:
			return nil, &user.UserError{Type: user.UserInternalError, Err: dbErr}
		}
	}

	if !authenticate(currentUser, currentPasswd) {
		return nil, &user.UserError{Type: user.UserIncorrectPasswordError, Err: errors.New("incorrect password")}
	}

	currentUser.Username = u.Username
	currentUser.PasswordHash, _ = bcrypt.GenerateFromPassword([]byte(u.Password), s.BcryptCost)

	updatedUser, dbErr := s.UserDbService.Update(ctx, currentUser)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &user.UserError{Type: user.UserNotFoundError, Err: dbErr}
		default:
			return nil, &user.UserError{Type: user.UserInternalError, Err: dbErr}
		}
	}

	return updatedUser, nil
}

func validateUpdateCredentials(v *validator.Validate, u *user.User) error {
	if err := v.Var(u.Username, "email"); err != nil {
		return err
	}
	if err := v.Var(u.Password, "gte=5"); err != nil {
		return err
	}
	return nil
}

func (s *UserService) UpdateClaims(ctx context.Context, c *domain.Claims, u *user.User) (*user.User, *user.UserError) {
	if !c.Admin {
		return nil, &user.UserError{Type: user.UserUnauthorizedError, Err: errors.New("unauthorized")}
	}

	currentUser, dbErr := s.UserDbService.Retrieve(ctx, "id", u.Id)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &user.UserError{Type: user.UserNotFoundError, Err: dbErr}
		default:
			return nil, &user.UserError{Type: user.UserInternalError, Err: dbErr}
		}
	}

	currentUser.Admin = u.Admin

	updatedUser, dbErr := s.UserDbService.Update(ctx, currentUser)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &user.UserError{Type: user.UserNotFoundError, Err: dbErr}
		default:
			return nil, &user.UserError{Type: user.UserInternalError, Err: dbErr}
		}
	}

	return updatedUser, nil
}

func (s *UserService) Delete(ctx context.Context, c *domain.Claims, id string) *user.UserError {
	if id != c.Id {
		return &user.UserError{Type: user.UserUnauthorizedError, Err: errors.New("unauthorized")}
	}

	if dbErr := s.UserDbService.Delete(ctx, id); dbErr != nil {
		return &user.UserError{Type: user.UserInternalError, Err: dbErr}

	} else {
		return nil
	}
}

func (s *UserService) List(ctx context.Context, c *domain.Claims) ([]*user.User, *user.UserError) {
	if !c.Admin {
		return nil, &user.UserError{Type: user.UserUnauthorizedError, Err: errors.New("unauthorized")}
	}

	users, dbErr := s.UserDbService.RetrieveAll(ctx)
	if dbErr != nil {
		return nil, &user.UserError{Type: user.UserInternalError, Err: dbErr}
	}

	return users, nil
}

func (s *UserService) SendResetPassword(ctx context.Context, username string) *user.UserError {
	if len(username) == 0 {
		return &user.UserError{Type: user.UserInvalidArgumentsError, Err: errors.New("missing username")}
	}

	u, dbErr := s.UserDbService.Retrieve(ctx, "username", username)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return &user.UserError{Type: user.UserNotFoundError, Err: dbErr}
		default:
			return &user.UserError{Type: user.UserInternalError, Err: dbErr}
		}
	}

	if u == nil {
		return &user.UserError{Type: user.UserNotFoundError, Err: errors.New("user not found")}
	}

	claims := domain.Claims{Id: u.Id, Admin: false, SharedAccounts: []string{}, ResetPassword: true}
	resetToken, err := s.JwtService.GenerateResetPasswordToken(&claims)

	if err != nil {
		return &user.UserError{Type: user.UserInternalError, Err: err}
	}

	clickUrl, err := url.ParseRequestURI(s.FrontEndUrl.String())
	if err != nil {
		return &user.UserError{Type: user.UserInternalError, Err: err}
	}

	resetTokenPath := fmt.Sprintf("/resetPassword/%s", resetToken)
	clickUrl.Path = path.Join(clickUrl.Path, resetTokenPath)

	emailMessage := fmt.Sprintf("Please reset your password by <a href=%s>clicking here</a>", clickUrl.String())
	email := domain.Email{
		ToAddress: u.Username,
		Subject:   "Reset password",
		Content:   emailMessage,
	}

	if err := s.EmailService.Send(ctx, &email); err != nil {
		return &user.UserError{Type: user.UserSendEmailError, Err: err}
	}

	return nil
}

func (s *UserService) ResetPassword(ctx context.Context, token string, newPassword string) *user.UserError {
	if len(token) == 0 || len(newPassword) == 0 {
		return &user.UserError{Type: user.UserInvalidArgumentsError, Err: errors.New("missing token or username")}
	}

	claims, err := s.JwtService.ParseToken(token)
	if err != nil {
		return &user.UserError{Type: user.UserInvalidArgumentsError, Err: errors.New("invalid token")}
	}

	if !claims.ResetPassword {
		return &user.UserError{Type: user.UserInvalidArgumentsError, Err: errors.New("invalid token")}
	}

	currentUser, dbErr := s.UserDbService.Retrieve(ctx, "id", claims.Id)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return &user.UserError{Type: user.UserNotFoundError, Err: dbErr}
		default:
			return &user.UserError{Type: user.UserInternalError, Err: dbErr}
		}
	}

	currentUser.PasswordHash, err = bcrypt.GenerateFromPassword([]byte(newPassword), s.BcryptCost)
	if err != nil {
		return &user.UserError{Type: user.UserInternalError, Err: err}
	}

	_, dbErr = s.UserDbService.Update(ctx, currentUser)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return &user.UserError{Type: user.UserNotFoundError, Err: dbErr}
		default:
			return &user.UserError{Type: user.UserInternalError, Err: dbErr}
		}
	}

	return nil
}
