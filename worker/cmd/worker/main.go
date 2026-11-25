package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found: %v", err)
	}

	concurrency := os.Getenv("WORKER_CONCURRENCY")
	if concurrency == "" {
		concurrency = "5"
	}

	// todo: db, scanner modules (dns, http, tls) and a concurrent job loop

	log.Printf("Worker would start with concurrency: %s", concurrency)
}
