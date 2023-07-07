package gin

import (
	"github.com/gin-gonic/gin"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/user"
	"time"
)

func RegisterUserRoutes(router *gin.Engine, us user.UserService, js domain.JwtService, cs domain.CaptchaService) {
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

func userCreateHandler(us user.UserService, cs domain.CaptchaService) func(*gin.Context) {
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

		u := user.EmptyUser()
		u.Username = userData.Username
		u.Password = userData.Password
		u.SharedAccountNames = userData.SharedAccounts
		u.CreatedOn = time.Time{}
		u.LastAuthOn = time.Time{}

		userRead, uErr := us.Create(c.Request.Context(), &u)
		if uErr != nil {
			switch uErr.Type {
			case user.UserAlreadyExistsError:
				c.JSON(BadRequestErrResp("user already exists"))
			case user.UserInvalidArgumentsError:
				c.JSON(BadRequestErrResp(uErr.Error()))
			default:
				c.JSON(ServerErrResp(""))
			}
			return
		}

		c.JSON(OkResp(userToMap(userRead)))
	}
}

func userToMap(u *user.User) map[string]any {
	return map[string]any{
		"id":             u.Id,
		"username":       u.Username,
		"sharedAccounts": u.SharedAccountNames,
		"admin":          u.Admin,
		"createdOn":      u.CreatedOn,
		"lastAuthOn":     u.LastAuthOn,
	}
}

func userGetHandler(us user.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		userId := c.Param("userId")
		claims := getUserClaims(c)

		if userId == "" {
			userId = claims.Id
		}

		u, uErr := us.Get(c.Request.Context(), claims, userId)

		if uErr != nil {
			switch uErr.Type {
			case user.UserNotFoundError:
				c.JSON(NotFoundErrResp(""))
			case user.UserUnauthorizedError:
				c.JSON(UnauthorizedErrResp(""))
			default:
				c.JSON(ServerErrResp(""))
			}
			return
		}

		c.JSON(OkResp(userToMap(u)))
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

func userGetExistsHandler(us user.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		userId := c.Param("userName")

		exists, uErr := us.Exists(c.Request.Context(), userId)
		if uErr != nil {
			c.JSON(ServerErrResp(""))
			return
		}
		c.JSON(OkResp(map[string]any{"exists": exists}))
	}
}

func userListHandler(us user.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		claims := getUserClaims(c)
		allUsers, uErr := us.List(c.Request.Context(), claims)
		if uErr != nil {
			switch uErr.Type {
			case user.UserUnauthorizedError:
				c.JSON(UnauthorizedErrResp(""))
			default:
				c.JSON(ServerErrResp(""))
			}
			return
		}

		c.JSON(OkResp(usersToListOfMaps(allUsers)))
	}
}

func usersToListOfMaps(users []*user.User) []map[string]any {
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

func userUpdateHandler(users user.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		userId := c.Param("userId")
		claims := getUserClaims(c)

		var userData UserUpdate
		if err := c.ShouldBindJSON(&userData); err != nil {
			c.JSON(BadRequestErrResp(err.Error()))
			return
		}

		u := user.EmptyUser()
		u.Id = userId
		u.SharedAccountNames = userData.SharedAccounts

		userRead, uErr := users.Update(c.Request.Context(), claims, &u)
		if uErr != nil {
			switch uErr.Type {
			case user.UserNotFoundError:
				c.JSON(NotFoundErrResp(""))
			case user.UserInvalidArgumentsError:
				c.JSON(BadRequestErrResp(uErr.Error()))
			case user.UserUnauthorizedError:
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

func userUpdateCredentialsHandler(us user.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		userId := c.Param("userId")
		claims := getUserClaims(c)

		var userData UserCredentials
		if err := c.ShouldBindJSON(&userData); err != nil {
			c.JSON(BadRequestErrResp(err.Error()))
			return
		}

		u := user.EmptyUser()
		u.Id = userId
		u.Username = userData.Username
		u.Password = userData.Password

		userRead, uErr := us.UpdateCredentials(c.Request.Context(), claims, userData.CurrentPassword, &u)
		if uErr != nil {
			switch uErr.Type {
			case user.UserNotFoundError:
				c.JSON(NotFoundErrResp(""))
			case user.UserInvalidArgumentsError:
				c.JSON(BadRequestErrResp(uErr.Error()))
			case user.UserIncorrectPasswordError:
				c.JSON(BadRequestErrResp("incorrect password"))
			case user.UserUnauthorizedError:
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

func userUpdateClaimsHandler(us user.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		userId := c.Param("userId")
		claims := getUserClaims(c)

		var userData UserClaims
		if err := c.ShouldBindJSON(&userData); err != nil {
			c.JSON(BadRequestErrResp(err.Error()))
			return
		}

		u := user.EmptyUser()
		u.Id = userId
		u.Admin = userData.Admin

		userRead, uErr := us.UpdateClaims(c.Request.Context(), claims, &u)
		if uErr != nil {
			switch uErr.Type {
			case user.UserNotFoundError:
				c.JSON(NotFoundErrResp(""))
			case user.UserInvalidArgumentsError:
				c.JSON(BadRequestErrResp(uErr.Error()))
			case user.UserUnauthorizedError:
				c.JSON(UnauthorizedErrResp(""))
			default:
				c.JSON(ServerErrResp(""))
			}
			return
		}

		c.JSON(OkResp(userToMap(userRead)))
	}
}

func userDeleteHandler(us user.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		userId := c.Param("userId")
		claims := getUserClaims(c)

		if uErr := us.Delete(c.Request.Context(), claims, userId); uErr != nil {
			switch uErr.Type {
			case user.UserUnauthorizedError:
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

func resetSendPasswordHandler(us user.UserService, cs domain.CaptchaService) func(*gin.Context) {
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

		uErr := us.SendResetPassword(c.Request.Context(), userData.Username)

		if uErr != nil {
			switch uErr.Type {
			case user.UserInvalidArgumentsError:
				c.JSON(BadRequestErrResp(uErr.Error()))
			case user.UserNotFoundError:
				c.JSON(NotFoundErrResp(""))
			case user.UserSendEmailError:
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

func resetPasswordHandler(us user.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		var userData UserResetPassword
		if err := c.BindJSON(&userData); err != nil {
			c.JSON(BadRequestErrResp(err.Error()))
			return
		}

		if uErr := us.ResetPassword(c.Request.Context(), userData.Token, userData.Password); uErr != nil {
			switch uErr.Type {
			case user.UserInternalError:
				c.JSON(ServerErrResp(""))
			default:
				c.JSON(BadRequestErrResp(uErr.Error()))
			}
			return
		}
		c.JSON(OkResp(""))
	}

}
