package gin

import (
	"github.com/gin-gonic/gin"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"net/http"
)

func RegisterUserRoutes(router *gin.Engine, us domain.UserService, js domain.JwtService, cs domain.CaptchaService) {
	router.POST("api/user", createHandler(us, cs))
	router.GET("api/user/:userId", RequireJwt(js), getHandler(us))
	router.GET("api/user/exists/:userName", RequireJwt(js), getExistsHandler(us))
	router.GET("api/user", RequireJwt(js), listHandler(us))
	router.PUT("api/user/:userId", RequireJwt(js), updateHandler(us))
	router.PUT("api/user/credentials/:userId", RequireJwt(js), updateCredentialsHandler(us))
	router.PUT("api/user/claims/:userId", RequireJwt(js), updateClaims(us))
	router.DELETE("api/user/:userId", RequireJwt(js), deleteHandler(us))
	router.POST("api/user/send_reset_password", resetSendPasswordHandler(us, cs))
	router.POST("api/user/reset_password", resetPasswordHandler(us))
}

type UserCreate struct {
	Username       string   `json:"username"`
	Password       string   `json:"password"`
	SharedAccounts []string `json:"shared_accounts"`
	Captcha        string   `json:"captcha"`
}

func createHandler(us domain.UserService, cs domain.CaptchaService) func(*gin.Context) {
	return func(c *gin.Context) {
		var userData UserCreate
		if err := c.BindJSON(&userData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": err.Error()})
			return
		}

		remoteAddr := c.Request.RemoteAddr
		if !cs.Verify(userData.Captcha, remoteAddr) {
			c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": "captcha verification error"})
			return
		}

		userWriteCredentials := domain.UserWriteCredentials{Username: userData.Username, Password: userData.Password}
		userWrite := domain.UserWrite{SharedAccountNames: userData.SharedAccounts}

		userRead, err := us.Create(&userWriteCredentials, &userWrite)
		if err != nil {
			switch err.Type {
			case domain.UserAlreadyExistsError:
				c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": "user already exists"})
			case domain.UserInvalidArguments:
				c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": err.Error()})
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": "internal server error"})
			}
			return
		}

		c.JSON(http.StatusCreated, gin.H{"code": http.StatusCreated, "data": userToMap(userRead)})
	}
}

func userToMap(user *domain.User) map[string]interface{} {
	return gin.H{"id": user.Id, "username": user.Username, "shared_accounts": user.SharedAccountNames, "admin": user.Admin}
}

func getHandler(us domain.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		userId := c.Param("userId")

		if !authorizeGet(c, userId) {
			c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized, "message": "unauthorized"})
			return
		}

		user, err := us.Get(userId)

		if err != nil {
			if err.Type == domain.UserNotFoundError {
				c.JSON(http.StatusNotFound, gin.H{"code": http.StatusNotFound, "message": "user not found"})
				return
			}

			c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": "internal server error"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "data": userToMap(user)})
	}
}

func getExistsHandler(us domain.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		userId := c.Param("userName")

		exists, err := us.Exists(userId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": "internal server error"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "data": gin.H{"exists": exists}})
	}
}

func authorizeGet(c *gin.Context, userId string) bool {
	claims := getUserClaims(c)
	return userId == claims.Id || claims.Admin
}

func getUserClaims(c *gin.Context) *domain.Claims {
	var claims domain.Claims

	claims.Id = c.GetString("ClaimsId")
	claims.Admin = c.GetBool("ClaimsAdmin")

	sharedAccountsRaw, _ := c.Get("ClaimsSharedAccounts")
	claims.SharedAccounts, _ = sharedAccountsRaw.([]string)

	return &claims
}

func listHandler(us domain.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		allUsers, err := us.List()
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": http.StatusNotFound, "message": "internal server error"})
			return
		}

		visibleUsers := authorizeList(c, allUsers)

		c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "data": visibleUsers})
	}
}

func authorizeList(c *gin.Context, userList []*domain.User) []*domain.User {
	claims := getUserClaims(c)

	var visibleUsers []*domain.User
	if claims.Admin {
		visibleUsers = userList
	} else {
		for _, u := range userList {
			if claims.Id == u.Id {
				visibleUsers = append(visibleUsers, u)
				break
			}
		}
	}

	return visibleUsers
}

func updateHandler(users domain.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		userId := c.Param("userId")

		if !authorizeModify(c, userId) {
			c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized, "message": "unauthorized"})
			return
		}

		var userData domain.UserWrite
		if err := c.ShouldBindJSON(&userData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": err.Error()})
			return
		}

		userRead, err := users.Update(userId, &userData)
		if err != nil {
			switch err.Type {
			case domain.UserNotFoundError:
				c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": "user not found"})
			case domain.UserInvalidArguments:
				c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": err.Error()})
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": "internal server error"})
			}
			return
		}

		c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "data": userToMap(userRead)})
	}
}

