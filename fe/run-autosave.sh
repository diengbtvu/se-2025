#!/bin/bash

# Auto Save Docker run script

echo "🚀 Starting BeeLife Frontend with Auto Save..."

# Stop any existing containers
docker-compose down frontend-fast 2>/dev/null || true

# Start fast development service with auto save
docker-compose up frontend-fast

echo "✅ Frontend running on http://localhost:3002"
echo "📝 Auto save is enabled - changes will reload automatically"
echo "🔄 File watching is optimized for Docker"
echo "🛑 To stop: docker-compose down" 