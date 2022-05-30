package gin

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"net/http"
	"strings"
)

func RegisterAuthRoutes(router *gin.Engine, us domain.UserService, js domain.JwtService) {
	router.POST("api/token", tokenHandler(us, js))
}

func tokenHandler(us domain.UserService, js domain.JwtService) func(*gin.Context) {
	return func(c *gin.Context) {
		username := c.PostForm("username")
		password := c.PostForm("password")

		user, err := us.Authenticate(c.Request.Context(), username, password)

		if err != nil {
			switch err.Type {
			case domain.UserNotFoundError:
				c.JSON(http.StatusNotFound, gin.H{"code": http.StatusNotFound, "message": "user not found"})
			case domain.UserIncorrectPasswordError:
				c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": "invalid password"})
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": "internal server error"})
			}
			return
		}

		claims := domain.Claims{Id: user.Id, Admin: user.Admin, SharedAccounts: user.SharedAccounts, ResetPassword: false}
		token, tokenErr := js.GenerateAccessToken(&claims)

		if tokenErr != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": "error generating token"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "access_token": token, "token_type": "bearer"})
	}
}

func RequireJwt(js domain.JwtService) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.Request.Header.Get("Authorization")

		token, err := parseAuthHeader(authHeader)
		if err != nil {
			unauthorized(c)
			return
		}

		claims, err := js.ParseToken(token)
		if err != nil {
			unauthorized(c)
			return
		}

		if claims.ResetPassword {
			unauthorized(c)
			return
		}

		c.Set("ClaimsId", claims.Id)
		c.Set("ClaimsAdmin", claims.Admin)
		c.Set("ClaimsSharedAccounts", claims.SharedAccounts)
	}
}

func unauthorized(c *gin.Context) {
	c.Abort()
	c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized, "message": "unauthorized"})
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
