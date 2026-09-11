package services

import (
	"context"
	"encoding/hex"
	"errors"
	"fmt"
	"github.com/go-playground/validator/v10"
	"github.com/jmilosze/wfrp-hammergen-go/internal/config"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
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
	JwtService    auth.JwtService
	FrontEndUrl   *url.URL
}

func NewUserService(cfg *config.UserService, db user.UserDbService, email domain.EmailService, jwt auth.JwtService, v *validator.Validate) *UserService {
	return &UserService{
		BcryptCost:    cfg.BcryptCost,
		UserDbService: db,
		EmailService:  email,
		JwtService:    jwt,
		Validator:     v,
		FrontEndUrl:   cfg.FrontEndUrl,
	}

}

func (s *UserService) Get(ctx context.Context, c *auth.Claims, id string) (*user.User, error) {
	if c.Id == "anonymous" || !(id == c.Id || c.Admin) {
		return nil, fmt.Errorf("unauthorized to get user %s: %w", id, domain.ErrUnauthorized)
	}

	u, err := s.UserDbService.Retrieve(ctx, "id", id)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve user: %w", err)
	}

	return u, nil
}

func (s *UserService) Exists(ctx context.Context, username string) (bool, error) {
	_, err := s.UserDbService.Retrieve(ctx, "username", username)
	if err != nil {
		if errors.Is(err, domain.ErrNotFound) {
			return false, nil
		}
		return false, fmt.Errorf("failed to retrieve user: %w", err)
	}
	return true, nil
}

func (s *UserService) Authenticate(ctx context.Context, username string, password string) (*user.User, error) {
	u, err := s.UserDbService.Retrieve(ctx, "username", username)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve user: %w", err)
	}

	if !authenticate(u, password) {
		return nil, fmt.Errorf("incorrect password: %w", domain.ErrIncorrectPassword)
	}

	u.LastAuthOn = time.Now()

	if _, err = s.UserDbService.Update(ctx, u); err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}

	return u, nil
}

func authenticate(u *user.User, password string) (success bool) {
	if bcrypt.CompareHashAndPassword(u.PasswordHash, []byte(password)) == nil {
		return true
	}
	return false
}

func (s *UserService) Create(ctx context.Context, u *user.User) (*user.User, error) {
	if len(u.Username) == 0 || len(u.Password) == 0 {
		return nil, fmt.Errorf("missing username or password: %w", domain.ErrInvalidArguments)
	}

	if err := validateCreateUser(s.Validator, u); err != nil {
		return nil, fmt.Errorf("invalid create user data: %w: %w", domain.ErrInvalidArguments, err)
	}

	passwordHash, err := bcrypt.GenerateFromPassword([]byte(u.Password), s.BcryptCost)
	if err != nil {
		return nil, fmt.Errorf("failed to create passowrd hash %w", err)
	}
	u.PasswordHash = passwordHash
	u.Id = hex.EncodeToString(xid.New().Bytes())
	u.CreatedOn = time.Now()

	createdUser, err := s.UserDbService.Create(ctx, u)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
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

func (s *UserService) Update(ctx context.Context, c *auth.Claims, u *user.User) (*user.User, error) {
	if c.Id == "anonymous" || u.Id != c.Id {
		return nil, fmt.Errorf("unauthorized to update user %s: %w", u.Id, domain.ErrUnauthorized)
	}

	if err := validateUpdateUser(s.Validator, u); err != nil {
		return nil, fmt.Errorf("invalid update user data: %w: %w", domain.ErrInvalidArguments, err)
	}

	currentUser, err := s.UserDbService.Retrieve(ctx, "id", u.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve user: %w", err)
	}

	currentUser.SharedAccountNames = make([]string, len(u.SharedAccountNames))
	copy(currentUser.SharedAccountNames, u.SharedAccountNames)

	updatedUser, err := s.UserDbService.Update(ctx, currentUser)
	if err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}

	return updatedUser, nil
}

func validateUpdateUser(v *validator.Validate, u *user.User) error {
	if err := v.Var(u.SharedAccountNames, "dive,email,required"); err != nil {
		return err
	}
	return nil
}

