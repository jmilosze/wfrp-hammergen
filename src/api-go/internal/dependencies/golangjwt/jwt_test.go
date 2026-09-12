package golangjwt

import (
	"errors"
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
)

func TestGenerateAndParseAccessToken(t *testing.T) {
	service := NewHmacService("secret-key", 15*time.Minute, 1*time.Hour)

	inputClaims := &auth.Claims{
		Id:             "user-456",
		Admin:          true,
		SharedAccounts: []string{"acc-1", "acc-2"},
		ResetPassword:  false,
	}

	tokenStr, err := service.GenerateAccessToken(inputClaims)
	if err != nil {
		t.Fatalf("unexpected error generating token: %v", err)
	}

	parsedClaims, err := service.ParseToken(tokenStr)
	if err != nil {
		t.Fatalf("unexpected error parsing token: %v", err)
	}

	if parsedClaims.Id != inputClaims.Id {
		t.Errorf("expected Id %q, got %q", inputClaims.Id, parsedClaims.Id)
	}
	if parsedClaims.Admin != inputClaims.Admin {
		t.Errorf("expected Admin %v, got %v", inputClaims.Admin, parsedClaims.Admin)
	}
	if parsedClaims.ResetPassword != inputClaims.ResetPassword {
		t.Errorf("expected ResetPassword %v, got %v", inputClaims.ResetPassword, parsedClaims.ResetPassword)
	}
	if len(parsedClaims.SharedAccounts) != 2 || parsedClaims.SharedAccounts[0] != "acc-1" || parsedClaims.SharedAccounts[1] != "acc-2" {
		t.Errorf("expected SharedAccounts %v, got %v", inputClaims.SharedAccounts, parsedClaims.SharedAccounts)
	}
}

func TestGenerateAndParseResetPasswordToken(t *testing.T) {
	service := NewHmacService("secret-key", 15*time.Minute, 1*time.Hour)

	inputClaims := &auth.Claims{
		Id:             "user-789",
		Admin:          false,
		SharedAccounts: []string{},
		ResetPassword:  true,
	}

	tokenStr, err := service.GenerateResetPasswordToken(inputClaims)
	if err != nil {
		t.Fatalf("unexpected error generating reset password token: %v", err)
	}

	parsedClaims, err := service.ParseToken(tokenStr)
	if err != nil {
		t.Fatalf("unexpected error parsing token: %v", err)
	}

	if parsedClaims.Id != inputClaims.Id {
		t.Errorf("expected Id %q, got %q", inputClaims.Id, parsedClaims.Id)
	}
	if !parsedClaims.ResetPassword {
		t.Errorf("expected ResetPassword true, got %v", parsedClaims.ResetPassword)
	}
}

func TestParseExpiredToken(t *testing.T) {
	// Expiry time is negative so token is immediately expired
	service := NewHmacService("secret-key", -1*time.Minute, -1*time.Minute)

	inputClaims := &auth.Claims{
		Id: "user-expired",
	}

	tokenStr, err := service.GenerateAccessToken(inputClaims)
	if err != nil {
		t.Fatalf("unexpected error generating token: %v", err)
	}

	_, err = service.ParseToken(tokenStr)
	if err == nil {
		t.Fatal("expected error parsing expired token, got nil")
	}

	var authErr *auth.Error
	if !errors.As(err, &authErr) || authErr.Type != auth.ErrorExpiredToken {
		t.Fatalf("expected auth.Error of type ErrorExpiredToken, got: %v", err)
	}
}

func TestParseInvalidSignature(t *testing.T) {
	service1 := NewHmacService("secret-1", 15*time.Minute, 1*time.Hour)
	service2 := NewHmacService("secret-2", 15*time.Minute, 1*time.Hour)

	tokenStr, err := service1.GenerateAccessToken(&auth.Claims{Id: "user-1"})
	if err != nil {
		t.Fatalf("unexpected error generating token: %v", err)
	}

	_, err = service2.ParseToken(tokenStr)
	if err == nil {
		t.Fatal("expected signature mismatch error, got nil")
	}
}

func TestParseUnexpectedSigningMethod(t *testing.T) {
	service := NewHmacService("secret-key", 15*time.Minute, 1*time.Hour)

	// Create token with None signing method
	token := jwt.NewWithClaims(jwt.SigningMethodNone, CustomClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Subject: "user-none",
		},
	})
	tokenStr, err := token.SignedString(jwt.UnsafeAllowNoneSignatureType)
	if err != nil {
		t.Fatalf("unexpected error creating unsigned token: %v", err)
	}

	_, err = service.ParseToken(tokenStr)
	if err == nil {
		t.Fatal("expected error for unexpected signing method, got nil")
	}
}
