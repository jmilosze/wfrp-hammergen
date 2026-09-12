package gin

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
	"golang.org/x/exp/slices"
)

func RegisterWhRoutes(router *gin.Engine, ws warhammer.WhService, js auth.JwtService) {
	for _, v := range warhammer.WhCoreTypes {
		router.POST(fmt.Sprintf("api/wh/%s", v), RequireJwt(js), whCreateOrUpdateHandler(true, ws, v))
		router.GET(fmt.Sprintf("api/wh/%s/:whId", v), RequireJwt(js), whGetHandler(ws, v))
		router.PUT(fmt.Sprintf("api/wh/%s/:whId", v), RequireJwt(js), whCreateOrUpdateHandler(false, ws, v))
		router.DELETE(fmt.Sprintf("api/wh/%s/:whId", v), RequireJwt(js), whDeleteHandler(ws, v))
		router.GET(fmt.Sprintf("api/wh/%s", v), RequireJwt(js), whListHandler(ws, v))
	}

	router.GET("api/wh/generation", whGenerationPropsHandler(ws))
}

func whCreateOrUpdateHandler(isCreate bool, s warhammer.WhService, t warhammer.WhType) func(*gin.Context) {
	return func(c *gin.Context) {
		claims := getUserClaims(c)

		reqData, err := c.GetRawData()
		if err != nil {
			log.Println("error handling create or update wh", err)
			c.JSON(BadRequestErrResp(err.Error()))
			return
		}

		whWrite := warhammer.Wh{}
		whWrite.Object = warhammer.NewWhObject(t)
		if err = json.Unmarshal(reqData, whWrite.Object); err != nil {
			log.Println("error handling create or update wh", err)
			c.JSON(BadRequestErrResp(err.Error()))
			return
		}

		var reqTop struct {
			Visibility *warhammer.Visibility `json:"visibility"`
		}
		if err = json.Unmarshal(reqData, &reqTop); err != nil || reqTop.Visibility == nil {
			c.JSON(BadRequestErrResp("visibility is required"))
			return
		}
		whWrite.Visibility = *reqTop.Visibility

		var whRead *warhammer.Wh
		if isCreate {
			whRead, err = s.Create(c.Request.Context(), t, &whWrite, claims)
		} else {
			whWrite.Id = c.Param("whId")
			whRead, err = s.Update(c.Request.Context(), t, &whWrite, claims)
		}

		if err != nil {
			log.Println("error handling create or update wh", err)
			if errors.Is(err, domain.ErrInvalidArguments) {
				c.JSON(BadRequestErrResp(err.Error()))
				return
			}
			if errors.Is(err, domain.ErrUnauthorized) {
				c.JSON(UnauthorizedErrResp(""))
				return
			}
			if errors.Is(err, domain.ErrNotFound) {
				c.JSON(NotFoundErrResp(""))
				return
			}
			c.JSON(ServerErrResp(""))
			return
		}

		c.JSON(OkResp(whRead))
	}
}

func whGetHandler(s warhammer.WhService, t warhammer.WhType) func(*gin.Context) {
	return func(c *gin.Context) {
		whId := c.Param("whId")
		claims := getUserClaims(c)

		var full bool
		if slices.Contains([]string{"true", "yes"}, c.Query("full")) {
			full = true
		}

		wh, err := s.Get(c.Request.Context(), t, claims, full, true, []string{whId})

		if err != nil {
			log.Println("error handling get wh", err)
			if errors.Is(err, domain.ErrNotFound) {
				c.JSON(NotFoundErrResp(""))
			} else {
				c.JSON(ServerErrResp(""))
			}
			return
		}

		c.JSON(OkResp(wh[0]))
	}
}

func whDeleteHandler(s warhammer.WhService, t warhammer.WhType) func(*gin.Context) {
	return func(c *gin.Context) {
		whId := c.Param("whId")
		claims := getUserClaims(c)

		err := s.Delete(c.Request.Context(), t, whId, claims)

		if err != nil {
			log.Println("error handling delete wh", err)
			if errors.Is(err, domain.ErrUnauthorized) {
				c.JSON(UnauthorizedErrResp(""))
			} else {
				c.JSON(ServerErrResp(""))
			}
			return
		}

		c.JSON(OkResp(""))
	}
}

func whListHandler(s warhammer.WhService, t warhammer.WhType) func(*gin.Context) {
	return func(c *gin.Context) {
		ids, _ := c.GetQueryArray("id")
		claims := getUserClaims(c)

		var full bool
		if slices.Contains([]string{"true", "yes"}, c.Query("full")) {
			full = true
		}

		whs, err := s.Get(c.Request.Context(), t, claims, full, true, ids)

		if err != nil {
			log.Println("error handling list wh", err)
			if errors.Is(err, domain.ErrNotFound) {
				c.JSON(NotFoundErrResp(""))
			} else {
				c.JSON(ServerErrResp(""))
			}
			return
		}

		c.JSON(OkResp(whs))
	}
}

func whGenerationPropsHandler(s warhammer.WhService) func(*gin.Context) {
	return func(c *gin.Context) {
		generationProps, err := s.GetGenerationProps(c.Request.Context())

		if err != nil {
			log.Println("error handling generation props", err)
			if errors.Is(err, domain.ErrNotFound) {
				c.JSON(NotFoundErrResp(""))
			} else {
				c.JSON(ServerErrResp(""))
			}
			return
		}

		c.JSON(OkResp(generationProps))
	}
}
