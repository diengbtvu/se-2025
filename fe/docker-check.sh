#!/bin/bash

# Docker health check script for BeeLife Frontend

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

# Check if Docker is running
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker is not running"
        exit 1
    fi
    
    print_success "Docker is running"
}

# Check Docker Compose
check_docker_compose() {
    print_status "Checking Docker Compose..."
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed"
        exit 1
    fi
    
    print_success "Docker Compose is available"
}

# Check required files
check_files() {
    print_status "Checking required files..."
    
    local files=("Dockerfile" "Dockerfile.dev" "docker-compose.yml" "package.json" "next.config.mjs")
    local missing_files=()
    
    for file in "${files[@]}"; do
        if [[ ! -f "$file" ]]; then
            missing_files+=("$file")
        fi
    done
    
    if [[ ${#missing_files[@]} -gt 0 ]]; then
        print_error "Missing required files: ${missing_files[*]}"
        exit 1
    fi
    
    print_success "All required files found"
}

# Check package.json scripts
check_package_json() {
    print_status "Checking package.json scripts..."
    
    if ! grep -q '"build"' package.json; then
        print_error "Missing 'build' script in package.json"
        exit 1
    fi
    
    if ! grep -q '"dev"' package.json; then
        print_error "Missing 'dev' script in package.json"
        exit 1
    fi
    
    print_success "Package.json scripts are valid"
}

# Check Next.js configuration
check_next_config() {
    print_status "Checking Next.js configuration..."
    
    if ! grep -q "output: 'standalone'" next.config.mjs; then
        print_warning "Next.js standalone output not configured"
    else
        print_success "Next.js standalone output configured"
    fi
}

# Test Docker build
test_build() {
    print_status "Testing Docker build..."
    
    # Clean up any existing test images
    docker rmi beelife-frontend-test 2>/dev/null || true
    
    # Build test image
    if docker build -t beelife-frontend-test .; then
        print_success "Docker build successful"
        docker rmi beelife-frontend-test
    else
        print_error "Docker build failed"
        exit 1
    fi
}

# Test Docker Compose
test_compose() {
    print_status "Testing Docker Compose..."
    
    # Stop any running containers
    docker-compose down 2>/dev/null || true
    
    # Test compose configuration
    if docker-compose config > /dev/null 2>&1; then
        print_success "Docker Compose configuration is valid"
    else
        print_error "Docker Compose configuration is invalid"
        exit 1
    fi
}

# Check ports
check_ports() {
    print_status "Checking port availability..."
    
    local ports=("3000" "3001")
    
    for port in "${ports[@]}"; do
        if lsof -i :$port > /dev/null 2>&1; then
            print_warning "Port $port is already in use"
        else
            print_success "Port $port is available"
        fi
    done
}

# Main function
main() {
    echo "=== Docker Health Check for BeeLife Frontend ==="
    echo ""
    
    check_docker
    check_docker_compose
    check_files
    check_package_json
    check_next_config
    check_ports
    test_build
    test_compose
    
    echo ""
    print_success "All checks passed! Docker setup is ready."
    echo ""
    echo "To start the application:"
    echo "  Production: docker-compose up frontend"
    echo "  Development: docker-compose up frontend-dev"
    echo "  Or use: ./docker-scripts.sh compose-up"
}

# Run main function
main "$@" 