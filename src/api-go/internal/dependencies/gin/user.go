package gin

import (
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/user"
	"log"
	"log/slog"
	"time"
)

func RegisterUserRoutes(router *gin.Engine, us user.UserService, js auth.JwtService, cs domain.CaptchaService, logger *slog.Logger) {
	router.POST("api/user", userCreateHandler(us, cs))
	router.GET("api/user/:userId", RequireJwt(js, logger), userGetHandler(us))
	router.GET("api/user", RequireJwt(js, logger), userGetHandler(us))
	router.GET("api/user/exists/:userName", userGetExistsHandler(us))
	router.GET("api/user/list", RequireJwt(js, logger), userListHandler(us))
	router.PUT("api/user/:userId", RequireJwt(js, logger), userUpdateHandler(us))
	router.PUT("api/user", RequireJwt(js, logger), userUpdateHandler(us))
	router.PUT("api/user/credentials/:userId", RequireJwt(js, logger), userUpdateCredentialsHandler(us))
	router.PUT("api/user/credentials", RequireJwt(js, logger), userUpdateCredentialsHandler(us))
	router.PUT("api/user/claims/:userId", RequireJwt(js, logger), userUpdateClaimsHandler(us))
	router.DELETE("api/user/:userId", RequireJwt(js, logger), userDeleteHandler(us))
	router.DELETE("api/user", RequireJwt(js, logger), userDeleteHandler(us))
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

		userRead, err := us.Create(c.Request.Context(), &u)
		if err != nil {
			log.Println("error handling create user", err)
			var uErr *user.Error
			if errors.As(err, &uErr) {
				if uErr.Type == user.ErrorConflict {
					c.JSON(ConflictErrResp("user with this id or username already exists"))
					return
				}
				if uErr.Type == user.ErrorInvalidArguments {
					c.JSON(BadRequestErrResp(err.Error()))
					return
				}
			}
			c.JSON(ServerErrResp(""))
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

		u, err := us.Get(c.Request.Context(), claims, userId)

		if err != nil {
			log.Println("error handling get user", err)
			var uErr *user.Error
			if errors.As(err, &uErr) {
				if uErr.Type == user.ErrorNotFound {
					c.JSON(NotFoundErrResp(""))
					return
				}
				if uErr.Type == user.ErrorUnauthorized {
					c.JSON(UnauthorizedErrResp(""))
					return
				}
			}
			c.JSON(ServerErrResp(""))
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

		allUsers, err := us.List(c.Request.Context(), claims)
		if err != nil {
			log.Println("error handling list user", err)
			var uErr *user.Error
			if errors.As(err, &uErr) && uErr.Type == user.ErrorUnauthorized {
				c.JSON(UnauthorizedErrResp(""))
				return

			}
			c.JSON(ServerErrResp(""))
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

		userRead, err := users.Update(c.Request.Context(), claims, &u)
		if err != nil {
			log.Println("error handling update user", err)
			var uErr *user.Error
			if errors.As(err, &uErr) {
				if uErr.Type == user.ErrorNotFound {
					c.JSON(NotFoundErrResp(""))
					return
				}
				if uErr.Type == user.ErrorInvalidArguments {
					c.JSON(BadRequestErrResp(uErr.Error()))
					return
				}
				if uErr.Type == user.ErrorUnauthorized {
					c.JSON(UnauthorizedErrResp(""))
					return
				}
			}
			c.JSON(ServerErrResp(""))
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

		userRead, err := us.UpdateCredentials(c.Request.Context(), claims, userData.CurrentPassword, &u)
		if err != nil {
			log.Println("error handling update user credentials", err)
			var uErr *user.Error
			if errors.As(err, &uErr) {
				if uErr.Type == user.ErrorConflict {
					c.JSON(ConflictErrResp("user with this username already exists"))
					return
				}
				if uErr.Type == user.ErrorNotFound {
					c.JSON(NotFoundErrResp(""))
					return
				}
				if uErr.Type == user.ErrorInvalidArguments {
					c.JSON(BadRequestErrResp(uErr.Error()))
					return
				}
				if uErr.Type == user.ErrorIncorrectPassword {
					c.JSON(ForbiddenErrResp("incorrect password"))
					return
				}
				if uErr.Type == user.ErrorUnauthorized {
					c.JSON(UnauthorizedErrResp(""))
					return
				}
			}
			c.JSON(ServerErrResp(""))
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

		userRead, err := us.UpdateClaims(c.Request.Context(), claims, &u)
		if err != nil {
			log.Println("error handling update user claims", err)
			var uErr *user.Error
			if errors.As(err, &uErr) {
				if uErr.Type == user.ErrorNotFound {
					c.JSON(NotFoundErrResp(""))
					return
				}
				if uErr.Type == user.ErrorInvalidArguments {
					c.JSON(BadRequestErrResp(uErr.Error()))
					return
				}
				if uErr.Type == user.ErrorUnauthorized {
					c.JSON(UnauthorizedErrResp(""))
					return
				}
			}
			c.JSON(ServerErrResp(""))
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

		if err := us.Delete(c.Request.Context(), claims, userData.Password, userId); err != nil {
			log.Println("error handling delete user", err)
			var uErr *user.Error
			if errors.As(err, &uErr) {
				if uErr.Type == user.ErrorIncorrectPassword {
					c.JSON(ForbiddenErrResp("incorrect password"))
					return
				}
				if uErr.Type == user.ErrorUnauthorized {
					c.JSON(UnauthorizedErrResp(""))
					return
				}
			}
			c.JSON(ServerErrResp(""))
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

		err := us.SendResetPassword(c.Request.Context(), userData.Username)

		if err != nil {
			log.Println("error handling send reset password", err)
			var uErr *user.Error
			if errors.As(err, &uErr) {
				if uErr.Type == user.ErrorInvalidArguments {
					c.JSON(BadRequestErrResp(uErr.Error()))
					return
				}
				if uErr.Type == user.ErrorNotFound {
					c.JSON(NotFoundErrResp(""))
					return
				}
			}
			c.JSON(ServerErrResp(""))
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

		if err := us.ResetPassword(c.Request.Context(), userData.Token, userData.Password); err != nil {
			log.Println("error handling reset password", err)
			var uErr *user.Error
			if errors.As(err, &uErr) {
				if uErr.Type == user.ErrorTokenExpired || uErr.Type == user.ErrorInvalidToken {
					c.JSON(ForbiddenErrResp(""))
					return
				}
				if uErr.Type == user.ErrorInvalidArguments {
					c.JSON(BadRequestErrResp(uErr.Error()))
					return
				}
			}
			c.JSON(ServerErrResp(""))
			return
		}
		c.JSON(OkResp(""))
	}

}
