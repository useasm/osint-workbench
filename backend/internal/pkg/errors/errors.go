package errors

import (
	"fmt"
	"net/http"
)

type AppError struct {
	Code       string
	Message    string
	StatusCode int
	Err        error
	Details    map[string]interface{}
}

func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.Err)
	}
	return e.Message
}

func NewAppError(code, message string, statusCode int, err error) *AppError {
	return &AppError{
		Code:       code,
		Message:    message,
		StatusCode: statusCode,
		Err:        err,
		Details:    make(map[string]interface{}),
	}
}

func (e *AppError) WithDetails(details map[string]interface{}) *AppError {
	e.Details = details
	return e
}

var (
	ErrInvalidRequest = NewAppError("INVALID_REQUEST", "Invalid request", http.StatusBadRequest, nil)
	ErrValidationFailed = NewAppError("VALIDATION_FAILED", "Validation failed", http.StatusBadRequest, nil)
	ErrMissingField = NewAppError("MISSING_FIELD", "Missing required field", http.StatusBadRequest, nil)

	ErrUnauthorized = NewAppError("UNAUTHORIZED", "Unauthorized", http.StatusUnauthorized, nil)
	ErrInvalidToken = NewAppError("INVALID_TOKEN", "Invalid token", http.StatusUnauthorized, nil)
	ErrExpiredToken = NewAppError("EXPIRED_TOKEN", "Token expired", http.StatusUnauthorized, nil)

	ErrForbidden = NewAppError("FORBIDDEN", "Forbidden", http.StatusForbidden, nil)
	ErrInsufficientPermissions = NewAppError("INSUFFICIENT_PERMISSIONS", "Insufficient permissions", http.StatusForbidden, nil)

	ErrNotFound = NewAppError("NOT_FOUND", "Not found", http.StatusNotFound, nil)
	ErrCaseNotFound = NewAppError("CASE_NOT_FOUND", "Case not found", http.StatusNotFound, nil)
	ErrEntityNotFound = NewAppError("ENTITY_NOT_FOUND", "Entity not found", http.StatusNotFound, nil)
	ErrUserNotFound = NewAppError("USER_NOT_FOUND", "User not found", http.StatusNotFound, nil)

	ErrConflict = NewAppError("CONFLICT", "Conflict", http.StatusConflict, nil)
	ErrUserAlreadyExists = NewAppError("USER_ALREADY_EXISTS", "User already exists", http.StatusConflict, nil)
	ErrCaseAlreadyExists = NewAppError("CASE_ALREADY_EXISTS", "Case already exists", http.StatusConflict, nil)

	ErrRateLimitExceeded = NewAppError("RATE_LIMIT_EXCEEDED", "Rate limit exceeded", http.StatusTooManyRequests, nil)

	ErrInternalServerError = NewAppError("INTERNAL_SERVER_ERROR", "Internal server error", http.StatusInternalServerError, nil)
	ErrDatabaseError = NewAppError("DATABASE_ERROR", "Database error", http.StatusInternalServerError, nil)
	ErrExternalAPIError = NewAppError("EXTERNAL_API_ERROR", "External API error", http.StatusInternalServerError, nil)
)

func IsAppError(err error) bool {
	_, ok := err.(*AppError)
	return ok
}

func AsAppError(err error) *AppError {
	if appErr, ok := err.(*AppError); ok {
		return appErr
	}
	return ErrInternalServerError.WithDetails(map[string]interface{}{
		"error": err.Error(),
	})
}
