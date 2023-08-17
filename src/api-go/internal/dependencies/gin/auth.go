package gin

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/user"
	"log"
	"net/http"
	"strings"
)

func RegisterAuthRoutes(router *gin.Engine, us user.UserService, js auth.JwtService) {
	router.POST("api/token", tokenHandler(us, js))
}

func tokenHandler(us user.UserService, js auth.JwtService) func(*gin.Context) {
	return func(c *gin.Context) {
		username := c.PostForm("username")
		password := c.PostForm("password")

		u, uErr := us.Authenticate(c.Request.Context(), username, password)

		if uErr != nil {
			switch uErr.Type {
			case user.NotFoundError:
				c.JSON(NotFoundErrResp("user not found"))
			case user.IncorrectPasswordError:
				c.JSON(ForbiddenErrResp("invalid password"))
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": "internal server error"})
			}
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
		authHeader := c.Request.Header.Get("Authorization")

		token, err := parseAuthHeader(authHeader)
		if err != nil {
			setAnonymous(c)
			return
		}

		claims, authErr := js.ParseToken(token)
		if authErr != nil {
			log.Println("error handling parsing auth token", authErr)
			setInvalid(c)
			return
		}

		if claims.ResetPassword {
			setAnonymous(c)
			return
		}

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
