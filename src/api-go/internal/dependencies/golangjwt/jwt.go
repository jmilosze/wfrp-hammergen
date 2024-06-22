package golangjwt

import (
	"errors"
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
	"time"
)

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

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":      claims.Id,
		"exp":      currentTime.Add(expiryTime).Unix(),
		"orig_iat": currentTime.Unix(),
		"adm":      claims.Admin,
		"shrd_acc": claims.SharedAccounts,
		"pwd":      claims.ResetPassword,
	})

	signedToken, err := token.SignedString(hmacSecret)
	if err != nil {
		return "", fmt.Errorf("could not sing token: %w", err)
	}

	return signedToken, nil
}

func (jwtService *HmacService) GenerateResetPasswordToken(claims *auth.Claims) (string, error) {
	return generateToken(claims, jwtService.ResetTokenExpiryTime, jwtService.HmacSecret)
}

func (jwtService *HmacService) ParseToken(tokenString string) (*auth.Claims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtService.HmacSecret, nil
	})

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, &auth.Error{Type: auth.ErrorExpiredToken, Err: fmt.Errorf("token is expired: %w", err)}
		} else {
			return nil, fmt.Errorf("could not parse token: %w", err)
		}
	}

	jwtClaims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, fmt.Errorf("could not extract claims: %w", err)
	}

	var claims auth.Claims
	claims.Id, ok = jwtClaims["sub"].(string)
	claims.Admin, _ = jwtClaims["adm"].(bool)
	claims.ResetPassword, _ = jwtClaims["pwd"].(bool)

	sharedAccounts, _ := jwtClaims["shrd_acc"].([]interface{})
	claims.SharedAccounts = make([]string, len(sharedAccounts))
	for i, acc := range sharedAccounts {
		claims.SharedAccounts[i], _ = acc.(string)
	}

	return &claims, nil
}
