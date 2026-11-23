package errors

import (
	"fmt"
	"net/http"
)

// AppError is the application error type
type AppError struct {
	Code       string
	Message    string
	StatusCode int
	Err        error
	Details    map[string]interface{}
}

// Error implements error interface
func (e *AppError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.Err)
	}
	return e.Message
}

// NewAppError creates a new app error
func NewAppError(code, message string, statusCode int, err error) *AppError {
	return &AppError{
		Code:       code,
		Message:    message,
		StatusCode: statusCode,
		Err:        err,
		Details:    make(map[string]interface{}),
	}
}

// WithDetails adds details to the error
func (e *AppError) WithDetails(details map[string]interface{}) *AppError {
	e.Details = details
	return e
}

// Common errors
var (
	// 400 Bad Request
	ErrInvalidRequest = NewAppError("INVALID_REQUEST", "Invalid request", http.StatusBadRequest, nil)
	ErrValidationFailed = NewAppError("VALIDATION_FAILED", "Validation failed", http.StatusBadRequest, nil)
	ErrMissingField = NewAppError("MISSING_FIELD", "Missing required field", http.StatusBadRequest, nil)

	// 401 Unauthorized
	ErrUnauthorized = NewAppError("UNAUTHORIZED", "Unauthorized", http.StatusUnauthorized, nil)
	ErrInvalidToken = NewAppError("INVALID_TOKEN", "Invalid token", http.StatusUnauthorized, nil)
	ErrExpiredToken = NewAppError("EXPIRED_TOKEN", "Token expired", http.StatusUnauthorized, nil)

	// 403 Forbidden
	ErrForbidden = NewAppError("FORBIDDEN", "Forbidden", http.StatusForbidden, nil)
	ErrInsufficientPermissions = NewAppError("INSUFFICIENT_PERMISSIONS", "Insufficient permissions", http.StatusForbidden, nil)

	// 404 Not Found
	ErrNotFound = NewAppError("NOT_FOUND", "Not found", http.StatusNotFound, nil)
	ErrCaseNotFound = NewAppError("CASE_NOT_FOUND", "Case not found", http.StatusNotFound, nil)
	ErrEntityNotFound = NewAppError("ENTITY_NOT_FOUND", "Entity not found", http.StatusNotFound, nil)
	ErrUserNotFound = NewAppError("USER_NOT_FOUND", "User not found", http.StatusNotFound, nil)

	// 409 Conflict
	ErrConflict = NewAppError("CONFLICT", "Conflict", http.StatusConflict, nil)
	ErrUserAlreadyExists = NewAppError("USER_ALREADY_EXISTS", "User already exists", http.StatusConflict, nil)
	ErrCaseAlreadyExists = NewAppError("CASE_ALREADY_EXISTS", "Case already exists", http.StatusConflict, nil)

	// 429 Too Many Requests
	ErrRateLimitExceeded = NewAppError("RATE_LIMIT_EXCEEDED", "Rate limit exceeded", http.StatusTooManyRequests, nil)

	// 500 Internal Server Error
	ErrInternalServerError = NewAppError("INTERNAL_SERVER_ERROR", "Internal server error", http.StatusInternalServerError, nil)
	ErrDatabaseError = NewAppError("DATABASE_ERROR", "Database error", http.StatusInternalServerError, nil)
	ErrExternalAPIError = NewAppError("EXTERNAL_API_ERROR", "External API error", http.StatusInternalServerError, nil)
)

// IsAppError checks if an error is an AppError
func IsAppError(err error) bool {
	_, ok := err.(*AppError)
	return ok
}

// AsAppError converts an error to AppError
func AsAppError(err error) *AppError {
	if appErr, ok := err.(*AppError); ok {
		return appErr
	}
	return ErrInternalServerError.WithDetails(map[string]interface{}{
		"error": err.Error(),
	})
}
