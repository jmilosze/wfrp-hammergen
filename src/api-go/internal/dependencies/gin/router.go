package gin

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/vearne/gin-timeout"
	"net/http"
	"time"
)

func NewRouter(requestTimeout time.Duration, maintenance bool) *gin.Engine {
	router := gin.New()

	router.Use(gin.Recovery())

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	corsConfig.AllowHeaders = append(corsConfig.AllowHeaders, "Authorization")
	router.Use(cors.New(corsConfig))

	router.Use(MaintenanceMode(maintenance))

	// Before the timeout middleware, which writes the buffered response into the gzip writer.
	router.Use(gzip.Gzip(gzip.DefaultCompression, gzip.WithMinLength(1024)))

	router.Use(timeout.Timeout(
		timeout.WithTimeout(requestTimeout),
		timeout.WithErrorHttpCode(http.StatusServiceUnavailable),
		timeout.WithDefaultMsg(`{"message":"internal server timeout", "details": ""}`),
	))

	return router
}
