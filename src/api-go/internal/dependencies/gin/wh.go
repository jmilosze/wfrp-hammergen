package gin

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
	"golang.org/x/exp/slices"
	"log"
)

func RegisterWhRoutes(router *gin.Engine, ms warhammer.WhService, js auth.JwtService) {
	for _, v := range warhammer.WhCoreTypes {
		router.POST(fmt.Sprintf("api/wh/%s", v), RequireJwt(js), whCreateOrUpdateHandler(true, ms, v))
		router.GET(fmt.Sprintf("api/wh/%s/:whId", v), RequireJwt(js), whGetHandler(ms, v))
		router.PUT(fmt.Sprintf("api/wh/%s/:whId", v), RequireJwt(js), whCreateOrUpdateHandler(false, ms, v))
		router.DELETE(fmt.Sprintf("api/wh/%s/:whId", v), RequireJwt(js), whDeleteHandler(ms, v))
		router.GET(fmt.Sprintf("api/wh/%s", v), RequireJwt(js), whListHandler(ms, v))
	}

	router.GET("api/wh/generation", whGenerationPropsHandler(ms))
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
		var whErr *warhammer.WhError
		if isCreate {
			whRead, whErr = s.Create(c.Request.Context(), t, &whWrite, claims)
		} else {
			whWrite.Id = c.Param("whId")
			whRead, whErr = s.Update(c.Request.Context(), t, &whWrite, claims)
		}

		if whErr != nil {
			log.Println("error handling create or update wh", whErr)
			switch whErr.ErrType {
			case warhammer.ErrorInvalidArguments:
				c.JSON(BadRequestErrResp(whErr.Error()))
			case warhammer.ErrorUnauthorized:
				c.JSON(UnauthorizedErrResp(""))
			case warhammer.ErrorNotFound:
				c.JSON(NotFoundErrResp(""))
			default:
				c.JSON(ServerErrResp(""))
			}
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

		wh, whErr := s.Get(c.Request.Context(), t, claims, full, true, []string{whId})

		if whErr != nil {
			log.Println("error handling get wh", whErr)
			switch whErr.ErrType {
			case warhammer.ErrorNotFound:
				c.JSON(NotFoundErrResp(""))
			default:
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

		whErr := s.Delete(c.Request.Context(), t, whId, claims)

		if whErr != nil {
			log.Println("error handling delete wh", whErr)
			switch whErr.ErrType {
			case warhammer.ErrorUnauthorized:
				c.JSON(UnauthorizedErrResp(""))
			default:
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

		whs, whErr := s.Get(c.Request.Context(), t, claims, full, true, ids)

		if whErr != nil {
			log.Println("error handling list wh", whErr)
			switch whErr.ErrType {
			case warhammer.ErrorNotFound:
				c.JSON(NotFoundErrResp(""))
			default:
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
		generationPropsMap, whErr := s.GetGenerationProps(c.Request.Context())

		if whErr != nil {
			log.Println("error handling generation props", whErr)
			switch whErr.ErrType {
			case warhammer.ErrorNotFound:
				c.JSON(NotFoundErrResp(""))
			default:
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
