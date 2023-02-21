package gin

import (
	"github.com/gin-gonic/gin"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"time"
)

func RegisterUserRoutes(router *gin.Engine, us domain.UserService, js domain.JwtService, cs domain.CaptchaService) {
	router.POST("api/user", userCreateHandler(us, cs))
	router.GET("api/user/:userId", RequireJwt(js), userGetHandler(us))
	router.GET("api/user", RequireJwt(js), userGetHandler(us))
	router.GET("api/user/exists/:userName", RequireJwt(js), userGetExistsHandler(us))
	router.GET("api/user/list", RequireJwt(js), userListHandler(us))
	router.PUT("api/user/:userId", RequireJwt(js), userUpdateHandler(us))
	router.PUT("api/user/credentials/:userId", RequireJwt(js), userUpdateCredentialsHandler(us))
	router.PUT("api/user/claims/:userId", RequireJwt(js), userUpdateClaimsHandler(us))
	router.DELETE("api/user/:userId", RequireJwt(js), userDeleteHandler(us))
	router.POST("api/user/send_reset_password", resetSendPasswordHandler(us, cs))
	router.POST("api/user/reset_password", resetPasswordHandler(us))
}

type UserCreate struct {
	Username       string   `json:"username"`
	Password       string   `json:"password"`
	SharedAccounts []string `json:"sharedAccounts"`
	Captcha        string   `json:"captcha"`
}

func userCreateHandler(us domain.UserService, cs domain.CaptchaService) func(*gin.Context) {
	return func(c *gin.Context) {
		var userData UserCreate
		if err := c.BindJSON(&userData); err != nil {
			c.JSON(BadRequestErrResp(err.Error()))
			return
		}

		remoteAddr := c.Request.RemoteAddr
		if !cs.Verify(userData.Captcha, remoteAddr) {
			c.JSON(BadRequestErrResp("captcha verification error"))
			return
		}

		user := domain.EmptyUser()
		user.Username = userData.Username
		user.Password = userData.Password
		user.SharedAccountNames = userData.SharedAccounts
		user.CreatedOn = time.Time{}
		user.LastAuthOn = time.Time{}

		userRead, err := us.Create(c.Request.Context(), user)
		if err != nil {
			switch err.Type {
			case domain.UserAlreadyExistsError:
				c.JSON(BadRequestErrResp("user already exists"))
			case domain.UserInvalidArgumentsError:
				c.JSON(BadRequestErrResp(err.Error()))
			default:
				c.JSON(ServerErrResp(""))
			}
			return
		}

		c.JSON(OkResp(userToMap(userRead)))
	}
}

func userToMap(user *domain.User) map[string]any {
	return map[string]any{
		"id":             user.Id,
		"username":       user.Username,
		"sharedAccounts": user.SharedAccountNames,
		"admin":          user.Admin,
		"createdOn":      user.CreatedOn,
		"lastAuthOn":     user.LastAuthOn,
	}
}

func userGetHandler(us domain.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		userId := c.Param("userId")
		claims := getUserClaims(c)

		if userId == "" {
			userId = claims.Id
		}

		user, err := us.Get(c.Request.Context(), claims, userId)

		if err != nil {
			switch err.Type {
			case domain.UserNotFoundError:
				c.JSON(NotFoundErrResp(""))
			case domain.UserUnauthorizedError:
				c.JSON(UnauthorizedErrResp(""))
			default:
				c.JSON(ServerErrResp(""))
			}
			return
		}

		c.JSON(OkResp(userToMap(user)))
	}
}

func getUserClaims(c *gin.Context) *domain.Claims {
	var claims domain.Claims

	claims.Id = c.GetString("ClaimsId")
	claims.Admin = c.GetBool("ClaimsAdmin")

	sharedAccountsRaw, _ := c.Get("ClaimsSharedAccounts")
	claims.SharedAccounts, _ = sharedAccountsRaw.([]string)

	return &claims
}

func userGetExistsHandler(us domain.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		userId := c.Param("userName")

		exists, err := us.Exists(c.Request.Context(), userId)
		if err != nil {
			c.JSON(ServerErrResp(""))
			return
		}
		c.JSON(OkResp(map[string]any{"exists": exists}))
	}
}

func userListHandler(us domain.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		claims := getUserClaims(c)
		allUsers, err := us.List(c.Request.Context(), claims)
		if err != nil {
			switch err.Type {
			case domain.UserUnauthorizedError:
				c.JSON(UnauthorizedErrResp(""))
			default:
				c.JSON(ServerErrResp(""))
			}
			return
		}

		c.JSON(OkResp(usersToListOfMaps(allUsers)))
	}
}

func usersToListOfMaps(users []*domain.User) []map[string]any {
	list := make([]map[string]interface{}, len(users))

	for i, v := range users {
		list[i] = gin.H{
			"id":             v.Id,
			"username":       v.Username,
			"sharedAccounts": v.SharedAccountNames,
			"admin":          v.Admin,
			"createdOn":      v.CreatedOn,
			"lastAuthOn":     v.LastAuthOn,
		}
	}

	return list
}

