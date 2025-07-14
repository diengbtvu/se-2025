#!/bin/bash

# Deploy script cho VPS
# Sử dụng: ./deploy-vps.sh

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Starting deployment...${NC}"

# Variables
PROJECT_DIR="$HOME/se-2025"
BACKUP_DIR="$HOME/backups/se-2025"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create directories if not exist
mkdir -p "$PROJECT_DIR"
mkdir -p "$BACKUP_DIR"

# Navigate to project directory
cd "$PROJECT_DIR"

# Backup current deployment
if [ -d ".git" ]; then
    echo -e "${YELLOW}📦 Creating backup...${NC}"
    docker-compose down
    tar -czf "$BACKUP_DIR/backup_$TIMESTAMP.tar.gz" docker-compose.yml .env 2>/dev/null || true
fi

# Pull latest code
echo -e "${GREEN}📥 Pulling latest code...${NC}"
if [ -d ".git" ]; then
    git fetch origin main
    git reset --hard origin/main
else
    git clone https://github.com/$GITHUB_REPOSITORY.git .
    git checkout main
fi

# Create .env file if not exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env file...${NC}"
    cat > .env << EOF
# Database
DB_NAME=beelifeventures
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=mysql
DB_PORT=3306

# Frontend
NEXT_PUBLIC_API_URL=http://backend:8080

# JWT
JWT_SECRET=your-jwt-secret-key-here
EOF
fi

# Pull latest images
echo -e "${GREEN}🐳 Pulling Docker images...${NC}"
docker-compose pull

# Build and start containers
echo -e "${GREEN}🔨 Building and starting containers...${NC}"
docker-compose up -d --build --remove-orphans

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to start...${NC}"
sleep 30

# Health check
echo -e "${GREEN}🔍 Running health checks...${NC}"

# Check backend
if curl -f http://localhost:8080/api/product > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    echo -e "${YELLOW}Rolling back...${NC}"
    docker-compose down
    exit 1
fi

# Check frontend
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is running${NC}"
else
    echo -e "${RED}❌ Frontend health check failed${NC}"
    echo -e "${YELLOW}Rolling back...${NC}"
    docker-compose down
    exit 1
fi

# Check MySQL
if docker exec $(docker-compose ps -q mysql) mysql -u root -p$DB_PASSWORD -e "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ MySQL is running${NC}"
else
    echo -e "${RED}❌ MySQL health check failed${NC}"
fi

# Show running containers
echo -e "${GREEN}📊 Running containers:${NC}"
docker-compose ps

# Clean up old images
echo -e "${YELLOW}🧹 Cleaning up old images...${NC}"
docker image prune -f

# Clean up old backups (keep last 5)
echo -e "${YELLOW}🗑️ Cleaning up old backups...${NC}"
ls -t "$BACKUP_DIR"/backup_*.tar.gz 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null || true

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Frontend: http://localhost:3000${NC}"
echo -e "${GREEN}🔧 Backend: http://localhost:8080${NC}" 