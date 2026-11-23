package config

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/spf13/viper"
)

// Config holds all application configuration
type Config struct {
	// Server
	Server ServerConfig
	// Database
	Database DatabaseConfig
	// Redis
	Redis RedisConfig
	// JWT
	JWT JWTConfig
	// Logging
	Log LogConfig
	// Security
	Security SecurityConfig
}

type ServerConfig struct {
	Host            string
	Port            int
	Environment     string // development, staging, production
	ReadTimeout     time.Duration
	WriteTimeout    time.Duration
	ShutdownTimeout time.Duration
	CORS            CORSConfig
}

type DatabaseConfig struct {
	Host            string
	Port            int
	User            string
	Password        string
	Database        string
	SSLMode         string // disable, require, verify-ca, verify-full
	MaxOpenConns    int
	MaxIdleConns    int
	ConnMaxLifetime time.Duration
	// Connection pool
	ConnectionURL string
}

type RedisConfig struct {
	Host     string
	Port     int
	DB       int
	Password string
	// Connection pool
	PoolSize int
	MinIdleConns int
}

type JWTConfig struct {
	Secret            string
	AccessTokenTTL    time.Duration
	RefreshTokenTTL   time.Duration
	IssuerURL         string
	Audience          string
}

type LogConfig struct {
	Level  string // debug, info, warn, error, fatal
	Format string // json, text
}

type SecurityConfig struct {
	AllowedOrigins []string
	AllowedDomains []string
	MaxRequestSize int64
	RateLimit      RateLimitConfig
}

type RateLimitConfig struct {
	RequestsPerSecond int
	BurstSize        int
}

type CORSConfig struct {
	AllowedOrigins   []string
	AllowedMethods   []string
	AllowedHeaders   []string
	ExposedHeaders   []string
	AllowCredentials bool
	MaxAge           int
}

