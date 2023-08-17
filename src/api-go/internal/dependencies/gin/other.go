package gin

import (
	"github.com/gin-gonic/gin"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
)

func RegisterOtherRoutes(router *gin.Engine, js auth.JwtService) {
	router.GET("api/keepwarm", RequireJwt(js), keepwarmHandler())
}

func keepwarmHandler() func(*gin.Context) {
	return func(c *gin.Context) {
		claims := getUserClaims(c)
		if invalid(claims) {
			c.JSON(UnauthorizedErrResp(""))
			return
		}
		c.JSON(OkResp(""))
	}
}
