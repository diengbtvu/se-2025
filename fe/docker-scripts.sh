#!/bin/bash

# Docker management scripts for Next.js frontend

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to build production image
build_production() {
    print_status "Building production Docker image..."
    docker build -t beelife-frontend:latest .
    if [ $? -eq 0 ]; then
        print_success "Production image built successfully!"
    else
        print_error "Failed to build production image"
        exit 1
    fi
}

# Function to build development image
build_development() {
    print_status "Building development Docker image..."
    docker build -f Dockerfile.dev -t beelife-frontend:dev .
    if [ $? -eq 0 ]; then
        print_success "Development image built successfully!"
    else
        print_error "Failed to build development image"
        exit 1
    fi
}

# Function to run production container
run_production() {
    print_status "Starting production container..."
    docker run -d --name beelife-frontend-prod -p 3000:3000 beelife-frontend:latest
    if [ $? -eq 0 ]; then
        print_success "Production container started on http://localhost:3000"
    else
        print_error "Failed to start production container"
        exit 1
    fi
}

# Function to run development container
run_development() {
    print_status "Starting development container..."
    docker run -d --name beelife-frontend-dev -p 3000:3000 -v $(pwd):/app -v /app/node_modules beelife-frontend:dev
    if [ $? -eq 0 ]; then
        print_success "Development container started on http://localhost:3000"
    else
        print_error "Failed to start development container"
        exit 1
    fi
}

# Function to stop containers
stop_containers() {
    print_status "Stopping containers..."
    docker stop beelife-frontend-prod beelife-frontend-dev 2>/dev/null || true
    docker rm beelife-frontend-prod beelife-frontend-dev 2>/dev/null || true
    print_success "Containers stopped and removed"
}

# Function to clean up images
cleanup_images() {
    print_status "Cleaning up Docker images..."
    docker rmi beelife-frontend:latest beelife-frontend:dev 2>/dev/null || true
    print_success "Images cleaned up"
}

# Function to show logs
show_logs() {
    local container_name=$1
    if [ -z "$container_name" ]; then
        container_name="beelife-frontend-prod"
    fi
    print_status "Showing logs for $container_name..."
    docker logs -f $container_name
}

# Function to show container status
show_status() {
    print_status "Container status:"
    docker ps -a --filter "name=beelife-frontend"
}

# Function to run with docker-compose
run_compose() {
    print_status "Starting with docker-compose..."
    docker-compose up -d
    if [ $? -eq 0 ]; then
        print_success "Services started with docker-compose"
    else
        print_error "Failed to start services with docker-compose"
        exit 1
    fi
}

# Function to stop docker-compose
stop_compose() {
    print_status "Stopping docker-compose services..."
    docker-compose down
    print_success "Services stopped"
}

# Function to show help
show_help() {
    echo "Docker management script for BeeLife Frontend"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build-prod     Build production Docker image"
    echo "  build-dev      Build development Docker image"
    echo "  run-prod       Run production container"
    echo "  run-dev        Run development container"
    echo "  stop           Stop all containers"
    echo "  cleanup        Clean up Docker images"
    echo "  logs [name]    Show container logs (default: beelife-frontend-prod)"
    echo "  status         Show container status"
    echo "  compose-up     Start with docker-compose"
    echo "  compose-down   Stop docker-compose services"
    echo "  help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build-prod"
    echo "  $0 run-dev"
    echo "  $0 logs beelife-frontend-dev"
}

# Main script logic
case "$1" in
    "build-prod")
        build_production
        ;;
    "build-dev")
        build_development
        ;;
    "run-prod")
        run_production
        ;;
    "run-dev")
        run_development
        ;;
    "stop")
        stop_containers
        ;;
    "cleanup")
        cleanup_images
        ;;
    "logs")
        show_logs $2
        ;;
    "status")
        show_status
        ;;
    "compose-up")
        run_compose
        ;;
    "compose-down")
        stop_compose
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac 