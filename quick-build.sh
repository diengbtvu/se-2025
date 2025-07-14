#!/bin/bash

# Quick Build Script for Local Development
# Builds and runs BeeLifeVentures quickly without CI/CD overhead

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_colored() {
    printf "${2}${1}${NC}\n"
}

print_separator() {
    echo "=================================================="
}

show_help() {
    print_colored "BeeLifeVentures Quick Build Script" "$BLUE"
    print_separator
    echo "Builds and runs the application quickly for local development"
    echo ""
    echo "Usage:"
    echo "  $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  start, build      Build và khởi chạy toàn bộ ứng dụng"
    echo "  fast              Build nhanh với cache"
    echo "  dev               Chế độ development với hot reload"
    echo "  stop              Dừng và cleanup"
    echo "  clean             Dọn dẹp images và containers"
    echo "  logs              Xem logs"
    echo "  help              Hiển thị hướng dẫn này"
    echo ""
    echo "Examples:"
    echo "  $0 fast           # Build nhanh nhất"
    echo "  $0 dev            # Development mode"
    echo "  $0 clean          # Dọn dẹp toàn bộ"
}

# Stop existing containers
stop_containers() {
    print_colored "🛑 Stopping existing containers..." "$YELLOW"
    docker-compose down 2>/dev/null || true
}

# Clean up everything
clean_all() {
    print_colored "🧹 Cleaning up Docker resources..." "$YELLOW"
    
    # Stop and remove containers
    docker-compose down -v --remove-orphans 2>/dev/null || true
    
    # Remove project images
    docker images | grep -E "(beelife|se-2025)" | awk '{print $3}' | xargs docker rmi -f 2>/dev/null || true
    
    # Remove unused images and cache
    docker image prune -f 2>/dev/null || true
    docker builder prune -f 2>/dev/null || true
    
    print_colored "✅ Cleanup completed!" "$GREEN"
}

# Fast build with maximum caching
fast_build() {
    print_colored "⚡ Fast build mode - using maximum caching..." "$GREEN"
    print_separator
    
    # Build với cache
    DOCKER_BUILDKIT=1 docker-compose build --parallel
    
    # Start services
    docker-compose up -d
    
    print_colored "🚀 Fast build completed!" "$GREEN"
    show_urls
}

# Development mode build
dev_build() {
    print_colored "🔧 Development build mode..." "$YELLOW"
    print_separator
    
    # Use development profile
    DOCKER_BUILDKIT=1 docker-compose --profile dev build --parallel
    
    # Start with development services
    docker-compose --profile dev up -d
    
    print_colored "✅ Development build completed!" "$GREEN"
    show_urls_dev
}

# Standard build
standard_build() {
    print_colored "🏗️ Standard build mode..." "$BLUE"
    print_separator
    
    # Build with progress
    DOCKER_BUILDKIT=1 docker-compose up --build -d
    
    print_colored "✅ Standard build completed!" "$GREEN"
    show_urls
}

# Show access URLs
show_urls() {
    print_separator
    print_colored "🌐 Application URLs:" "$BLUE"
    echo "  Frontend (Production): http://localhost:3000"
    echo "  Backend API:          http://localhost:8080"
    echo "  API Test:             http://localhost:8080/api/product"
    print_separator
}

show_urls_dev() {
    print_separator
    print_colored "🌐 Development URLs:" "$BLUE"
    echo "  Frontend (Production): http://localhost:3000"
    echo "  Frontend (Development): http://localhost:3001"
    echo "  Backend API:          http://localhost:8080"
    echo "  API Test:             http://localhost:8080/api/product"
    print_separator
}

# Show logs
show_logs() {
    print_colored "📋 Showing application logs..." "$BLUE"
    docker-compose logs -f --tail=50
}

# Wait for services to be ready
wait_for_services() {
    print_colored "⏳ Waiting for services to be ready..." "$YELLOW"
    
    # Wait for backend
    timeout 120 bash -c 'until curl -f http://localhost:8080/api/product >/dev/null 2>&1; do sleep 2; done' || {
        print_colored "⚠️ Backend might not be ready yet. Check logs if needed." "$YELLOW"
    }
    
    # Wait for frontend
    timeout 60 bash -c 'until curl -f http://localhost:3000 >/dev/null 2>&1; do sleep 2; done' || {
        print_colored "⚠️ Frontend might not be ready yet. Check logs if needed." "$YELLOW"
    }
    
    print_colored "✅ Services are ready!" "$GREEN"
}

# Main script logic
case "${1:-help}" in
    "start"|"build")
        stop_containers
        standard_build
        wait_for_services
        ;;
    "fast")
        stop_containers
        fast_build
        wait_for_services
        ;;
    "dev")
        stop_containers
        dev_build
        wait_for_services
        ;;
    "stop")
        stop_containers
        print_colored "✅ Stopped successfully!" "$GREEN"
        ;;
    "clean")
        clean_all
        ;;
    "logs")
        show_logs
        ;;
    "help"|*)
        show_help
        ;;
esac 