func (s *UserService) UpdateCredentials(ctx context.Context, c *auth.Claims, currentPasswd string, u *user.User) (*user.User, error) {
	if c.Id == "anonymous" || u.Id != c.Id {
		return nil, fmt.Errorf("unauthorized to update user credentials %s: %w", u.Id, domain.ErrUnauthorized)
	}

	currentUser, err := s.UserDbService.Retrieve(ctx, "id", u.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve user: %w", err)
	}

	if !authenticate(currentUser, currentPasswd) {
		return nil, fmt.Errorf("incorrect password: %w", domain.ErrIncorrectPassword)
	}

	if err := validateUpdateCredentials(s.Validator, u); err != nil {
		return nil, fmt.Errorf("invalid update user creds data: %w: %w", domain.ErrInvalidArguments, err)
	}

	currentUser.Username = u.Username
	currentUser.PasswordHash, err = bcrypt.GenerateFromPassword([]byte(u.Password), s.BcryptCost)
	if err != nil {
		return nil, fmt.Errorf("failed to create passowrd hash %w", err)
	}

	updatedUser, err := s.UserDbService.Update(ctx, currentUser)
	if err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
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

func (s *UserService) UpdateClaims(ctx context.Context, c *auth.Claims, u *user.User) (*user.User, error) {
	if !c.Admin {
		return nil, fmt.Errorf("unauthorized to update user claims %s: %w", u.Id, domain.ErrUnauthorized)
	}

	currentUser, err := s.UserDbService.Retrieve(ctx, "id", u.Id)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve user: %w", err)
	}

	currentUser.Admin = u.Admin

	updatedUser, err := s.UserDbService.Update(ctx, currentUser)
	if err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}

	return updatedUser, nil
}

func (s *UserService) Delete(ctx context.Context, c *auth.Claims, password string, id string) error {
	if c.Id == "anonymous" || id != c.Id {
		return fmt.Errorf("unauthorized to delete user %s: %w", id, domain.ErrUnauthorized)
	}

	u, err := s.UserDbService.Retrieve(ctx, "id", id)
	if err != nil {
		return fmt.Errorf("failed to retrieve user: %w", err)
	}

	if !authenticate(u, password) {
		return fmt.Errorf("incorrect password: %w", domain.ErrIncorrectPassword)
	}

	if err := s.UserDbService.Delete(ctx, id); err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}

	return nil
}

func (s *UserService) List(ctx context.Context, c *auth.Claims) ([]*user.User, error) {
	if !c.Admin {
		return nil, fmt.Errorf("unauthorized to list users: %w", domain.ErrUnauthorized)
	}

	users, err := s.UserDbService.RetrieveAll(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to list users: %w", err)
	}

	return users, nil
}

func (s *UserService) SendResetPassword(ctx context.Context, username string) error {
	if len(username) == 0 {
		return fmt.Errorf("missing username: %w", domain.ErrInvalidArguments)
	}

	u, err := s.UserDbService.Retrieve(ctx, "username", username)
	if err != nil {
		return fmt.Errorf("failed to retrieve user: %w", err)
	}

	claims := auth.Claims{Id: u.Id, Admin: false, SharedAccounts: []string{}, ResetPassword: true}
	resetToken, err := s.JwtService.GenerateResetPasswordToken(&claims)

	if err != nil {
		return fmt.Errorf("failed to generate password token: %w", err)
	}

	clickUrl, err := url.ParseRequestURI(s.FrontEndUrl.String())
	if err != nil {
		return fmt.Errorf("failed to parse frontend url: %w", err)
	}

	resetTokenPath := fmt.Sprintf("/resetpassword/%s", resetToken)
	clickUrl.Path = path.Join(clickUrl.Path, resetTokenPath)

	emailMessage := fmt.Sprintf("Please reset your password by <a href=%s>clicking here</a>", clickUrl.String())
	email := domain.Email{
		ToAddress: u.Username,
		Subject:   "Reset password",
		Content:   emailMessage,
	}

	if err := s.EmailService.Send(ctx, &email); err != nil {
		return fmt.Errorf("failed send email: %w", err)
	}

	return nil
}

func (s *UserService) ResetPassword(ctx context.Context, token string, newPassword string) error {
	if len(token) == 0 || len(newPassword) == 0 {
		return fmt.Errorf("missing token or password: %w", domain.ErrInvalidArguments)
	}

	claims, err := s.JwtService.ParseToken(token)
	if err != nil {
		var aErr *auth.Error
		if errors.As(err, &aErr) && aErr.Type == auth.ErrorExpiredToken {
			return fmt.Errorf("token is expired: %w: %w", domain.ErrTokenExpired, err)
		}
		return fmt.Errorf("error parsing token: %w: %w", domain.ErrInvalidToken, err)
	}

	if !claims.ResetPassword {
		return fmt.Errorf("this token cannot be used to reset password: %w", domain.ErrInvalidToken)
	}

	currentUser, err := s.UserDbService.Retrieve(ctx, "id", claims.Id)
	if err != nil {
		return fmt.Errorf("failed to retrieve user: %w", err)
	}

	currentUser.PasswordHash, err = bcrypt.GenerateFromPassword([]byte(newPassword), s.BcryptCost)
	if err != nil {
		return fmt.Errorf("failed to create password hash: %w", err)
	}

	_, err = s.UserDbService.Update(ctx, currentUser)
	if err != nil {
		return fmt.Errorf("failed to update user: %w", err)
	}

	return nil
}
