package gin

import (
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/user"
	"log"
	"log/slog"
	"net/http"
	"strings"
)

func RegisterAuthRoutes(router *gin.Engine, us user.UserService, js auth.JwtService, logger *slog.Logger) {
	router.POST("api/token", tokenHandler(us, js))
}

func tokenHandler(us user.UserService, js auth.JwtService) func(*gin.Context) {
	return func(c *gin.Context) {
		username := c.PostForm("username")
		password := c.PostForm("password")

		u, err := us.Authenticate(c.Request.Context(), username, password)

		if err != nil {
			var uErr *user.Error
			if errors.As(err, &uErr) {
				if uErr.Type == user.ErrorNotFound {
					c.JSON(NotFoundErrResp("user not found"))
					return
				}
				if uErr.Type == user.ErrorIncorrectPassword {
					c.JSON(ForbiddenErrResp("invalid password"))
					return
				}
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

func RequireJwt(js auth.JwtService, logger *slog.Logger) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.Request.Header.Get("Authorization")
		traceHeader := c.Request.Header.Get("X-Cloud-Trace-Context")

		token, err := parseAuthHeader(authHeader)
		if err != nil {
			setAnonymous(c)
			logger.Info("user info", "user", "anonymous", "traceId", traceHeader)
			return
		}

		claims, authErr := js.ParseToken(token)
		if authErr != nil {
			log.Println("error handling parsing auth token", authErr)
			setInvalid(c)
			logger.Info("user info", "user", "invalid", "traceId", traceHeader)
			return
		}

		if claims.ResetPassword {
			setAnonymous(c)
			logger.Info("user info", "user", "anonymous", "traceId", traceHeader)
			return
		}

		logger.Info("user info", "user", claims.Id, "traceId", traceHeader)

		c.Set("ClaimsId", claims.Id)
		c.Set("ClaimsAdmin", claims.Admin)
		c.Set("ClaimsSharedAccounts", claims.SharedAccounts)
	}
}

func setAnonymous(c *gin.Context) {
	c.Set("ClaimsId", "anonymous")
	c.Set("ClaimsAdmin", false)
	c.Set("ClaimsSharedAccounts", []string{})
}

func setInvalid(c *gin.Context) {
	c.Set("ClaimsId", "invalid")
	c.Set("ClaimsAdmin", false)
	c.Set("ClaimsSharedAccounts", []string{})
}

func parseAuthHeader(authHeader string) (string, error) {
	if authHeader == "" {
		return "", fmt.Errorf("missing 'Authorization' header")
	}

	parts := strings.SplitN(authHeader, " ", 2)
	if !(len(parts) == 2 && parts[0] == "Bearer") {
		return "", fmt.Errorf("invalid 'Authorization' header")
	}

	return parts[1], nil
}
