package services

import (
	"context"
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

		if _, err := s.UserDbService.Create(ctx, user); err != nil {
			log.Fatal(err)
		}
	}
}

func (s *UserService) Get(ctx context.Context, c *domain.Claims, id string) (*domain.User, *domain.UserError) {
	if c.Id == "anonymous" || !(id == c.Id || c.Admin) {
		return nil, &domain.UserError{Type: domain.UserUnauthorizedError, Err: errors.New("unauthorized")}
	}

	user, err := s.UserDbService.Retrieve(ctx, "id", id)
	if err != nil {
		switch err.Type {
		case domain.DbNotFoundError:
			return nil, &domain.UserError{Type: domain.UserNotFoundError, Err: err}
		default:
			return nil, &domain.UserError{Type: domain.UserInternalError, Err: err}
		}
	}

	return user, nil
}

func (s *UserService) Exists(ctx context.Context, username string) (bool, *domain.UserError) {
	_, err := s.UserDbService.Retrieve(ctx, "username", username)
	if err != nil {
		switch err.Type {
		case domain.DbNotFoundError:
			return false, nil
		default:
			return false, &domain.UserError{Type: domain.UserInternalError, Err: err}
		}
	}
	return true, nil
}

func (s *UserService) Authenticate(ctx context.Context, username string, password string) (u *domain.User, ue *domain.UserError) {
	user, err1 := s.UserDbService.Retrieve(ctx, "username", username)
	if err1 != nil {
		switch err1.Type {
		case domain.DbNotFoundError:
			return nil, &domain.UserError{Type: domain.UserNotFoundError, Err: err1}
		default:
			return nil, &domain.UserError{Type: domain.UserInternalError, Err: err1}
		}
	}

	if !authenticate(user, password) {
		return nil, &domain.UserError{Type: domain.UserIncorrectPasswordError, Err: errors.New("incorrect password")}
	}

	user.LastAuthOn = time.Now()

	if _, err2 := s.UserDbService.Update(ctx, user); err2 != nil {
		switch err2.Type {
		case domain.DbNotFoundError:
			return nil, &domain.UserError{Type: domain.UserNotFoundError, Err: err2}
		default:
			return nil, &domain.UserError{Type: domain.UserInternalError, Err: err2}
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

	passwordHash, err1 := bcrypt.GenerateFromPassword([]byte(u.Password), s.BcryptCost)
	if err1 != nil {
		return nil, &domain.UserError{Type: domain.UserInternalError, Err: err1}
	}
	u.PasswordHash = passwordHash
	u.Id = xid.New().String()
	u.CreatedOn = time.Now()

	createdUser, err2 := s.UserDbService.Create(ctx, u)
	if err2 != nil {
		switch err2.Type {
		case domain.DbAlreadyExistsError:
			return nil, &domain.UserError{Type: domain.UserAlreadyExistsError, Err: err2}
		default:
			return nil, &domain.UserError{Type: domain.UserInternalError, Err: err2}
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

	currentUser, err1 := s.UserDbService.Retrieve(ctx, "id", u.Id)
	if err1 != nil {
		switch err1.Type {
		case domain.DbNotFoundError:
			return nil, &domain.UserError{Type: domain.UserNotFoundError, Err: err1}
		default:
			return nil, &domain.UserError{Type: domain.UserInternalError, Err: err1}
		}
	}

	currentUser.SharedAccountNames = make([]string, len(u.SharedAccountNames))
	copy(currentUser.SharedAccountNames, u.SharedAccountNames)

	updatedUser, err2 := s.UserDbService.Update(ctx, currentUser)

	if err2 != nil {
		switch err2.Type {
		case domain.DbNotFoundError:
			return nil, &domain.UserError{Type: domain.UserNotFoundError, Err: err2}
		default:
			return nil, &domain.UserError{Type: domain.UserInternalError, Err: err2}
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

	if err1 := validateUpdateCredentials(s.Validator, u); err1 != nil {
		return nil, &domain.UserError{Type: domain.UserInvalidArgumentsError, Err: err1}
	}

	currentUser, err2 := s.UserDbService.Retrieve(ctx, "id", u.Id)
	if err2 != nil {
		switch err2.Type {
		case domain.DbNotFoundError:
			return nil, &domain.UserError{Type: domain.UserNotFoundError, Err: err2}
		default:
			return nil, &domain.UserError{Type: domain.UserInternalError, Err: err2}
		}
	}

	if !authenticate(currentUser, currentPasswd) {
		return nil, &domain.UserError{Type: domain.UserIncorrectPasswordError, Err: errors.New("incorrect password")}
	}

	currentUser.Username = u.Username
	currentUser.PasswordHash, _ = bcrypt.GenerateFromPassword([]byte(u.Password), s.BcryptCost)

	updatedUser, err3 := s.UserDbService.Update(ctx, currentUser)
	if err3 != nil {
		switch err3.Type {
		case domain.DbNotFoundError:
			return nil, &domain.UserError{Type: domain.UserNotFoundError, Err: err3}
		default:
			return nil, &domain.UserError{Type: domain.UserInternalError, Err: err3}
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

	currentUser, err1 := s.UserDbService.Retrieve(ctx, "id", u.Id)
	if err1 != nil {
		switch err1.Type {
		case domain.DbNotFoundError:
			return nil, &domain.UserError{Type: domain.UserNotFoundError, Err: err1}
		default:
			return nil, &domain.UserError{Type: domain.UserInternalError, Err: err1}
		}
	}

	currentUser.Admin = u.Admin

	updatedUser, err2 := s.UserDbService.Update(ctx, currentUser)
	if err2 != nil {
		switch err2.Type {
		case domain.DbNotFoundError:
			return nil, &domain.UserError{Type: domain.UserNotFoundError, Err: err2}
		default:
			return nil, &domain.UserError{Type: domain.UserInternalError, Err: err2}
		}
	}

	return updatedUser, nil
}

func (s *UserService) Delete(ctx context.Context, c *domain.Claims, id string) *domain.UserError {
	if c.Id == "anonymous" || id != c.Id {
		return &domain.UserError{Type: domain.UserUnauthorizedError, Err: errors.New("unauthorized")}
	}

	if err := s.UserDbService.Delete(ctx, id); err != nil {
		return &domain.UserError{Type: domain.UserInternalError, Err: err}

	} else {
		return nil
	}
}

func (s *UserService) List(ctx context.Context, c *domain.Claims) ([]*domain.User, *domain.UserError) {
	if !c.Admin {
		return nil, &domain.UserError{Type: domain.UserUnauthorizedError, Err: errors.New("unauthorized")}
	}

	users, err1 := s.UserDbService.RetrieveAll(ctx)
	if err1 != nil {
		return nil, &domain.UserError{Type: domain.UserInternalError, Err: err1}
	}

	return users, nil
}

func (s *UserService) SendResetPassword(ctx context.Context, username string) *domain.UserError {
	if len(username) == 0 {
		return &domain.UserError{Type: domain.UserInvalidArgumentsError, Err: errors.New("missing username")}
	}

	user, err1 := s.UserDbService.Retrieve(ctx, "username", username)
	if err1 != nil {
		switch err1.Type {
		case domain.DbNotFoundError:
			return &domain.UserError{Type: domain.UserNotFoundError, Err: err1}
		default:
			return &domain.UserError{Type: domain.UserInternalError, Err: err1}
		}
	}

	if user == nil {
		return &domain.UserError{Type: domain.UserNotFoundError, Err: errors.New("user not found")}
	}

	claims := domain.Claims{Id: user.Id, Admin: false, SharedAccounts: []string{}, ResetPassword: true}
	resetToken, err2 := s.JwtService.GenerateResetPasswordToken(&claims)

	if err2 != nil {
		return &domain.UserError{Type: domain.UserInternalError, Err: err2}
	}

	clickUrl := s.FrontEndUrl
	resetTokenPath := fmt.Sprintf("/resetPassword/%s", resetToken)
	clickUrl.Path = path.Join(clickUrl.Path, resetTokenPath)

	emailMessage := fmt.Sprintf("Please reset your password by <a href=%s>clicking here</a>", clickUrl.String())
	email := domain.Email{
		ToAddress: user.Username,
		Subject:   "Reset password",
		Content:   emailMessage,
	}

	if err3 := s.EmailService.Send(ctx, &email); err3 != nil {
		return &domain.UserError{Type: domain.UserSendEmailError, Err: err3}
	}

	return nil
}

func (s *UserService) ResetPassword(ctx context.Context, token string, newPassword string) *domain.UserError {
	if len(token) == 0 || len(newPassword) == 0 {
		return &domain.UserError{Type: domain.UserInvalidArgumentsError, Err: errors.New("missing token or username")}
	}

	claims, err1 := s.JwtService.ParseToken(token)
	if err1 != nil {
		return &domain.UserError{Type: domain.UserInvalidArgumentsError, Err: errors.New("invalid token")}
	}

	if !claims.ResetPassword {
		return &domain.UserError{Type: domain.UserInvalidArgumentsError, Err: errors.New("invalid token")}
	}

	currentUser, err2 := s.UserDbService.Retrieve(ctx, "id", claims.Id)
	if err2 != nil {
		switch err2.Type {
		case domain.DbNotFoundError:
			return &domain.UserError{Type: domain.UserNotFoundError, Err: err2}
		default:
			return &domain.UserError{Type: domain.UserInternalError, Err: err2}
		}
	}

	var err3 error
	currentUser.PasswordHash, err3 = bcrypt.GenerateFromPassword([]byte(newPassword), s.BcryptCost)
	if err3 != nil {
		return &domain.UserError{Type: domain.UserInternalError, Err: err3}
	}

	_, err4 := s.UserDbService.Update(ctx, currentUser)
	if err4 != nil {
		switch err4.Type {
		case domain.DbNotFoundError:
			return &domain.UserError{Type: domain.UserNotFoundError, Err: err4}
		default:
			return &domain.UserError{Type: domain.UserInternalError, Err: err4}
		}
	}

	return nil
}
