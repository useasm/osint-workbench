package model

import (
	"time"

	"github.com/google/uuid"
)

type Case struct {
	ID             uuid.UUID `db:"id" json:"id"`
	UserID         uuid.UUID `db:"user_id" json:"user_id"`
	Name           string    `db:"name" json:"name"`
	Description    string    `db:"description" json:"description"`
	Status         string    `db:"status" json:"status"` // active, closed, archived
	Severity       string    `db:"severity" json:"severity"` // critical, high, medium, low
	Classification string    `db:"classification" json:"classification"` // public, internal, confidential, secret
	CreatedAt      time.Time `db:"created_at" json:"created_at"`
	UpdatedAt      time.Time `db:"updated_at" json:"updated_at"`
	ClosedAt       *time.Time `db:"closed_at" json:"closed_at,omitempty"`
	DeletedAt      *time.Time `db:"deleted_at" json:"-"` // soft delete
}

type CaseCreateRequest struct {
	Name           string `json:"name" validate:"required,min=3,max=255"`
	Description    string `json:"description" validate:"omitempty,max=2000"`
	Severity       string `json:"severity" validate:"omitempty,oneof=critical high medium low"`
	Classification string `json:"classification" validate:"omitempty,oneof=public internal confidential secret"`
}

type CaseUpdateRequest struct {
	Name           string `json:"name" validate:"omitempty,min=3,max=255"`
	Description    string `json:"description" validate:"omitempty,max=2000"`
	Status         string `json:"status" validate:"omitempty,oneof=active closed archived"`
	Severity       string `json:"severity" validate:"omitempty,oneof=critical high medium low"`
	Classification string `json:"classification" validate:"omitempty,oneof=public internal confidential secret"`
}

type CaseResponse struct {
	ID             uuid.UUID `json:"id"`
	Name           string    `json:"name"`
	Description    string    `json:"description"`
	Status         string    `json:"status"`
	Severity       string    `json:"severity"`
	Classification string    `json:"classification"`
	Owner          string    `json:"owner"` // username of creator
	Members        int       `json:"members"` // count of case members
	Entities       int       `json:"entities"` // count of entities
	Findings       int       `json:"findings"` // count of findings
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
	ClosedAt       *time.Time `json:"closed_at,omitempty"`
}

type CaseMember struct {
	CaseID  uuid.UUID `db:"case_id" json:"case_id"`
	UserID  uuid.UUID `db:"user_id" json:"user_id"`
	Role    string    `db:"role" json:"role"` // owner, analyst, viewer
	AddedAt time.Time `db:"added_at" json:"added_at"`
	AddedBy *uuid.UUID `db:"added_by" json:"added_by,omitempty"`
}

type CaseMemberResponse struct {
	UserID    uuid.UUID `json:"user_id"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	Role      string    `json:"role"`
	AddedAt   time.Time `json:"added_at"`
	AvatarURL string    `json:"avatar_url"`
}

type Entity struct {
	ID          uuid.UUID              `db:"id" json:"id"`
	CaseID      uuid.UUID              `db:"case_id" json:"case_id"`
	Type        string                 `db:"type" json:"type"` // person, company, domain, ip, email, phone, username
	Name        string                 `db:"name" json:"name"`
	Description string                 `db:"description" json:"description"`
	Tags        []string               `db:"tags" json:"tags"`
	Attributes  map[string]interface{} `db:"attributes" json:"attributes"`
	Confidence  float64                `db:"confidence" json:"confidence"` // 0.0-1.0
	Source      string                 `db:"source" json:"source"` // where discovered
	IsPrimary   bool                   `db:"is_primary" json:"is_primary"`
	CreatedAt   time.Time              `db:"created_at" json:"created_at"`
	UpdatedAt   time.Time              `db:"updated_at" json:"updated_at"`
}

type EntityCreateRequest struct {
	Type        string                 `json:"type" validate:"required,oneof=person company domain ip email phone username social_account"`
	Name        string                 `json:"name" validate:"required,min=1,max=255"`
	Description string                 `json:"description" validate:"omitempty,max=2000"`
	Tags        []string               `json:"tags" validate:"omitempty"`
	Attributes  map[string]interface{} `json:"attributes" validate:"omitempty"`
	Confidence  float64                `json:"confidence" validate:"omitempty,gte=0,lte=1"`
	Source      string                 `json:"source" validate:"omitempty,max=255"`
	IsPrimary   bool                   `json:"is_primary"`
}

type EntityUpdateRequest struct {
	Name        string                 `json:"name" validate:"omitempty,min=1,max=255"`
	Description string                 `json:"description" validate:"omitempty,max=2000"`
	Tags        []string               `json:"tags" validate:"omitempty"`
	Attributes  map[string]interface{} `json:"attributes" validate:"omitempty"`
	Confidence  float64                `json:"confidence" validate:"omitempty,gte=0,lte=1"`
	IsPrimary   bool                   `json:"is_primary"`
}

type EntityAlias struct {
	ID        uuid.UUID `db:"id" json:"id"`
	EntityID  uuid.UUID `db:"entity_id" json:"entity_id"`
	AliasName string    `db:"alias_name" json:"alias_name"`
	AliasType string    `db:"alias_type" json:"alias_type"` // alternate_name, username, email, phone
	Source    string    `db:"source" json:"source"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}

