package gin

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/vearne/gin-timeout"
	"net/http"
	"time"
)

func NewRouter(requestTimeout time.Duration) *gin.Engine {
	router := gin.New()

	router.Use(gin.Recovery())

	router.Use(timeout.Timeout(
		timeout.WithTimeout(requestTimeout),
		timeout.WithErrorHttpCode(http.StatusServiceUnavailable),
		timeout.WithDefaultMsg(`{"message":"internal server timeout", "details": ""}`),
	))

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowHeaders = append(corsConfig.AllowHeaders, "Authorization")
	router.Use(cors.New(corsConfig))

	return router
}