// Load loads configuration from environment and config files
func Load() (*Config, error) {
	// Set defaults
	viper.SetDefault("SERVER_HOST", "0.0.0.0")
	viper.SetDefault("SERVER_PORT", 8080)
	viper.SetDefault("SERVER_ENVIRONMENT", "development")
	viper.SetDefault("SERVER_READ_TIMEOUT", "15s")
	viper.SetDefault("SERVER_WRITE_TIMEOUT", "15s")
	viper.SetDefault("SERVER_SHUTDOWN_TIMEOUT", "30s")

	viper.SetDefault("DATABASE_HOST", "localhost")
	viper.SetDefault("DATABASE_PORT", 5432)
	viper.SetDefault("DATABASE_USER", "postgres")
	viper.SetDefault("DATABASE_SSLMODE", "disable")
	viper.SetDefault("DATABASE_MAX_OPEN_CONNS", 25)
	viper.SetDefault("DATABASE_MAX_IDLE_CONNS", 5)
	viper.SetDefault("DATABASE_CONN_MAX_LIFETIME", "5m")

	viper.SetDefault("REDIS_HOST", "localhost")
	viper.SetDefault("REDIS_PORT", 6379)
	viper.SetDefault("REDIS_DB", 0)
	viper.SetDefault("REDIS_POOL_SIZE", 10)
	viper.SetDefault("REDIS_MIN_IDLE_CONNS", 5)

	viper.SetDefault("JWT_ACCESS_TOKEN_TTL", "15m")
	viper.SetDefault("JWT_REFRESH_TOKEN_TTL", "7d")

	viper.SetDefault("LOG_LEVEL", "info")
	viper.SetDefault("LOG_FORMAT", "json")

	viper.SetDefault("SECURITY_MAX_REQUEST_SIZE", 10485760) // 10MB
	viper.SetDefault("SECURITY_RATE_LIMIT_RPS", 100)
	viper.SetDefault("SECURITY_RATE_LIMIT_BURST", 200)

	// Read from .env
	viper.SetConfigFile(".env")
	viper.BindEnv("SERVER_HOST")
	viper.BindEnv("SERVER_PORT")
	viper.BindEnv("DATABASE_HOST")
	viper.BindEnv("DATABASE_PASSWORD")
	viper.BindEnv("JWT_SECRET")

	// Read config file
	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return nil, err
		}
	}

	// Build config
	cfg := &Config{
		Server: ServerConfig{
			Host:        viper.GetString("SERVER_HOST"),
			Port:        viper.GetInt("SERVER_PORT"),
			Environment: viper.GetString("SERVER_ENVIRONMENT"),
			ReadTimeout: parseDuration(viper.GetString("SERVER_READ_TIMEOUT")),
			WriteTimeout: parseDuration(viper.GetString("SERVER_WRITE_TIMEOUT")),
			ShutdownTimeout: parseDuration(viper.GetString("SERVER_SHUTDOWN_TIMEOUT")),
			CORS: CORSConfig{
				AllowedOrigins: []string{"*"},
				AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
				AllowedHeaders: []string{"Accept", "Authorization", "Content-Type"},
				MaxAge:         300,
			},
		},
		Database: DatabaseConfig{
			Host:            viper.GetString("DATABASE_HOST"),
			Port:            viper.GetInt("DATABASE_PORT"),
			User:            viper.GetString("DATABASE_USER"),
			Password:        viper.GetString("DATABASE_PASSWORD"),
			Database:        viper.GetString("DATABASE_DB"),
			SSLMode:         viper.GetString("DATABASE_SSLMODE"),
			MaxOpenConns:    viper.GetInt("DATABASE_MAX_OPEN_CONNS"),
			MaxIdleConns:    viper.GetInt("DATABASE_MAX_IDLE_CONNS"),
			ConnMaxLifetime: parseDuration(viper.GetString("DATABASE_CONN_MAX_LIFETIME")),
		},
		Redis: RedisConfig{
			Host:         viper.GetString("REDIS_HOST"),
			Port:         viper.GetInt("REDIS_PORT"),
			DB:           viper.GetInt("REDIS_DB"),
			Password:     viper.GetString("REDIS_PASSWORD"),
			PoolSize:     viper.GetInt("REDIS_POOL_SIZE"),
			MinIdleConns: viper.GetInt("REDIS_MIN_IDLE_CONNS"),
		},
		JWT: JWTConfig{
			Secret:          viper.GetString("JWT_SECRET"),
			AccessTokenTTL:  parseDuration(viper.GetString("JWT_ACCESS_TOKEN_TTL")),
			RefreshTokenTTL: parseDuration(viper.GetString("JWT_REFRESH_TOKEN_TTL")),
			IssuerURL:       "https://osint-workbench.io",
			Audience:        "osint-workbench",
		},
		Log: LogConfig{
			Level:  viper.GetString("LOG_LEVEL"),
			Format: viper.GetString("LOG_FORMAT"),
		},
		Security: SecurityConfig{
			AllowedOrigins: []string{"*"},
			AllowedDomains: []string{"localhost", "127.0.0.1"},
			MaxRequestSize: int64(viper.GetInt("SECURITY_MAX_REQUEST_SIZE")),
			RateLimit: RateLimitConfig{
				RequestsPerSecond: viper.GetInt("SECURITY_RATE_LIMIT_RPS"),
				BurstSize:         viper.GetInt("SECURITY_RATE_LIMIT_BURST"),
			},
		},
	}

	// Build database connection URL
	cfg.Database.ConnectionURL = fmt.Sprintf(
		"postgres://%s:%s@%s:%d/%s?sslmode=%s",
		cfg.Database.User,
		cfg.Database.Password,
		cfg.Database.Host,
		cfg.Database.Port,
		cfg.Database.Database,
		cfg.Database.SSLMode,
	)

	return cfg, nil
}

// Helper function to parse duration string
func parseDuration(s string) time.Duration {
	d, err := time.ParseDuration(s)
	if err != nil {
		// Default to 15 seconds if parse fails
		return 15 * time.Second
	}
	return d
}

// IsProduction returns true if running in production environment
func (c *Config) IsProduction() bool {
	return c.Server.Environment == "production"
}

// IsDevelopment returns true if running in development environment
func (c *Config) IsDevelopment() bool {
	return c.Server.Environment == "development"
}
