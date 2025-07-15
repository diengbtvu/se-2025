#!/bin/bash

# BeeLifeVentures Application Runner
# Sử dụng script này để khởi chạy toàn bộ ứng dụng (Frontend + Backend)

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
    print_colored "BeeLifeVentures Application Runner" "$BLUE"
    print_separator
    echo "Sử dụng:"
    echo "  $0 [OPTION]"
    echo ""
    echo "Tùy chọn:"
    echo "  start, up         Khởi chạy toàn bộ ứng dụng (Production)"
    echo "  dev               Khởi chạy ở chế độ development"
    echo "  stop, down        Dừng toàn bộ ứng dụng"
    echo "  restart           Khởi động lại ứng dụng"
    echo "  logs              Xem logs của tất cả services"
    echo "  status            Kiểm tra trạng thái các services"
    echo "  clean             Dọn dẹp containers và images"
    echo "  help              Hiển thị hướng dẫn này"
    echo ""
    echo "Ví dụ:"
    echo "  $0 start          # Khởi chạy ứng dụng production"
    echo "  $0 dev            # Khởi chạy ở chế độ development"
    echo "  $0 logs           # Xem logs real-time"
}

start_app() {
    print_colored "🚀 Đang khởi chạy BeeLifeVentures Application..." "$GREEN"
    print_separator
    docker-compose up --build -d
    print_colored "✅ Ứng dụng đã được khởi chạy!" "$GREEN"
    print_colored "🌐 Frontend: http://localhost:3000" "$BLUE"
    print_colored "🔧 Backend API: http://localhost:8080" "$BLUE"
}

start_dev() {
    print_colored "🔧 Đang khởi chạy BeeLifeVentures ở chế độ Development..." "$YELLOW"
    print_separator
    docker-compose --profile dev up --build -d
    print_colored "✅ Ứng dụng Development đã được khởi chạy!" "$GREEN"
    print_colored "🌐 Frontend Production: http://localhost:3000" "$BLUE"
    print_colored "🔧 Frontend Development: http://localhost:3001" "$BLUE"
    print_colored "🔧 Backend API: http://localhost:8080" "$BLUE"
}

stop_app() {
    print_colored "🛑 Đang dừng ứng dụng..." "$YELLOW"
    docker-compose down
    print_colored "✅ Ứng dụng đã được dừng!" "$GREEN"
}

restart_app() {
    print_colored "🔄 Đang khởi động lại ứng dụng..." "$YELLOW"
    docker-compose down
    docker-compose up --build -d
    print_colored "✅ Ứng dụng đã được khởi động lại!" "$GREEN"
}

show_logs() {
    print_colored "📋 Hiển thị logs của tất cả services..." "$BLUE"
    docker-compose logs -f
}

show_status() {
    print_colored "📊 Trạng thái các services:" "$BLUE"
    print_separator
    docker-compose ps
}

clean_app() {
    print_colored "🧹 Đang dọn dẹp containers và images..." "$YELLOW"
    docker-compose down --rmi all --volumes --remove-orphans
    print_colored "✅ Đã dọn dẹp xong!" "$GREEN"
}

# Main script logic
case "${1:-help}" in
    "start"|"up")
        start_app
        ;;
    "dev")
        start_dev
        ;;
    "stop"|"down")
        stop_app
        ;;
    "restart")
        restart_app
        ;;
    "logs")
        show_logs
        ;;
    "status")
        show_status
        ;;
    "clean")
        clean_app
        ;;
    "help"|*)
        show_help
        ;;
esac 