package gin

import (
	"net/http"
)

type Response[T any] struct {
	Data T `json:"data"`
}

type ErrorResponse struct {
	Message string `json:"message"`
	Details string `json:"details"`
}

func ServerErrResp(details string) (int, ErrorResponse) {
	return http.StatusInternalServerError, ErrorResponse{Message: "internal server error", Details: details}
}

func UnauthorizedErrResp(details string) (int, ErrorResponse) {
	return http.StatusUnauthorized, ErrorResponse{Message: "unauthorized", Details: details}
}

func ForbiddenErrResp(details string) (int, ErrorResponse) {
	return http.StatusForbidden, ErrorResponse{Message: "forbidden", Details: details}
}

func NotFoundErrResp(details string) (int, ErrorResponse) {
	return http.StatusNotFound, ErrorResponse{Message: "not found", Details: details}
}

func ConflictErrResp(details string) (int, ErrorResponse) {
	return http.StatusConflict, ErrorResponse{Message: "bad request", Details: details}
}

func BadRequestErrResp(details string) (int, ErrorResponse) {
	return http.StatusBadRequest, ErrorResponse{Message: "bad request", Details: details}
}

func OkResp[T any](data T) (int, Response[T]) {
	return http.StatusOK, Response[T]{Data: data}
}
