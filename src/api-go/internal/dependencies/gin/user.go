package gin

import (
	"github.com/gin-gonic/gin"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/user"
	"log"
	"time"
)

func RegisterUserRoutes(router *gin.Engine, us user.UserService, js auth.JwtService, cs domain.CaptchaService) {
	router.POST("api/user", userCreateHandler(us, cs))
	router.GET("api/user/:userId", RequireJwt(js), userGetHandler(us))
	router.GET("api/user", RequireJwt(js), userGetHandler(us))
	router.GET("api/user/exists/:userName", userGetExistsHandler(us))
	router.GET("api/user/list", RequireJwt(js), userListHandler(us))
	router.PUT("api/user/:userId", RequireJwt(js), userUpdateHandler(us))
	router.PUT("api/user", RequireJwt(js), userUpdateHandler(us))
	router.PUT("api/user/credentials/:userId", RequireJwt(js), userUpdateCredentialsHandler(us))
	router.PUT("api/user/credentials", RequireJwt(js), userUpdateCredentialsHandler(us))
	router.PUT("api/user/claims/:userId", RequireJwt(js), userUpdateClaimsHandler(us))
	router.DELETE("api/user/:userId", RequireJwt(js), userDeleteHandler(us))
	router.DELETE("api/user", RequireJwt(js), userDeleteHandler(us))
	router.POST("api/user/sendResetPassword", resetSendPasswordHandler(us, cs))
	router.POST("api/user/resetPassword", resetPasswordHandler(us))
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
			log.Println("error handling create user", err)
			c.JSON(BadRequestErrResp(err.Error()))
			return
		}
		remoteAddr := c.Request.RemoteAddr
		if !cs.Verify(c.Request.Context(), userData.Captcha, remoteAddr) {
			log.Println("error handling create user, verifying captcha")
			c.JSON(BadRequestErrResp("captcha verification error"))
			return
		}

		u := user.New()
		u.Username = userData.Username
		u.Password = userData.Password
		u.SharedAccountNames = userData.SharedAccounts
		u.CreatedOn = time.Time{}
		u.LastAuthOn = time.Time{}

		userRead, uErr := us.Create(c.Request.Context(), &u)
		if uErr != nil {
			log.Println("error handling create user", uErr)
			switch uErr.Type {
			case user.ConflictError:
				c.JSON(ConflictErrResp("user with this id or username already exists"))
			case user.InvalidArgumentsError:
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
		claims := getUserClaims(c)
		if invalid(claims) {
			c.JSON(UnauthorizedErrResp(""))
			return
		}
		userId := c.Param("userId")

		if userId == "" {
			userId = claims.Id
		}

		u, uErr := us.Get(c.Request.Context(), claims, userId)

		if uErr != nil {
			log.Println("error handling get user", uErr)
			switch uErr.Type {
			case user.NotFoundError:
				c.JSON(NotFoundErrResp(""))
			case user.UnauthorizedError:
				c.JSON(UnauthorizedErrResp(""))
			default:
				c.JSON(ServerErrResp(""))
			}
			return
		}

		c.JSON(OkResp(userToMap(u)))
	}
}

