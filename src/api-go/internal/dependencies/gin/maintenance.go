package gin

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

const maintenanceMessage = "maintenance"

const statusPath = "/api/status"

type Status struct {
	Maintenance bool `json:"maintenance"`
}

// MaintenanceMode rejects every request except the status endpoint with 503 when enabled.
// It must be registered after the CORS middleware so browsers can read the response.
func MaintenanceMode(enabled bool) gin.HandlerFunc {
	return func(c *gin.Context) {
		if enabled && c.Request.URL.Path != statusPath {
			c.AbortWithStatusJSON(MaintenanceErrResp(""))
			return
		}
		c.Next()
	}
}

func RegisterStatusRoutes(router *gin.Engine, maintenance bool) {
	router.GET(statusPath, statusHandler(maintenance))
}

func statusHandler(maintenance bool) func(*gin.Context) {
	return func(c *gin.Context) {
		c.JSON(OkResp(Status{Maintenance: maintenance}))
	}
}

func MaintenanceErrResp(details string) (int, ErrorResponse) {
	return http.StatusServiceUnavailable, ErrorResponse{Message: maintenanceMessage, Details: details}
}
