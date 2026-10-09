package gin

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"slices"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/auth"
	"github.com/jmilosze/wfrp-hammergen-go/internal/domain/warhammer"
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

var errInvalidEdition = fmt.Errorf("edition must be one of %v", warhammer.Editions)

// parseOptionalEdition returns the edition query parameter, or an empty edition when it is absent.
func parseOptionalEdition(c *gin.Context) (warhammer.Edition, bool) {
	e := warhammer.Edition(c.Query("edition"))
	if e != "" && !slices.Contains(warhammer.Editions, e) {
		c.JSON(BadRequestErrResp(errInvalidEdition.Error()))
		return "", false
	}
	return e, true
}

// parseWhWrite decodes a create/update body: {visibility, editions: {<edition>: {...}}} for content,
// {visibility, ...character fields} for characters.
func parseWhWrite(t warhammer.WhType, reqData []byte) (*warhammer.Wh, error) {
	var reqTop struct {
		Visibility *warhammer.Visibility                 `json:"visibility"`
		Editions   map[warhammer.Edition]json.RawMessage `json:"editions"`
	}
	if err := json.Unmarshal(reqData, &reqTop); err != nil {
		return nil, err
	}
	if reqTop.Visibility == nil {
		return nil, errors.New("visibility is required")
	}
	whWrite := warhammer.Wh{Visibility: *reqTop.Visibility}

	if !warhammer.HasEditions(t) {
		whWrite.Object = warhammer.NewWhObject(t)
		if err := json.Unmarshal(reqData, whWrite.Object); err != nil {
			return nil, err
		}
		return &whWrite, nil
	}

	if len(reqTop.Editions) == 0 {
		return nil, errors.New("at least one edition is required")
	}
	whWrite.Editions = make(map[warhammer.Edition]warhammer.WhObject, len(reqTop.Editions))
	for e, raw := range reqTop.Editions {
		if !slices.Contains(warhammer.Editions, e) {
			return nil, errInvalidEdition
		}
		obj := warhammer.NewWhObject(t)
		if err := json.Unmarshal(raw, obj); err != nil {
			return nil, err
		}
		whWrite.Editions[e] = obj
	}
	return &whWrite, nil
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

		whWrite, err := parseWhWrite(t, reqData)
		if err != nil {
			log.Println("error handling create or update wh", err)
			c.JSON(BadRequestErrResp(err.Error()))
			return
		}

		var whRead *warhammer.Wh
		if isCreate {
			whRead, err = s.Create(c.Request.Context(), t, whWrite, claims)
		} else {
			whWrite.Id = c.Param("whId")
			whRead, err = s.Update(c.Request.Context(), t, whWrite, claims)
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
		edition, ok := parseOptionalEdition(c)
		if !ok {
			return
		}

		var full bool
		if slices.Contains([]string{"true", "yes"}, c.Query("full")) {
			full = true
		}

		wh, err := s.Get(c.Request.Context(), t, claims, full, true, warhammer.WhFilter{Edition: edition, WhIds: []string{whId}})

		if err != nil {
			log.Println("error handling get wh", err)
			if errors.Is(err, domain.ErrInvalidArguments) {
				c.JSON(BadRequestErrResp(err.Error()))
			} else if errors.Is(err, domain.ErrNotFound) {
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
		edition, ok := parseOptionalEdition(c)
		if !ok {
			return
		}

		err := s.Delete(c.Request.Context(), t, edition, whId, claims)

		if err != nil {
			log.Println("error handling delete wh", err)
			if errors.Is(err, domain.ErrInvalidArguments) {
				c.JSON(BadRequestErrResp(err.Error()))
			} else if errors.Is(err, domain.ErrUnauthorized) {
				c.JSON(UnauthorizedErrResp(""))
			} else {
				c.JSON(ServerErrResp(""))
			}
			return
		}

		c.JSON(OkResp(""))
	}
}

func parseQueryList(c *gin.Context, key string) []string {
	values, _ := c.GetQueryArray(key)
	valuesBracket, _ := c.GetQueryArray(key + "[]")
	all := append(values, valuesBracket...)
	var result []string
	for _, v := range all {
		for _, part := range strings.Split(v, ",") {
			trimmed := strings.TrimSpace(part)
			if trimmed != "" {
				result = append(result, trimmed)
			}
		}
	}
	return result
}

func whListHandler(s warhammer.WhService, t warhammer.WhType) func(*gin.Context) {
	return func(c *gin.Context) {
		ids := parseQueryList(c, "id")
		claims := getUserClaims(c)
		edition, ok := parseOptionalEdition(c)
		if !ok {
			return
		}

		var full bool
		if slices.Contains([]string{"true", "yes"}, c.Query("full")) {
			full = true
		}

		filter := warhammer.WhFilter{Edition: edition, WhIds: ids}
		if t == warhammer.WhTypeCareer {
			filter.SkillIds = parseQueryList(c, "skillId")
			filter.TalentIds = parseQueryList(c, "talentId")
		}

		whs, err := s.Get(c.Request.Context(), t, claims, full, true, filter)

		if err != nil {
			log.Println("error handling list wh", err)
			if errors.Is(err, domain.ErrInvalidArguments) {
				c.JSON(BadRequestErrResp(err.Error()))
			} else if errors.Is(err, domain.ErrNotFound) {
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
		// Without ?edition the 4e generation props are returned, as before.
		e, ok := parseOptionalEdition(c)
		if !ok {
			return
		}
		if e == "" {
			e = warhammer.Edition4e
		}
		generationProps, err := s.GetGenerationProps(c.Request.Context(), e)

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
