#!/bin/bash

# Fast Docker run script - No build step

echo "🚀 Starting BeeLife Frontend (Fast Mode)..."

# Stop any existing containers
docker-compose down frontend-fast 2>/dev/null || true

# Start fast development service
docker-compose up frontend-fast

echo "✅ Frontend running on http://localhost:3002"
echo "📝 This mode skips the build step for faster startup"
echo "🛑 To stop: docker-compose down" 