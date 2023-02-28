package services

import (
	"context"
	"encoding/hex"
	"errors"
	"fmt"
	"github.com/go-playground/validator/v10"
	"github.com/jmilosze/wfrp-hammergen-go/internal/config"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	mock "github.com/jmilosze/wfrp-hammergen-go/test/mock_data"
	"github.com/rs/xid"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/url"
	"path"
	"time"
)

type UserService struct {
	BcryptCost    int
	Validator     *validator.Validate
	UserDbService domain.UserDbService
	EmailService  domain.EmailService
	JwtService    domain.JwtService
	FrontEndUrl   *url.URL
}

func NewUserService(cfg *config.UserService, db domain.UserDbService, email domain.EmailService, jwt domain.JwtService, v *validator.Validate) *UserService {
	return &UserService{
		BcryptCost:    cfg.BcryptCost,
		UserDbService: db,
		EmailService:  email,
		JwtService:    jwt,
		Validator:     v,
		FrontEndUrl:   cfg.FrontEndUrl,
	}

}

func (s *UserService) SeedUsers(ctx context.Context, us []*mock.UserSeed) {
	for _, u := range us {
		user := domain.EmptyUser()

		user.Id = u.Id
		user.Username = u.Username
		user.PasswordHash, _ = bcrypt.GenerateFromPassword([]byte(u.Password), s.BcryptCost)
		user.SharedAccountNames = u.SharedAccounts
		user.Admin = u.Admin

		if _, dbErr := s.UserDbService.Create(ctx, user); dbErr != nil {
			log.Fatal(dbErr)
		}
	}
}

func (s *UserService) Get(ctx context.Context, c *domain.Claims, id string) (*domain.User, *domain.UserError) {
	if c.Id == "anonymous" || !(id == c.Id || c.Admin) {
		return nil, &domain.UserError{Type: domain.UserUnauthorizedError, Err: errors.New("unauthorized")}
	}

	user, dbErr := s.UserDbService.Retrieve(ctx, "id", id)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &domain.UserError{Type: domain.UserNotFoundError, Err: dbErr}
		default:
			return nil, &domain.UserError{Type: domain.UserInternalError, Err: dbErr}
		}
	}

	return user, nil
}

func (s *UserService) Exists(ctx context.Context, username string) (bool, *domain.UserError) {
	_, dbErr := s.UserDbService.Retrieve(ctx, "username", username)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return false, nil
		default:
			return false, &domain.UserError{Type: domain.UserInternalError, Err: dbErr}
		}
	}
	return true, nil
}

func (s *UserService) Authenticate(ctx context.Context, username string, password string) (u *domain.User, ue *domain.UserError) {
	user, dbErr := s.UserDbService.Retrieve(ctx, "username", username)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &domain.UserError{Type: domain.UserNotFoundError, Err: dbErr}
		default:
			return nil, &domain.UserError{Type: domain.UserInternalError, Err: dbErr}
		}
	}

	if !authenticate(user, password) {
		return nil, &domain.UserError{Type: domain.UserIncorrectPasswordError, Err: errors.New("incorrect password")}
	}

	user.LastAuthOn = time.Now()

	if _, dbErr = s.UserDbService.Update(ctx, user); dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &domain.UserError{Type: domain.UserNotFoundError, Err: dbErr}
		default:
			return nil, &domain.UserError{Type: domain.UserInternalError, Err: dbErr}
		}
	}

	return user, nil
}

func authenticate(user *domain.User, password string) (success bool) {
	if bcrypt.CompareHashAndPassword(user.PasswordHash, []byte(password)) == nil {
		return true
	}
	return false
}

func (s *UserService) Create(ctx context.Context, u *domain.User) (*domain.User, *domain.UserError) {
	if len(u.Username) == 0 || len(u.Password) == 0 {
		return nil, &domain.UserError{Type: domain.UserInvalidArgumentsError, Err: errors.New("missing username or password")}
	}

	if err := validateCreateUser(s.Validator, u); err != nil {
		return nil, &domain.UserError{Type: domain.UserInvalidArgumentsError, Err: err}
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(u.Password), s.BcryptCost)
	if err != nil {
		return nil, &domain.UserError{Type: domain.UserInternalError, Err: err}
	}
	u.PasswordHash = passwordHash
	u.Id = hex.EncodeToString(xid.New().Bytes())
	u.CreatedOn = time.Now()

	createdUser, dbErr := s.UserDbService.Create(ctx, u)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbAlreadyExistsError:
			return nil, &domain.UserError{Type: domain.UserAlreadyExistsError, Err: dbErr}
		default:
			return nil, &domain.UserError{Type: domain.UserInternalError, Err: dbErr}
		}
	}

	return createdUser, nil
}

