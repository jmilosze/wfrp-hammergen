package gin

import (
	"errors"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jmilosze/wfrp-hammergen-go/internal"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/user"
)

func RegisterAuthRoutes(router *gin.Engine, us user.UserService, js auth.JwtService) {
	router.POST("api/token", tokenHandler(us, js))
}

func tokenHandler(us user.UserService, js auth.JwtService) func(*gin.Context) {
	return func(c *gin.Context) {
		username := c.PostForm("username")
		password := c.PostForm("password")

		u, err := us.Authenticate(c.Request.Context(), username, password)

		if err != nil {
			if errors.Is(err, domain.ErrNotFound) {
				c.JSON(NotFoundErrResp("user not found"))
				return
			}
			if errors.Is(err, domain.ErrIncorrectPassword) {
				c.JSON(ForbiddenErrResp("invalid password"))
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": "internal server error"})
			return
		}

		claims := auth.Claims{Id: u.Id, Admin: u.Admin, SharedAccounts: u.SharedAccountIds, ResetPassword: false}
		token, err := js.GenerateAccessToken(&claims)

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": "error generating token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "accessToken": token, "tokenType": "bearer"})
	}
}

func RequireJwt(js auth.JwtService) gin.HandlerFunc {
	return func(c *gin.Context) {
		traceHeader := c.Request.Header.Get("X-Cloud-Trace-Context")
		ctx := internal.ContextWithTrace(c.Request.Context(), traceHeader)
		c.Request = c.Request.WithContext(ctx)

		authHeader := c.Request.Header.Get("Authorization")
		if authHeader == "" {
			setAnonymous(c)
			slog.InfoContext(ctx, "user log", "user", "anonymous")
			return
		}

		token, err := parseAuthHeader(authHeader)
		if err != nil {
			c.AbortWithStatusJSON(UnauthorizedErrResp(""))
			slog.InfoContext(ctx, "user log", "user", "invalid")
			return
		}

		claims, authErr := js.ParseToken(token)
		if authErr != nil {
			log.Println("error handling parsing auth token", authErr)
			c.AbortWithStatusJSON(UnauthorizedErrResp(""))
			slog.InfoContext(ctx, "user log", "user", "invalid")
			return
		}

		if claims.ResetPassword {
			c.AbortWithStatusJSON(UnauthorizedErrResp(""))
			slog.InfoContext(ctx, "user log", "user", "invalid")
			return
		}

		c.Set("claims", claims)
		slog.InfoContext(ctx, "user log", "user", claims.Id)
	}
}

func setAnonymous(c *gin.Context) {
	c.Set("claims", &auth.Claims{
		Id:             "anonymous",
		Admin:          false,
		SharedAccounts: []string{},
	})
}

func getUserClaims(c *gin.Context) *auth.Claims {
	val, ok := c.Get("claims")
	if !ok {
		return &auth.Claims{Id: "anonymous"}
	}
	return val.(*auth.Claims)
}

func parseAuthHeader(authHeader string) (string, error) {
	if authHeader == "" {
		return "", fmt.Errorf("missing 'Authorization' header")
	}

	parts := strings.SplitN(authHeader, " ", 2)
	if !(len(parts) == 2 && parts[0] == "Bearer") || parts[1] == "" {
		return "", fmt.Errorf("invalid 'Authorization' header")
	}

	return parts[1], nil
}
