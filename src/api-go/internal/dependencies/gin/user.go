package gin

import (
	"errors"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/user"
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

		userRead, err := us.Create(c.Request.Context(), &u)
		if err != nil {
			log.Println("error handling create user", err)
			if errors.Is(err, domain.ErrConflict) {
				c.JSON(ConflictErrResp("user with this id or username already exists"))
				return
			}
			if errors.Is(err, domain.ErrInvalidArguments) {
				c.JSON(BadRequestErrResp(err.Error()))
				return
			}
			c.JSON(ServerErrResp(""))
			return
		}

		c.JSON(OkResp(newUserResponse(userRead)))
	}
}

type UserResponse struct {
	Id             string    `json:"id"`
	Username       string    `json:"username"`
	SharedAccounts []string  `json:"sharedAccounts"`
	Admin          bool      `json:"admin"`
	CreatedOn      time.Time `json:"createdOn"`
	LastAuthOn     time.Time `json:"lastAuthOn"`
}

func newUserResponse(u *user.User) UserResponse {
	return UserResponse{
		Id:             u.Id,
		Username:       u.Username,
		SharedAccounts: u.SharedAccountNames,
		Admin:          u.Admin,
		CreatedOn:      u.CreatedOn,
		LastAuthOn:     u.LastAuthOn,
	}
}

func newUsersResponse(users []*user.User) []UserResponse {
	list := make([]UserResponse, len(users))
	for i, v := range users {
		list[i] = newUserResponse(v)
	}
	return list
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
			if errors.Is(err, domain.ErrNotFound) {
				c.JSON(NotFoundErrResp(""))
				return
			}
			if errors.Is(err, domain.ErrUnauthorized) {
				c.JSON(UnauthorizedErrResp(""))
				return
			}
			c.JSON(ServerErrResp(""))
			return
		}

		c.JSON(OkResp(newUserResponse(u)))
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
			if errors.Is(err, domain.ErrUnauthorized) {
				c.JSON(UnauthorizedErrResp(""))
				return
			}
			c.JSON(ServerErrResp(""))
			return
		}

		c.JSON(OkResp(newUsersResponse(allUsers)))
	}
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
			if errors.Is(err, domain.ErrNotFound) {
				c.JSON(NotFoundErrResp(""))
				return
			}
			if errors.Is(err, domain.ErrInvalidArguments) {
				c.JSON(BadRequestErrResp(err.Error()))
				return
			}
			if errors.Is(err, domain.ErrUnauthorized) {
				c.JSON(UnauthorizedErrResp(""))
				return
			}
			c.JSON(ServerErrResp(""))
			return
		}

		c.JSON(OkResp(newUserResponse(userRead)))
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
			if errors.Is(err, domain.ErrConflict) {
				c.JSON(ConflictErrResp("user with this username already exists"))
				return
			}
			if errors.Is(err, domain.ErrNotFound) {
				c.JSON(NotFoundErrResp(""))
				return
			}
			if errors.Is(err, domain.ErrInvalidArguments) {
				c.JSON(BadRequestErrResp(err.Error()))
				return
			}
			if errors.Is(err, domain.ErrIncorrectPassword) {
				c.JSON(ForbiddenErrResp("incorrect password"))
				return
			}
			if errors.Is(err, domain.ErrUnauthorized) {
				c.JSON(UnauthorizedErrResp(""))
				return
			}
			c.JSON(ServerErrResp(""))
			return
		}

		c.JSON(OkResp(newUserResponse(userRead)))
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
			if errors.Is(err, domain.ErrNotFound) {
				c.JSON(NotFoundErrResp(""))
				return
			}
			if errors.Is(err, domain.ErrInvalidArguments) {
				c.JSON(BadRequestErrResp(err.Error()))
				return
			}
			if errors.Is(err, domain.ErrUnauthorized) {
				c.JSON(UnauthorizedErrResp(""))
				return
			}
			c.JSON(ServerErrResp(""))
			return
		}

		c.JSON(OkResp(newUserResponse(userRead)))
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
			if errors.Is(err, domain.ErrIncorrectPassword) {
				c.JSON(ForbiddenErrResp("incorrect password"))
				return
			}
			if errors.Is(err, domain.ErrUnauthorized) {
				c.JSON(UnauthorizedErrResp(""))
				return
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
			if errors.Is(err, domain.ErrInvalidArguments) {
				c.JSON(BadRequestErrResp(err.Error()))
				return
			}
			if errors.Is(err, domain.ErrNotFound) {
				c.JSON(NotFoundErrResp(""))
				return
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
			if errors.Is(err, domain.ErrTokenExpired) || errors.Is(err, domain.ErrInvalidToken) {
				c.JSON(ForbiddenErrResp(""))
				return
			}
			if errors.Is(err, domain.ErrInvalidArguments) {
				c.JSON(BadRequestErrResp(err.Error()))
				return
			}
			c.JSON(ServerErrResp(""))
			return
		}
		c.JSON(OkResp(""))
	}

}
