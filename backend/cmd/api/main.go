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
	if err := godotenv.Load(); err != nil {
		fmt.Printf("Warning: .env file not found: %v\n", err)
	}

	cfg, err := config.Load()
	if err != nil {
		fmt.Printf("Failed to load configuration: %v\n", err)
		os.Exit(1)
	}

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

	// todo: postgres + migrations, redis, repos, services, router and the job worker

	server := &http.Server{
		Addr:         fmt.Sprintf("%s:%d", cfg.Server.Host, cfg.Server.Port),
		Handler:      nil, // todo: router
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
	}

	errChan := make(chan error, 1)

	go func() {
		log.Info("Server started listening", zap.String("addr", server.Addr))
		errChan <- server.ListenAndServe()
	}()

	// block until the server fails or we get sigint/sigterm
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	select {
	case err := <-errChan:
		if err != http.ErrServerClosed {
			log.Fatal("Server error", zap.Error(err))
		}
	case sig := <-sigChan:
		log.Info("Shutdown signal received", zap.String("signal", sig.String()))

		// graceful shutdown with a timeout
		ctx, cancel := context.WithTimeout(context.Background(), cfg.Server.ShutdownTimeout)
		defer cancel()

		if err := server.Shutdown(ctx); err != nil {
			log.Error("Server shutdown error", zap.Error(err))
		}
	}

	log.Info("Server stopped")
}