func validateCreateUser(v *validator.Validate, u *domain.User) error {
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

func (s *UserService) Update(ctx context.Context, c *domain.Claims, u *domain.User) (*domain.User, *domain.UserError) {
	if c.Id == "anonymous" || u.Id != c.Id {
		return nil, &domain.UserError{Type: domain.UserUnauthorizedError, Err: errors.New("unauthorized")}
	}

	if err := validateUpdateUser(s.Validator, u); err != nil {
		return nil, &domain.UserError{Type: domain.UserInvalidArgumentsError, Err: err}
	}

	currentUser, dbErr := s.UserDbService.Retrieve(ctx, "id", u.Id)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &domain.UserError{Type: domain.UserNotFoundError, Err: dbErr}
		default:
			return nil, &domain.UserError{Type: domain.UserInternalError, Err: dbErr}
		}
	}

	currentUser.SharedAccountNames = make([]string, len(u.SharedAccountNames))
	copy(currentUser.SharedAccountNames, u.SharedAccountNames)

	updatedUser, dbErr := s.UserDbService.Update(ctx, currentUser)

	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &domain.UserError{Type: domain.UserNotFoundError, Err: dbErr}
		default:
			return nil, &domain.UserError{Type: domain.UserInternalError, Err: dbErr}
		}
	}

	return updatedUser, nil
}

func validateUpdateUser(v *validator.Validate, u *domain.User) error {
	if err := v.Var(u.SharedAccountNames, "dive,email,required"); err != nil {
		return err
	}
	return nil
}

func (s *UserService) UpdateCredentials(ctx context.Context, c *domain.Claims, currentPasswd string, u *domain.User) (*domain.User, *domain.UserError) {
	if c.Id == "anonymous" || u.Id != c.Id {
		return nil, &domain.UserError{Type: domain.UserUnauthorizedError, Err: errors.New("unauthorized")}
	}

	if err := validateUpdateCredentials(s.Validator, u); err != nil {
		return nil, &domain.UserError{Type: domain.UserInvalidArgumentsError, Err: err}
	}

	currentUser, dbErr := s.UserDbService.Retrieve(ctx, "id", u.Id)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &domain.UserError{Type: domain.UserNotFoundError, Err: dbErr}
		default:
			return nil, &domain.UserError{Type: domain.UserInternalError, Err: dbErr}
		}
	}

	if !authenticate(currentUser, currentPasswd) {
		return nil, &domain.UserError{Type: domain.UserIncorrectPasswordError, Err: errors.New("incorrect password")}
	}

	currentUser.Username = u.Username
	currentUser.PasswordHash, _ = bcrypt.GenerateFromPassword([]byte(u.Password), s.BcryptCost)

	updatedUser, dbErr := s.UserDbService.Update(ctx, currentUser)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &domain.UserError{Type: domain.UserNotFoundError, Err: dbErr}
		default:
			return nil, &domain.UserError{Type: domain.UserInternalError, Err: dbErr}
		}
	}

	return updatedUser, nil
}

func validateUpdateCredentials(v *validator.Validate, u *domain.User) error {
	if err := v.Var(u.Username, "email"); err != nil {
		return err
	}
	if err := v.Var(u.Password, "gte=5"); err != nil {
		return err
	}
	return nil
}

func (s *UserService) UpdateClaims(ctx context.Context, c *domain.Claims, u *domain.User) (*domain.User, *domain.UserError) {
	if !c.Admin {
		return nil, &domain.UserError{Type: domain.UserUnauthorizedError, Err: errors.New("unauthorized")}
	}

	currentUser, dbErr := s.UserDbService.Retrieve(ctx, "id", u.Id)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &domain.UserError{Type: domain.UserNotFoundError, Err: dbErr}
		default:
			return nil, &domain.UserError{Type: domain.UserInternalError, Err: dbErr}
		}
	}

	currentUser.Admin = u.Admin

	updatedUser, dbErr := s.UserDbService.Update(ctx, currentUser)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return nil, &domain.UserError{Type: domain.UserNotFoundError, Err: dbErr}
		default:
			return nil, &domain.UserError{Type: domain.UserInternalError, Err: dbErr}
		}
	}

	return updatedUser, nil
}