func authorizeModify(c *gin.Context, userId string) bool {
	claims := getUserClaims(c)
	return userId == claims.Id
}

type UserCredentials struct {
	Username        string `json:"username"`
	Password        string `json:"password"`
	CurrentPassword string `json:"current_password"`
}

func updateCredentialsHandler(us domain.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		userId := c.Param("userId")
		if !authorizeModify(c, userId) {
			c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized, "message": "unauthorized"})
			return
		}

		var uc UserCredentials
		if err := c.ShouldBindJSON(&uc); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": err.Error()})
			return
		}

		userWriteCredentials := domain.UserWriteCredentials{Username: uc.Username, Password: uc.Password}

		userRead, err := us.UpdateCredentials(userId, uc.CurrentPassword, &userWriteCredentials)
		if err != nil {
			switch err.Type {
			case domain.UserNotFoundError:
				c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": "user not found"})
			case domain.UserInvalidArguments:
				c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": err.Error()})
			case domain.UserIncorrectPassword:
				c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": "incorrect password"})
			default:
				c.JSON(http.StatusNotFound, gin.H{"code": http.StatusNotFound, "message": "internal server error"})
			}
			return
		}

		c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "data": userToMap(userRead)})
	}
}

func updateClaims(us domain.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		userId := c.Param("userId")

		if !authorizeModifyClaims(c) {
			c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized, "message": "unauthorized"})
			return
		}

		var userData domain.UserWriteClaims
		if err := c.ShouldBindJSON(&userData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": err.Error()})
			return
		}

		userRead, err := us.UpdateClaims(userId, &userData)
		if err != nil {
			switch err.Type {
			case domain.UserNotFoundError:
				c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": "user not found"})
			case domain.UserInvalidArguments:
				c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": err.Error()})
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": "internal server error"})
			}
			return
		}

		c.JSON(http.StatusOK, gin.H{"code": http.StatusOK, "data": userToMap(userRead)})
	}
}

func authorizeModifyClaims(c *gin.Context) bool {
	claims := getUserClaims(c)
	return claims.Admin
}

func deleteHandler(us domain.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		userId := c.Param("userId")

		if !authorizeModify(c, userId) {
			c.JSON(http.StatusUnauthorized, gin.H{"code": http.StatusUnauthorized, "message": "unauthorized"})
			return
		}

		if err := us.Delete(userId); err != nil {
			c.JSON(http.StatusNotFound, gin.H{"code": http.StatusNotFound, "message": "internal server error"})
			return
		}

		c.JSON(http.StatusNoContent, gin.H{"code": http.StatusNoContent})
	}
}

type UserSendResetPassword struct {
	Username string `json:"username"`
	Captcha  string `json:"captcha"`
}

func resetSendPasswordHandler(us domain.UserService, cs domain.CaptchaService) func(*gin.Context) {
	return func(c *gin.Context) {
		var userData UserSendResetPassword
		if err := c.BindJSON(&userData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": err.Error()})
			return
		}

		remoteAddr := c.Request.RemoteAddr
		if !cs.Verify(userData.Captcha, remoteAddr) {
			c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": "captcha verification error"})
			return
		}

		err := us.SendResetPassword(userData.Username)

		if err != nil {
			switch err.Type {
			case domain.UserInvalidArguments:
				c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": err.Error()})
			case domain.UserNotFoundError:
				c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": "user not found"})
			default:
				c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": "internal server error"})
			}
			return
		}

		c.JSON(http.StatusNoContent, gin.H{"code": http.StatusNoContent})
	}
}

type UserResetPassword struct {
	Token    string `json:"token"`
	Password string `json:"password"`
}

func resetPasswordHandler(us domain.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		var userData UserResetPassword
		if err := c.BindJSON(&userData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": err.Error()})
			return
		}

		if err := us.ResetPassword(userData.Token, userData.Password); err != nil {
			switch err.Type {
			case domain.UserInternalError:
				c.JSON(http.StatusInternalServerError, gin.H{"code": http.StatusInternalServerError, "message": "internal server error"})
			default:
				c.JSON(http.StatusBadRequest, gin.H{"code": http.StatusBadRequest, "message": err.Error()})
			}
			return
		}
		c.JSON(http.StatusNoContent, gin.H{"code": http.StatusNoContent})
	}

}
