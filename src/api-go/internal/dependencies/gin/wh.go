package gin

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
	"golang.org/x/exp/slices"
	"log"
	"log/slog"
)

func RegisterWhRoutes(router *gin.Engine, ws warhammer.WhService, js auth.JwtService, logger *slog.Logger) {
	for _, v := range warhammer.WhCoreTypes {
		router.POST(fmt.Sprintf("api/wh/%s", v), RequireJwt(js, logger), whCreateOrUpdateHandler(true, ws, v))
		router.GET(fmt.Sprintf("api/wh/%s/:whId", v), RequireJwt(js, logger), whGetHandler(ws, v))
		router.PUT(fmt.Sprintf("api/wh/%s/:whId", v), RequireJwt(js, logger), whCreateOrUpdateHandler(false, ws, v))
		router.DELETE(fmt.Sprintf("api/wh/%s/:whId", v), RequireJwt(js, logger), whDeleteHandler(ws, v))
		router.GET(fmt.Sprintf("api/wh/%s", v), RequireJwt(js, logger), whListHandler(ws, v))
	}

	router.GET("api/wh/generation", whGenerationPropsHandler(ws))
}

func whCreateOrUpdateHandler(isCreate bool, s warhammer.WhService, t warhammer.WhType) func(*gin.Context) {
	return func(c *gin.Context) {
		claims := getUserClaims(c)
		if invalid(claims) {
			c.JSON(UnauthorizedErrResp(""))
			return
		}

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

		var whRead *warhammer.Wh
		if isCreate {
			whRead, err = s.Create(c.Request.Context(), t, &whWrite, claims)
		} else {
			whWrite.Id = c.Param("whId")
			whRead, err = s.Update(c.Request.Context(), t, &whWrite, claims)
		}

		if err != nil {
			log.Println("error handling create or update wh", err)
			var whErr *warhammer.WhError
			if errors.As(err, &whErr) {
				if whErr.ErrType == warhammer.ErrorInvalidArguments {
					c.JSON(BadRequestErrResp(whErr.Error()))
					return
				}
				if whErr.ErrType == warhammer.ErrorUnauthorized {
					c.JSON(UnauthorizedErrResp(""))
					return
				}
				if whErr.ErrType == warhammer.ErrorNotFound {
					c.JSON(NotFoundErrResp(""))
					return
				}
			}
			c.JSON(ServerErrResp(""))
			return
		}

		returnData, err := whRead.ToMap()
		if err != nil {
			log.Println("error handling create or update wh", err)
			c.JSON(ServerErrResp(""))
			return
		}

		c.JSON(OkResp(returnData))
	}
}

func invalid(claims *auth.Claims) bool {
	return claims.Id == "invalid"
}

func whGetHandler(s warhammer.WhService, t warhammer.WhType) func(*gin.Context) {
	return func(c *gin.Context) {
		whId := c.Param("whId")
		claims := getUserClaims(c)
		if invalid(claims) {
			c.JSON(UnauthorizedErrResp(""))
			return
		}

		var full bool
		if slices.Contains([]string{"true", "yes"}, c.Query("full")) {
			full = true
		}

		wh, err := s.Get(c.Request.Context(), t, claims, full, true, []string{whId})

		if err != nil {
			log.Println("error handling get wh", err)
			var whErr *warhammer.WhError
			if errors.As(err, &whErr) && whErr.ErrType == warhammer.ErrorNotFound {
				c.JSON(NotFoundErrResp(""))
			} else {
				c.JSON(ServerErrResp(""))
			}
			return
		}

		returnData, err := wh[0].ToMap()
		if err != nil {
			log.Println("error handling get wh", err)
			c.JSON(ServerErrResp(""))
			return
		}

		c.JSON(OkResp(returnData))
	}
}

func whListToListMap(whs []*warhammer.Wh) ([]map[string]any, error) {
	list := make([]map[string]any, len(whs))

	var err error
	for i, v := range whs {
		list[i], err = v.ToMap()
		if err != nil {
			return nil, err
		}
	}

	return list, nil
}

func whDeleteHandler(s warhammer.WhService, t warhammer.WhType) func(*gin.Context) {
	return func(c *gin.Context) {
		whId := c.Param("whId")
		claims := getUserClaims(c)
		if invalid(claims) {
			c.JSON(UnauthorizedErrResp(""))
			return
		}

		err := s.Delete(c.Request.Context(), t, whId, claims)

		if err != nil {
			log.Println("error handling delete wh", err)
			var whErr *warhammer.WhError
			if errors.As(err, &whErr) && whErr.ErrType == warhammer.ErrorUnauthorized {
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
		if invalid(claims) {
			c.JSON(UnauthorizedErrResp(""))
			return
		}

		var full bool
		if slices.Contains([]string{"true", "yes"}, c.Query("full")) {
			full = true
		}

		whs, err := s.Get(c.Request.Context(), t, claims, full, true, ids)

		if err != nil {
			log.Println("error handling list wh", err)
			var whErr *warhammer.WhError
			if errors.As(err, &whErr) && whErr.ErrType == warhammer.ErrorNotFound {
				c.JSON(NotFoundErrResp(""))
			} else {
				c.JSON(ServerErrResp(""))
			}
			return
		}

		returnData, err := whListToListMap(whs)
		if err != nil {
			log.Println("error handling get wh", err)
			c.JSON(ServerErrResp(""))
			return
		}

		c.JSON(OkResp(returnData))
	}
}

func whGenerationPropsHandler(s warhammer.WhService) func(*gin.Context) {
	return func(c *gin.Context) {
		generationPropsMap, err := s.GetGenerationProps(c.Request.Context())

		if err != nil {
			log.Println("error handling generation props", err)
			var whErr *warhammer.WhError
			if errors.As(err, &whErr) && whErr.ErrType == warhammer.ErrorNotFound {
				c.JSON(NotFoundErrResp(""))
			} else {
				c.JSON(ServerErrResp(""))
			}
			return
		}

		returnData, err := generationPropsMap.ToMap()
		if err != nil {
			log.Println("error handling generation props", err)
			c.JSON(ServerErrResp(""))
			return
		}

		c.JSON(OkResp(returnData))
	}
}
