module github.com/osint-workbench/backend

go 1.23

require (
	// API Framework - Chi (better than Gin for production)
	github.com/go-chi/chi/v5 v5.0.11
	github.com/go-chi/cors v1.2.1
	github.com/go-chi/httprate v0.9.0
	github.com/go-chi/render v1.0.3

	// Database
	github.com/jackc/pgx/v5 v5.5.3
	github.com/jackc/pgconn v1.14.2
	github.com/golang-migrate/migrate/v4 v4.17.0

	// ORM
	gorm.io/gorm v1.25.5
	gorm.io/driver/postgres v1.5.7

	// Job Queue
	github.com/hibiken/asynq v0.24.1

	// Caching
	github.com/redis/go-redis/v9 v9.4.0

	// Authentication
	github.com/golang-jwt/jwt/v5 v5.2.0
	golang.org/x/crypto v0.23.0
	golang.org/x/oauth2 v0.15.0

	// Utilities
	github.com/google/uuid v1.6.0
	github.com/joho/godotenv v1.5.1
	github.com/spf13/viper v1.18.2
	github.com/go-playground/validator/v10 v10.18.0

	// Logging
	go.uber.org/zap v1.27.0

	// API Documentation
	github.com/swaggo/swag v1.16.3
	github.com/swaggo/files v0.0.0-20220610200504-28940afbdbfe
	github.com/swaggo/http-swagger v1.3.4

	// Utilities
	github.com/pkg/errors v0.9.1

	// Testing
	github.com/stretchr/testify v1.8.4
)

// Indirect dependencies are managed automatically
