# build
FROM golang:1.23-alpine AS builder

WORKDIR /app

RUN apk add --no-cache git

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o worker ./cmd/worker

# runtime
FROM mcr.microsoft.com/playwright:v1.40.0-focal

WORKDIR /app

COPY --from=builder /app/worker .

CMD ["./worker"]