func getUserClaims(c *gin.Context) *auth.Claims {
	var claims auth.Claims

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
		if invalid(claims) {
			c.JSON(UnauthorizedErrResp(""))
			return
		}

		allUsers, uErr := us.List(c.Request.Context(), claims)
		if uErr != nil {
			log.Println("error handling list user", uErr)
			switch uErr.Type {
			case user.UnauthorizedError:
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
		claims := getUserClaims(c)
		if invalid(claims) {
			c.JSON(UnauthorizedErrResp(""))
			return
		}

		userId := c.Param("userId")
		if userId == "" {
			userId = claims.Id
		}

		var userData UserUpdate
		if err := c.ShouldBindJSON(&userData); err != nil {
			log.Println("error handling update user", err)
			c.JSON(BadRequestErrResp(err.Error()))
			return
		}

		u := user.New()
		u.Id = userId
		u.SharedAccountNames = userData.SharedAccounts

		userRead, uErr := users.Update(c.Request.Context(), claims, &u)
		if uErr != nil {
			log.Println("error handling update user", uErr)
			switch uErr.Type {
			case user.NotFoundError:
				c.JSON(NotFoundErrResp(""))
			case user.InvalidArgumentsError:
				c.JSON(BadRequestErrResp(uErr.Error()))
			case user.UnauthorizedError:
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
		claims := getUserClaims(c)
		if invalid(claims) {
			c.JSON(UnauthorizedErrResp(""))
			return
		}

		userId := c.Param("userId")

		if userId == "" {
			userId = claims.Id
		}

		var userData UserCredentials
		if err := c.ShouldBindJSON(&userData); err != nil {
			log.Println("error handling update user credentials", err)
			c.JSON(BadRequestErrResp(err.Error()))
			return
		}

		u := user.New()
		u.Id = userId
		u.Username = userData.Username
		u.Password = userData.Password

		userRead, uErr := us.UpdateCredentials(c.Request.Context(), claims, userData.CurrentPassword, &u)
		if uErr != nil {
			log.Println("error handling update user credentials", uErr)
			switch uErr.Type {
			case user.ConflictError:
				c.JSON(ConflictErrResp("user with this username already exists"))
			case user.NotFoundError:
				c.JSON(NotFoundErrResp(""))
			case user.InvalidArgumentsError:
				c.JSON(BadRequestErrResp(uErr.Error()))
			case user.IncorrectPasswordError:
				c.JSON(ForbiddenErrResp("incorrect password"))
			case user.UnauthorizedError:
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
		claims := getUserClaims(c)
		if invalid(claims) {
			c.JSON(UnauthorizedErrResp(""))
			return
		}

		userId := c.Param("userId")

		var userData UserClaims
		if err := c.ShouldBindJSON(&userData); err != nil {
			log.Println("error handling update user claims", err)
			c.JSON(BadRequestErrResp(err.Error()))
			return
		}

		u := user.New()
		u.Id = userId
		u.Admin = userData.Admin

		userRead, uErr := us.UpdateClaims(c.Request.Context(), claims, &u)
		if uErr != nil {
			log.Println("error handling update user claims", uErr)
			switch uErr.Type {
			case user.NotFoundError:
				c.JSON(NotFoundErrResp(""))
			case user.InvalidArgumentsError:
				c.JSON(BadRequestErrResp(uErr.Error()))
			case user.UnauthorizedError:
				c.JSON(UnauthorizedErrResp(""))
			default:
				c.JSON(ServerErrResp(""))
			}
			return
		}

		c.JSON(OkResp(userToMap(userRead)))
	}
}

type UserDelete struct {
	Password string `json:"password"`
}

func userDeleteHandler(us user.UserService) func(*gin.Context) {
	return func(c *gin.Context) {
		claims := getUserClaims(c)
		if invalid(claims) {
			c.JSON(UnauthorizedErrResp(""))
			return
		}

		userId := c.Param("userId")
		if userId == "" {
			userId = claims.Id
		}

		var userData UserDelete
		if err := c.ShouldBindJSON(&userData); err != nil {
			log.Println("error handling delete user", err)
			c.JSON(BadRequestErrResp(err.Error()))
			return
		}

		if uErr := us.Delete(c.Request.Context(), claims, userData.Password, userId); uErr != nil {
			log.Println("error handling delete user", uErr)
			switch uErr.Type {
			case user.NotFoundError:
				c.JSON(NotFoundErrResp("user not found"))
			case user.UnauthorizedError:
				c.JSON(UnauthorizedErrResp(""))
			case user.IncorrectPasswordError:
				c.JSON(ForbiddenErrResp("incorrect password"))
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
			log.Println("error handling sand reset password", err)
			c.JSON(BadRequestErrResp(err.Error()))
			return
		}

		remoteAddr := c.Request.RemoteAddr
		if !cs.Verify(c.Request.Context(), userData.Captcha, remoteAddr) {
			log.Println("error handling send reset password, verifying captcha")
			c.JSON(BadRequestErrResp("captcha verification error"))
			return
		}

		uErr := us.SendResetPassword(c.Request.Context(), userData.Username)

		if uErr != nil {
			log.Println("error handling send reset password", uErr)
			switch uErr.Type {
			case user.InvalidArgumentsError:
				c.JSON(BadRequestErrResp(uErr.Error()))
			case user.NotFoundError:
				c.JSON(NotFoundErrResp(""))
			case user.SendEmailError:
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
			log.Println("error handling reset password", err)
			c.JSON(BadRequestErrResp(err.Error()))
			return
		}

		if uErr := us.ResetPassword(c.Request.Context(), userData.Token, userData.Password); uErr != nil {
			log.Println("error handling reset password", uErr)
			switch uErr.Type {
			case user.InternalError:
				c.JSON(ServerErrResp(""))
			case user.TokenExpiredError:
				c.JSON(ForbiddenErrResp(""))
			default:
				c.JSON(BadRequestErrResp(""))
			}
			return
		}
		c.JSON(OkResp(""))
	}

}