type UserUpdate struct {
	SharedAccounts []string `json:"sharedAccounts"`
}

func userUpdateHandler(users domain.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		userId := c.Param("userId")
		claims := getUserClaims(c)

		var userData UserUpdate
		if err := c.ShouldBindJSON(&userData); err != nil {
			c.JSON(BadRequestErrResp(err.Error()))
			return
		}

		user := domain.EmptyUser()
		user.Id = userId
		user.SharedAccountNames = userData.SharedAccounts

		userRead, err := users.Update(c.Request.Context(), claims, user)
		if err != nil {
			switch err.Type {
			case domain.UserNotFoundError:
				c.JSON(NotFoundErrResp(""))
			case domain.UserInvalidArgumentsError:
				c.JSON(BadRequestErrResp(err.Error()))
			case domain.UserUnauthorizedError:
				c.JSON(UnauthorizedErrResp(""))
			default:
				c.JSON(ServerErrResp(""))
			}
			return
		}

		c.JSON(OkResp(userToMap(userRead)))
	}
}

type UserCredentials struct {
	Username        string `json:"username"`
	Password        string `json:"password"`
	CurrentPassword string `json:"currentPassword"`
}

func userUpdateCredentialsHandler(us domain.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		userId := c.Param("userId")
		claims := getUserClaims(c)

		var userData UserCredentials
		if err := c.ShouldBindJSON(&userData); err != nil {
			c.JSON(BadRequestErrResp(err.Error()))
			return
		}

		user := domain.EmptyUser()
		user.Id = userId
		user.Username = userData.Username
		user.Password = userData.Password

		userRead, err := us.UpdateCredentials(c.Request.Context(), claims, userData.CurrentPassword, user)
		if err != nil {
			switch err.Type {
			case domain.UserNotFoundError:
				c.JSON(NotFoundErrResp(""))
			case domain.UserInvalidArgumentsError:
				c.JSON(BadRequestErrResp(err.Error()))
			case domain.UserIncorrectPasswordError:
				c.JSON(BadRequestErrResp("incorrect password"))
			case domain.UserUnauthorizedError:
				c.JSON(UnauthorizedErrResp(""))
			default:
				c.JSON(ServerErrResp(""))
			}
			return
		}

		c.JSON(OkResp(userToMap(userRead)))
	}
}

type UserClaims struct {
	Admin bool `json:"admin"`
}

func userUpdateClaimsHandler(us domain.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		userId := c.Param("userId")
		claims := getUserClaims(c)

		var userData UserClaims
		if err := c.ShouldBindJSON(&userData); err != nil {
			c.JSON(BadRequestErrResp(err.Error()))
			return
		}

		user := domain.EmptyUser()
		user.Id = userId
		user.Admin = userData.Admin

		userRead, err := us.UpdateClaims(c.Request.Context(), claims, user)
		if err != nil {
			switch err.Type {
			case domain.UserNotFoundError:
				c.JSON(NotFoundErrResp(""))
			case domain.UserInvalidArgumentsError:
				c.JSON(BadRequestErrResp(err.Error()))
			case domain.UserUnauthorizedError:
				c.JSON(UnauthorizedErrResp(""))
			default:
				c.JSON(ServerErrResp(""))
			}
			return
		}

		c.JSON(OkResp(userToMap(userRead)))
	}
}

func userDeleteHandler(us domain.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		userId := c.Param("userId")
		claims := getUserClaims(c)

		if err := us.Delete(c.Request.Context(), claims, userId); err != nil {
			switch err.Type {
			case domain.UserUnauthorizedError:
				c.JSON(UnauthorizedErrResp(""))
			default:
				c.JSON(ServerErrResp(""))
			}
			return
		}

		c.JSON(OkResp(""))
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
			c.JSON(BadRequestErrResp(err.Error()))
			return
		}

		remoteAddr := c.Request.RemoteAddr
		if !cs.Verify(userData.Captcha, remoteAddr) {
			c.JSON(BadRequestErrResp("captcha verification error"))
			return
		}

		err := us.SendResetPassword(c.Request.Context(), userData.Username)

		if err != nil {
			switch err.Type {
			case domain.UserInvalidArgumentsError:
				c.JSON(BadRequestErrResp(err.Error()))
			case domain.UserNotFoundError:
				c.JSON(NotFoundErrResp(""))
			case domain.UserSendEmailError:
				c.JSON(ServerErrResp(""))
			default:
				c.JSON(ServerErrResp(""))
			}
			return
		}

		c.JSON(OkResp(""))
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
			c.JSON(BadRequestErrResp(err.Error()))
			return
		}

		if err := us.ResetPassword(c.Request.Context(), userData.Token, userData.Password); err != nil {
			switch err.Type {
			case domain.UserInternalError:
				c.JSON(ServerErrResp(""))
			default:
				c.JSON(BadRequestErrResp(err.Error()))
			}
			return
		}
		c.JSON(OkResp(""))
	}

}
