package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/joho/godotenv"
	"go.uber.org/zap"

	"github.com/osint-workbench/backend/internal/config"
	"github.com/osint-workbench/backend/internal/pkg/logger"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		fmt.Printf("Warning: .env file not found: %v\n", err)
	}

	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		fmt.Printf("Failed to load configuration: %v\n", err)
		os.Exit(1)
	}

	// Initialize logger
	if err := logger.Init(cfg.Log.Level, cfg.Log.Format); err != nil {
		fmt.Printf("Failed to initialize logger: %v\n", err)
		os.Exit(1)
	}
	defer logger.Get().Sync() // nolint

	log := logger.Get()
	log.Info("OSINT Workbench Backend starting...",
		zap.String("environment", cfg.Server.Environment),
		zap.String("host", cfg.Server.Host),
		zap.Int("port", cfg.Server.Port),
	)

	// TODO: Initialize database connection pool
	// db, err := database.New(cfg.Database)
	// if err != nil {
	// 	log.Fatal("Failed to initialize database", zap.Error(err))
	// }
	// defer db.Close()

	// TODO: Run database migrations
	// if err := database.Migrate(db); err != nil {
	// 	log.Fatal("Failed to run migrations", zap.Error(err))
	// }

	// TODO: Initialize Redis
	// redis := redis.NewClient(cfg.Redis)
	// defer redis.Close()

	// TODO: Initialize repositories
	// userRepo := repository.NewUserRepository(db)
	// caseRepo := repository.NewCaseRepository(db)

	// TODO: Initialize services
	// authService := service.NewAuthService(userRepo, cfg.JWT)
	// caseService := service.NewCaseService(caseRepo)

	// TODO: Initialize API router
	// router := api.NewRouter(authService, caseService, cfg)

	// TODO: Initialize job worker
	// worker := worker.NewWorker(db, redis, log)
	// go worker.Start()

	// Create HTTP server
	server := &http.Server{
		Addr:         fmt.Sprintf("%s:%d", cfg.Server.Host, cfg.Server.Port),
		Handler:      nil, // TODO: Set to router
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
	}

	// Channel for errors from goroutines
	errChan := make(chan error, 1)

	// Start server in a goroutine
	go func() {
		log.Info("Server started listening", zap.String("addr", server.Addr))
		errChan <- server.ListenAndServe()
	}()

	// Wait for shutdown signal
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	select {
	case err := <-errChan:
		if err != http.ErrServerClosed {
			log.Fatal("Server error", zap.Error(err))
		}
	case sig := <-sigChan:
		log.Info("Shutdown signal received", zap.String("signal", sig.String()))

		// Graceful shutdown
		ctx, cancel := context.WithTimeout(context.Background(), cfg.Server.ShutdownTimeout)
		defer cancel()

		if err := server.Shutdown(ctx); err != nil {
			log.Error("Server shutdown error", zap.Error(err))
		}
	}

	log.Info("Server stopped")
}
