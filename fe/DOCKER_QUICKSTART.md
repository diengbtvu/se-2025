# Docker Quick Start Guide

## Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Commands

### 1. Check Docker Setup
```bash
chmod +x docker-check.sh
./docker-check.sh
```

### 2. Start Production
```bash
# Using Docker Compose
docker-compose up frontend

# Or using helper script
chmod +x docker-scripts.sh
./docker-scripts.sh compose-up
```

### 3. Start Development
```bash
# Using Docker Compose
docker-compose up frontend-dev

# Or using helper script
./docker-scripts.sh run-dev
```

### 4. Stop Services
```bash
# Stop all services
docker-compose down

# Or using helper script
./docker-scripts.sh stop
```

## Ports
- **Production**: http://localhost:3000
- **Development**: http://localhost:3001

## Environment Variables
Create `.env` file with:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

## Troubleshooting

### Port already in use
```bash
# Check what's using the port
lsof -i :3000

# Kill the process or change port in docker-compose.yml
```

### Build fails
```bash
# Clean up and rebuild
docker system prune -f
docker-compose build --no-cache
```

### Container won't start
```bash
# Check logs
docker-compose logs frontend

# Or for development
docker-compose logs frontend-dev
```

## Useful Commands

```bash
# View logs
docker-compose logs -f frontend

# Access container shell
docker-compose exec frontend sh

# Rebuild without cache
docker-compose build --no-cache frontend

# Clean up everything
docker system prune -a
``` 