package gin

import (
	"net/http"
)

func ServerErrResp(details string) (int, *map[string]any) {
	return http.StatusInternalServerError, &map[string]any{"message": "internal server error", "details": details}
}

func UnauthorizedErrResp(details string) (int, *map[string]any) {
	return http.StatusUnauthorized, &map[string]any{"message": "unauthorized", "details": details}
}

func ForbiddenErrResp(details string) (int, *map[string]any) {
	return http.StatusForbidden, &map[string]any{"message": "forbidden", "details": details}
}

func NotFoundErrResp(details string) (int, *map[string]any) {
	return http.StatusNotFound, &map[string]any{"message": "not found", "details": details}
}

func ConflictErrResp(details string) (int, *map[string]any) {
	return http.StatusConflict, &map[string]any{"message": "bad request", "details": details}
}

func BadRequestErrResp(details string) (int, *map[string]any) {
	return http.StatusBadRequest, &map[string]any{"message": "bad request", "details": details}
}

func OkResp[M map[string]any | []map[string]any | string](data M) (int, *map[string]any) {
	return http.StatusOK, &map[string]any{"data": data}
}
