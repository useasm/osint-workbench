package model

import (
	"time"

	"github.com/google/uuid"
)

// User represents a system user
type User struct {
	ID           uuid.UUID `db:"id" json:"id"`
	Email        string    `db:"email" json:"email"`
	Username     string    `db:"username" json:"username"`
	PasswordHash []byte    `db:"password_hash" json:"-"` // Never expose hash
	FirstName    string    `db:"first_name" json:"first_name"`
	LastName     string    `db:"last_name" json:"last_name"`
	AvatarURL    string    `db:"avatar_url" json:"avatar_url,omitempty"`
	Timezone     string    `db:"timezone" json:"timezone"`
	Preferences  map[string]interface{} `db:"preferences" json:"preferences"`
	IsActive     bool      `db:"is_active" json:"is_active"`
	IsVerified   bool      `db:"is_verified" json:"is_verified"`
	LastLogin    *time.Time `db:"last_login" json:"last_login,omitempty"`
	CreatedAt    time.Time `db:"created_at" json:"created_at"`
	UpdatedAt    time.Time `db:"updated_at" json:"updated_at"`
	DeletedAt    *time.Time `db:"deleted_at" json:"-"` // Soft delete
}

// UserCreateRequest is the request body for creating a user
type UserCreateRequest struct {
	Email     string `json:"email" validate:"required,email"`
	Username  string `json:"username" validate:"required,min=3,max=32,alphanum"`
	Password  string `json:"password" validate:"required,min=8"`
	FirstName string `json:"first_name" validate:"omitempty,max=255"`
	LastName  string `json:"last_name" validate:"omitempty,max=255"`
}

// UserUpdateRequest is the request body for updating a user
type UserUpdateRequest struct {
	FirstName string `json:"first_name" validate:"omitempty,max=255"`
	LastName  string `json:"last_name" validate:"omitempty,max=255"`
	AvatarURL string `json:"avatar_url" validate:"omitempty,url"`
	Timezone  string `json:"timezone" validate:"omitempty,max=50"`
}

// UserResponse is the response body for a user
type UserResponse struct {
	ID         uuid.UUID              `json:"id"`
	Email      string                 `json:"email"`
	Username   string                 `json:"username"`
	FirstName  string                 `json:"first_name"`
	LastName   string                 `json:"last_name"`
	AvatarURL  string                 `json:"avatar_url"`
	Timezone   string                 `json:"timezone"`
	IsActive   bool                   `json:"is_active"`
	IsVerified bool                   `json:"is_verified"`
	Roles      []string               `json:"roles"`
	CreatedAt  time.Time              `json:"created_at"`
}

// Role represents a user role
type Role struct {
	ID          uuid.UUID `db:"id" json:"id"`
	Name        string    `db:"name" json:"name"`
	Description string    `db:"description" json:"description"`
	Permissions []string  `db:"permissions" json:"permissions"`
	IsSystem    bool      `db:"is_system" json:"is_system"`
	CreatedAt   time.Time `db:"created_at" json:"created_at"`
}

// Session represents a user session
type Session struct {
	ID               uuid.UUID `db:"id" json:"id"`
	UserID           uuid.UUID `db:"user_id" json:"user_id"`
	IPAddress        string    `db:"ip_address" json:"ip_address"`
	UserAgent        string    `db:"user_agent" json:"user_agent"`
	AccessTokenHash  string    `db:"access_token_hash" json:"-"`
	RefreshTokenHash string    `db:"refresh_token_hash" json:"-"`
	ExpiresAt        time.Time `db:"expires_at" json:"expires_at"`
	CreatedAt        time.Time `db:"created_at" json:"created_at"`
	LastActivity     time.Time `db:"last_activity" json:"last_activity"`
}

// APIKey represents an API key for programmatic access
type APIKey struct {
	ID         uuid.UUID `db:"id" json:"id"`
	UserID     uuid.UUID `db:"user_id" json:"user_id"`
	KeyHash    string    `db:"key_hash" json:"-"` // Never expose
	Name       string    `db:"name" json:"name"`
	Scopes     []string  `db:"scopes" json:"scopes"`
	RateLimit  int       `db:"rate_limit" json:"rate_limit"`
	LastUsedAt *time.Time `db:"last_used_at" json:"last_used_at,omitempty"`
	CreatedAt  time.Time `db:"created_at" json:"created_at"`
	ExpiresAt  *time.Time `db:"expires_at" json:"expires_at,omitempty"`
	IsActive   bool      `db:"is_active" json:"is_active"`
}

// AuditLog represents an audit log entry
type AuditLog struct {
	ID            uuid.UUID              `db:"id" json:"id"`
	UserID        *uuid.UUID             `db:"user_id" json:"user_id"`
	Action        string                 `db:"action" json:"action"`
	ResourceType  string                 `db:"resource_type" json:"resource_type"`
	ResourceID    *uuid.UUID             `db:"resource_id" json:"resource_id"`
	Changes       map[string]interface{} `db:"changes" json:"changes"`
	IPAddress     string                 `db:"ip_address" json:"ip_address"`
	UserAgent     string                 `db:"user_agent" json:"user_agent"`
	Status        string                 `db:"status" json:"status"`
	ErrorMessage  string                 `db:"error_message" json:"error_message"`
	CreatedAt     time.Time              `db:"created_at" json:"created_at"`
}