func (s *UserService) Delete(ctx context.Context, c *domain.Claims, id string) *domain.UserError {
	if id != c.Id {
		return &domain.UserError{Type: domain.UserUnauthorizedError, Err: errors.New("unauthorized")}
	}

	if dbErr := s.UserDbService.Delete(ctx, id); dbErr != nil {
		return &domain.UserError{Type: domain.UserInternalError, Err: dbErr}

	} else {
		return nil
	}
}

func (s *UserService) List(ctx context.Context, c *domain.Claims) ([]*domain.User, *domain.UserError) {
	if !c.Admin {
		return nil, &domain.UserError{Type: domain.UserUnauthorizedError, Err: errors.New("unauthorized")}
	}

	users, dbErr := s.UserDbService.RetrieveAll(ctx)
	if dbErr != nil {
		return nil, &domain.UserError{Type: domain.UserInternalError, Err: dbErr}
	}

	return users, nil
}

func (s *UserService) SendResetPassword(ctx context.Context, username string) *domain.UserError {
	if len(username) == 0 {
		return &domain.UserError{Type: domain.UserInvalidArgumentsError, Err: errors.New("missing username")}
	}

	user, dbErr := s.UserDbService.Retrieve(ctx, "username", username)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return &domain.UserError{Type: domain.UserNotFoundError, Err: dbErr}
		default:
			return &domain.UserError{Type: domain.UserInternalError, Err: dbErr}
		}
	}

	if user == nil {
		return &domain.UserError{Type: domain.UserNotFoundError, Err: errors.New("user not found")}
	}

	claims := domain.Claims{Id: user.Id, Admin: false, SharedAccounts: []string{}, ResetPassword: true}
	resetToken, err := s.JwtService.GenerateResetPasswordToken(&claims)

	if err != nil {
		return &domain.UserError{Type: domain.UserInternalError, Err: err}
	}

	clickUrl, err := url.ParseRequestURI(s.FrontEndUrl.String())
	if err != nil {
		return &domain.UserError{Type: domain.UserInternalError, Err: err}
	}

	resetTokenPath := fmt.Sprintf("/resetPassword/%s", resetToken)
	clickUrl.Path = path.Join(clickUrl.Path, resetTokenPath)

	emailMessage := fmt.Sprintf("Please reset your password by <a href=%s>clicking here</a>", clickUrl.String())
	email := domain.Email{
		ToAddress: user.Username,
		Subject:   "Reset password",
		Content:   emailMessage,
	}

	if err := s.EmailService.Send(ctx, &email); err != nil {
		return &domain.UserError{Type: domain.UserSendEmailError, Err: err}
	}

	return nil
}

func (s *UserService) ResetPassword(ctx context.Context, token string, newPassword string) *domain.UserError {
	if len(token) == 0 || len(newPassword) == 0 {
		return &domain.UserError{Type: domain.UserInvalidArgumentsError, Err: errors.New("missing token or username")}
	}

	claims, err := s.JwtService.ParseToken(token)
	if err != nil {
		return &domain.UserError{Type: domain.UserInvalidArgumentsError, Err: errors.New("invalid token")}
	}

	if !claims.ResetPassword {
		return &domain.UserError{Type: domain.UserInvalidArgumentsError, Err: errors.New("invalid token")}
	}

	currentUser, dbErr := s.UserDbService.Retrieve(ctx, "id", claims.Id)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return &domain.UserError{Type: domain.UserNotFoundError, Err: dbErr}
		default:
			return &domain.UserError{Type: domain.UserInternalError, Err: dbErr}
		}
	}

	currentUser.PasswordHash, err = bcrypt.GenerateFromPassword([]byte(newPassword), s.BcryptCost)
	if err != nil {
		return &domain.UserError{Type: domain.UserInternalError, Err: err}
	}

	_, dbErr = s.UserDbService.Update(ctx, currentUser)
	if dbErr != nil {
		switch dbErr.Type {
		case domain.DbNotFoundError:
			return &domain.UserError{Type: domain.UserNotFoundError, Err: dbErr}
		default:
			return &domain.UserError{Type: domain.UserInternalError, Err: dbErr}
		}
	}

	return nil
}