type Relation struct {
	ID             uuid.UUID `db:"id" json:"id"`
	CaseID         uuid.UUID `db:"case_id" json:"case_id"`
	SourceEntityID uuid.UUID `db:"source_entity_id" json:"source_entity_id"`
	TargetEntityID uuid.UUID `db:"target_entity_id" json:"target_entity_id"`
	RelationType   string    `db:"relation_type" json:"relation_type"` // knows, works_at, owns_domain, etc
	Strength       float64   `db:"strength" json:"strength"`           // 0.0-1.0
	Evidence       string    `db:"evidence" json:"evidence"`
	CreatedAt      time.Time `db:"created_at" json:"created_at"`
}

type RelationCreateRequest struct {
	SourceEntityID uuid.UUID `json:"source_entity_id" validate:"required"`
	TargetEntityID uuid.UUID `json:"target_entity_id" validate:"required"`
	RelationType   string    `json:"relation_type" validate:"required,min=1,max=50"`
	Strength       float64   `json:"strength" validate:"omitempty,gte=0,lte=1"`
	Evidence       string    `json:"evidence" validate:"omitempty,max=2000"`
}

type Finding struct {
	ID          uuid.UUID              `db:"id" json:"id"`
	ToolRunID   *uuid.UUID             `db:"tool_run_id" json:"tool_run_id,omitempty"`
	CaseID      uuid.UUID              `db:"case_id" json:"case_id"`
	Type        string                 `db:"type" json:"type"` // breach, weak_password, exposed_api, etc
	Title       string                 `db:"title" json:"title"`
	Description string                 `db:"description" json:"description"`
	Severity    string                 `db:"severity" json:"severity"` // critical, high, medium, low, info
	Status      string                 `db:"status" json:"status"` // open, investigating, resolved, false_positive
	Evidence    map[string]interface{} `db:"evidence" json:"evidence"`
	Recommendation string               `db:"recommendation" json:"recommendation"`
	Tags        []string               `db:"tags" json:"tags"`
	AssignedTo  *uuid.UUID             `db:"assigned_to" json:"assigned_to,omitempty"`
	CreatedAt   time.Time              `db:"created_at" json:"created_at"`
	ResolvedAt  *time.Time             `db:"resolved_at" json:"resolved_at,omitempty"`
}

type FindingCreateRequest struct {
	Type           string                 `json:"type" validate:"required,min=1,max=50"`
	Title          string                 `json:"title" validate:"required,min=3,max=255"`
	Description    string                 `json:"description" validate:"required,max=2000"`
	Severity       string                 `json:"severity" validate:"required,oneof=critical high medium low info"`
	Evidence       map[string]interface{} `json:"evidence" validate:"omitempty"`
	Recommendation string                 `json:"recommendation" validate:"omitempty,max=2000"`
	Tags           []string               `json:"tags" validate:"omitempty"`
}

type ToolRun struct {
	ID            uuid.UUID              `db:"id" json:"id"`
	CaseID        uuid.UUID              `db:"case_id" json:"case_id"`
	EntityID      *uuid.UUID             `db:"entity_id" json:"entity_id,omitempty"`
	ToolName      string                 `db:"tool_name" json:"tool_name"`
	InputData     map[string]interface{} `db:"input_data" json:"input_data"`
	OutputData    map[string]interface{} `db:"output_data" json:"output_data"`
	Status        string                 `db:"status" json:"status"` // queued, running, completed, failed
	ErrorMessage  string                 `db:"error_message" json:"error_message"`
	StartedAt     *time.Time             `db:"started_at" json:"started_at,omitempty"`
	CompletedAt   *time.Time             `db:"completed_at" json:"completed_at,omitempty"`
	DurationMs    *int64                 `db:"duration_ms" json:"duration_ms,omitempty"`
	CreatedAt     time.Time              `db:"created_at" json:"created_at"`
}

type ToolRunRequest struct {
	ToolName  string                 `json:"tool_name" validate:"required"`
	EntityID  *uuid.UUID             `json:"entity_id" validate:"omitempty"`
	InputData map[string]interface{} `json:"input_data" validate:"required"`
}

type Report struct {
	ID        uuid.UUID `db:"id" json:"id"`
	CaseID    uuid.UUID `db:"case_id" json:"case_id"`
	Title     string    `db:"title" json:"title"`
	Format    string    `db:"format" json:"format"` // pdf, html, json, csv
	ContentType string  `db:"content_type" json:"content_type"`
	FileSize  int64     `db:"file_size" json:"file_size"`
	FilePath  string    `db:"file_path" json:"file_path"`
	FileHash  string    `db:"file_hash" json:"file_hash"` // SHA-256
	CreatedAt time.Time `db:"created_at" json:"created_at"`
	CreatedBy uuid.UUID `db:"created_by" json:"created_by"`
	ExpiresAt *time.Time `db:"expires_at" json:"expires_at,omitempty"`
}
