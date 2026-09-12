package golangjwt

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
)

type CustomClaims struct {
	Admin          bool     `json:"adm"`
	SharedAccounts []string `json:"shrd_acc"`
	ResetPassword  bool     `json:"pwd"`
	jwt.RegisteredClaims
}

type HmacService struct {
	HmacSecret            []byte
	AccessTokenExpiryTime time.Duration
	ResetTokenExpiryTime  time.Duration
}

func NewHmacService(hmacSecret string, accessTokenExpiryTime time.Duration, resetTokenExpiryTime time.Duration) *HmacService {
	return &HmacService{
		HmacSecret:            []byte(hmacSecret),
		AccessTokenExpiryTime: accessTokenExpiryTime,
		ResetTokenExpiryTime:  resetTokenExpiryTime,
	}
}

func (jwtService *HmacService) GenerateAccessToken(claims *auth.Claims) (string, error) {
	return generateToken(claims, jwtService.AccessTokenExpiryTime, jwtService.HmacSecret)
}

func generateToken(claims *auth.Claims, expiryTime time.Duration, hmacSecret []byte) (string, error) {
	currentTime := time.Now()

	customClaims := CustomClaims{
		Admin:          claims.Admin,
		SharedAccounts: claims.SharedAccounts,
		ResetPassword:  claims.ResetPassword,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   claims.Id,
			ExpiresAt: jwt.NewNumericDate(currentTime.Add(expiryTime)),
			IssuedAt:  jwt.NewNumericDate(currentTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, customClaims)
	signedToken, err := token.SignedString(hmacSecret)
	if err != nil {
		return "", fmt.Errorf("could not sign token: %w", err)
	}

	return signedToken, nil
}

func (jwtService *HmacService) GenerateResetPasswordToken(claims *auth.Claims) (string, error) {
	return generateToken(claims, jwtService.ResetTokenExpiryTime, jwtService.HmacSecret)
}

func (jwtService *HmacService) ParseToken(tokenString string) (*auth.Claims, error) {
	var customClaims CustomClaims
	token, err := jwt.ParseWithClaims(tokenString, &customClaims, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtService.HmacSecret, nil
	})

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, &auth.Error{Type: auth.ErrorExpiredToken, Err: fmt.Errorf("token is expired: %w", err)}
		}
		return nil, fmt.Errorf("could not parse token: %w", err)
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	return &auth.Claims{
		Id:             customClaims.Subject,
		Admin:          customClaims.Admin,
		SharedAccounts: customClaims.SharedAccounts,
		ResetPassword:  customClaims.ResetPassword,
	}, nil
}
