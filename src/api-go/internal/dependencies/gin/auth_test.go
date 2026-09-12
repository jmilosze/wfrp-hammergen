package gin

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/jmilosze/wfrp-hammergen-go/internal"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
)

type mockJwtService struct {
	parseTokenFn func(token string) (*auth.Claims, error)
}

func (m *mockJwtService) GenerateAccessToken(_ *auth.Claims) (string, error) {
	return "mock-token", nil
}

func (m *mockJwtService) GenerateResetPasswordToken(_ *auth.Claims) (string, error) {
	return "mock-reset-token", nil
}

func (m *mockJwtService) ParseToken(token string) (*auth.Claims, error) {
	if m.parseTokenFn != nil {
		return m.parseTokenFn(token)
	}
	return nil, errors.New("unimplemented")
}

func setupTestRouter(js auth.JwtService, handler gin.HandlerFunc) *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	router.GET("/test", RequireJwt(js), handler)
	return router
}

func TestRequireJwtValidTokenAndTraceContext(t *testing.T) {
	expectedClaims := &auth.Claims{
		Id:             "user-123",
		Admin:          true,
		SharedAccounts: []string{"acc-1", "acc-2"},
		ResetPassword:  false,
	}

	mockJs := &mockJwtService{
		parseTokenFn: func(token string) (*auth.Claims, error) {
			if token == "valid-token" {
				return expectedClaims, nil
			}
			return nil, errors.New("invalid token")
		},
	}

	handlerCalled := false
	router := setupTestRouter(mockJs, func(c *gin.Context) {
		handlerCalled = true

		// Check claims stored in Gin context
		claims := getUserClaims(c)
		if claims.Id != expectedClaims.Id || !claims.Admin || len(claims.SharedAccounts) != 2 {
			t.Errorf("unexpected claims: %+v", claims)
		}

		// Check trace context propagated to c.Request.Context()
		traceVal, ok := internal.TraceFromContext(c.Request.Context())
		if !ok || traceVal != "test-trace-id/span;o=1" {
			t.Errorf("expected trace context to be propagated, got %q (ok: %v)", traceVal, ok)
		}

		c.Status(http.StatusOK)
	})

	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer valid-token")
	req.Header.Set("X-Cloud-Trace-Context", "test-trace-id/span;o=1")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if !handlerCalled {
		t.Fatal("expected downstream handler to be called")
	}
	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}
}

func TestRequireJwtAnonymous(t *testing.T) {
	mockJs := &mockJwtService{}

	handlerCalled := false
	router := setupTestRouter(mockJs, func(c *gin.Context) {
		handlerCalled = true

		claims := getUserClaims(c)
		if claims.Id != "anonymous" || claims.Admin {
			t.Errorf("expected anonymous claims, got %+v", claims)
		}

		traceVal, ok := internal.TraceFromContext(c.Request.Context())
		if !ok || traceVal != "anon-trace" {
			t.Errorf("expected trace context %q, got %q", "anon-trace", traceVal)
		}

		c.Status(http.StatusOK)
	})

	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("X-Cloud-Trace-Context", "anon-trace")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if !handlerCalled {
		t.Fatal("expected downstream handler to be called for anonymous request")
	}
	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}
}

func TestRequireJwtMalformedAuthHeader(t *testing.T) {
	mockJs := &mockJwtService{}

	tests := []struct {
		name       string
		authHeader string
	}{
		{"Not Bearer", "Basic 12345"},
		{"Missing Token", "Bearer"},
		{"Missing Token Space Only", "Bearer "},
		{"Too Many Parts", "Bearer token extra"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			handlerCalled := false
			router := setupTestRouter(mockJs, func(c *gin.Context) {
				handlerCalled = true
				c.Status(http.StatusOK)
			})

			req := httptest.NewRequest("GET", "/test", nil)
			req.Header.Set("Authorization", tt.authHeader)
			w := httptest.NewRecorder()

			router.ServeHTTP(w, req)

			if handlerCalled {
				t.Fatal("expected handler to NOT be called on malformed auth header")
			}
			if w.Code != http.StatusUnauthorized {
				t.Fatalf("expected status 401, got %d", w.Code)
			}
		})
	}
}

func TestRequireJwtInvalidToken(t *testing.T) {
	mockJs := &mockJwtService{
		parseTokenFn: func(token string) (*auth.Claims, error) {
			return nil, errors.New("token is expired")
		},
	}

	handlerCalled := false
	router := setupTestRouter(mockJs, func(c *gin.Context) {
		handlerCalled = true
		c.Status(http.StatusOK)
	})

	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer expired-or-invalid-token")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if handlerCalled {
		t.Fatal("expected handler to NOT be called on invalid token")
	}
	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected status 401, got %d", w.Code)
	}
}

func TestRequireJwtResetPasswordTokenRejected(t *testing.T) {
	mockJs := &mockJwtService{
		parseTokenFn: func(token string) (*auth.Claims, error) {
			return &auth.Claims{
				Id:            "user-123",
				ResetPassword: true,
			}, nil
		},
	}

	handlerCalled := false
	router := setupTestRouter(mockJs, func(c *gin.Context) {
		handlerCalled = true
		c.Status(http.StatusOK)
	})

	req := httptest.NewRequest("GET", "/test", nil)
	req.Header.Set("Authorization", "Bearer reset-password-token")
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if handlerCalled {
		t.Fatal("expected handler to NOT be called on reset password token")
	}
	if w.Code != http.StatusUnauthorized {
		t.Fatalf("expected status 401, got %d", w.Code)
	}
}
