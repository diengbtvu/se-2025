# BeeLifeVentures - Docker Setup

Hướng dẫn chạy toàn bộ ứng dụng BeeLifeVentures (Frontend + Backend) bằng Docker.

## 📋 Yêu cầu hệ thống

- Docker
- Docker Compose
- Git

## 🚀 Cách sử dụng

### 1. Khởi chạy toàn bộ ứng dụng

```bash
# Sử dụng docker-compose trực tiếp
docker-compose up --build

# Hoặc sử dụng script hỗ trợ
./run-app.sh start
```

### 2. Các lệnh hữu ích

```bash
# Khởi chạy ở chế độ development
./run-app.sh dev

# Dừng ứng dụng
./run-app.sh stop

# Khởi động lại
./run-app.sh restart

# Xem logs real-time
./run-app.sh logs

# Kiểm tra trạng thái
./run-app.sh status

# Dọn dẹp containers và images
./run-app.sh clean

# Xem hướng dẫn
./run-app.sh help
```

## 🌐 Các URL truy cập

Sau khi khởi chạy thành công:

- **Frontend (Production)**: http://localhost:3000
- **Frontend (Development)**: http://localhost:3001 (chỉ khi chạy ở chế độ dev)
- **Backend API**: http://localhost:8080

## 🏗️ Cấu trúc Services

### Backend Service
- **Container**: `beelife-backend`
- **Port**: 8080
- **Technology**: Spring Boot + Java 17
- **Database**: MySQL (external)

### Frontend Service
- **Container**: `beelife-frontend` 
- **Port**: 3000
- **Technology**: Next.js + React

### Frontend Development Service (Optional)
- **Container**: `beelife-frontend-dev`
- **Port**: 3001
- **Technology**: Next.js + React (hot reload)

## 🔧 Cấu hình môi trường

### Backend Environment Variables
```env
SPRING_PROFILES_ACTIVE=docker
SPRING_DATASOURCE_URL=jdbc:mysql://14.225.220.60:3306/beelifeventures
SPRING_DATASOURCE_USERNAME=beelife_user
SPRING_DATASOURCE_PASSWORD=dfjsdbA3f@a!@#sdb
```

### Frontend Environment Variables
```env
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_API_URL=http://backend:8080
```

## 🐛 Troubleshooting

### Kiểm tra trạng thái containers
```bash
docker-compose ps
```

### Xem logs của service cụ thể
```bash
# Backend logs
docker-compose logs -f backend

# Frontend logs  
docker-compose logs -f frontend
```

### Restart service cụ thể
```bash
# Restart backend
docker-compose restart backend

# Restart frontend
docker-compose restart frontend
```

### Build lại images
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Dọn dẹp hoàn toàn
```bash
./run-app.sh clean
# Hoặc
docker-compose down --rmi all --volumes --remove-orphans
```

## 📁 Cấu trúc thư mục

```
se-2025/
├── docker-compose.yml          # File cấu hình chính
├── run-app.sh                  # Script quản lý ứng dụng
├── be/                         # Backend code
│   └── se-cnpm-beelifeventures/
│       ├── Dockerfile
│       └── src/
└── fe/                         # Frontend code
    ├── Dockerfile
    ├── Dockerfile.dev
    └── src/
```

## 🔄 Development Workflow

1. **Khởi chạy development environment**:
   ```bash
   ./run-app.sh dev
   ```

2. **Thay đổi code**: Code sẽ tự động reload trong container development

3. **Test changes**: Truy cập http://localhost:3001 để test frontend changes

4. **Deploy production**: 
   ```bash
   ./run-app.sh stop
   ./run-app.sh start
   ```

## 🚨 Lưu ý quan trọng

- Đảm bảo ports 3000, 3001, 8080 không bị sử dụng bởi ứng dụng khác
- Backend sử dụng database MySQL external, đảm bảo kết nối mạng ổn định
- Frontend production build có thể mất vài phút để build lần đầu
- Sử dụng `./run-app.sh clean` để dọn dẹp khi gặp vấn đề cache

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy:
1. Kiểm tra logs: `./run-app.sh logs`
2. Kiểm tra trạng thái: `./run-app.sh status`
3. Thử build lại: `./run-app.sh clean` và `./run-app.sh start` 