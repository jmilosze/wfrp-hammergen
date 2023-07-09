package golangjwt

import (
	"fmt"
	"github.com/golang-jwt/jwt/v4"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
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

func (jwtService *HmacService) GenerateAccessToken(claims *domain.Claims) (string, error) {
	return generateToken(claims, jwtService.AccessTokenExpiryTime, jwtService.HmacSecret)
}

func generateToken(claims *domain.Claims, expiryTime time.Duration, hmacSecret []byte) (string, error) {
	currentTime := time.Now()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":      claims.Id,
		"exp":      currentTime.Add(expiryTime).Unix(),
		"orig_iat": currentTime.Unix(),
		"adm":      claims.Admin,
		"shrd_acc": claims.SharedAccounts,
		"pwd":      claims.ResetPassword,
	})
	return token.SignedString(hmacSecret)
}

func (jwtService *HmacService) GenerateResetPasswordToken(claims *domain.Claims) (string, error) {
	return generateToken(claims, jwtService.ResetTokenExpiryTime, jwtService.HmacSecret)
}

func (jwtService *HmacService) ParseToken(tokenString string) (*domain.Claims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtService.HmacSecret, nil
	})

	if err != nil {
		return nil, &domain.InvalidTokenError{Err: err}
	}

	if !token.Valid {
		return nil, &domain.InvalidTokenError{Err: fmt.Errorf("invalid token")}
	}

	jwtClaims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return nil, &domain.InvalidTokenError{Err: fmt.Errorf("error performin type Claims type assertion")}
	}

	if validErr := jwtClaims.Valid(); validErr != nil {
		return nil, &domain.InvalidTokenError{Err: fmt.Errorf("invalid token")}
	}

	var claims domain.Claims
	claims.Id, _ = jwtClaims["sub"].(string)
	claims.Admin, _ = jwtClaims["adm"].(bool)
	claims.ResetPassword, _ = jwtClaims["pwd"].(bool)

	sharedAccounts, _ := jwtClaims["shrd_acc"].([]interface{})
	claims.SharedAccounts = make([]string, len(sharedAccounts))
	for i, acc := range sharedAccounts {
		claims.SharedAccounts[i], _ = acc.(string)
	}

	return &claims, nil
}
