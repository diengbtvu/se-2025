# BeeLife Ventures

Hệ thống quản lý sản phẩm và đơn hàng cho BeeLife Ventures.

## 🚀 Tính Năng

- ✅ **Quản lý sản phẩm** - CRUD operations
- ✅ **Giỏ hàng thông minh** - Real-time updates  
- ✅ **Xác thực JWT** - Secure authentication
- ✅ **Dashboard admin** - Analytics & management
- ✅ **Responsive design** - Mobile-friendly UI
- ✅ **Docker deployment** - Easy containerization
- ✅ **Auto Deploy** - Tự động deploy khi push main

## 🛠️ Tech Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Three.js (3D models)

### Backend  
- Spring Boot 3
- Java 17
- MySQL
- JWT Authentication

### DevOps
- Docker & Docker Compose
- GitHub Actions CI/CD
- Auto deploy to VPS

## 📦 Cài Đặt

### 1. Clone repository

```bash
git clone https://github.com/diengbtvu/se-2025.git
cd se-2025
```

### 2. Chạy với Docker

```bash
# Build và start tất cả services
docker-compose up -d --build

# Hoặc dùng script helper
./run-app.sh start
```

### 3. Truy cập

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- MySQL: localhost:3306

## 🚀 CI/CD & Auto Deploy

Dự án có hệ thống CI/CD đơn giản với auto deploy:

- **Build & Test**: Frontend (npm) và Backend (Maven)  
- **Docker Validation**: Kiểm tra Docker builds
- **Auto Deploy**: Tự động deploy lên VPS khi push main
- **Fast & Reliable**: 5-10 phút với auto rollback

### Setup Auto Deploy

1. **Thêm GitHub Secrets**:
   - `VPS_HOST`: IP của VPS
   - `VPS_USERNAME`: SSH username  
   - `VPS_SSH_KEY`: Private SSH key

2. **Push lên main** để trigger auto deploy

Chi tiết: 
- [CI Simple Guide](docs/CI_SIMPLE.md)
- [VPS Deploy Guide](docs/VPS_DEPLOY_GUIDE.md)

## 📁 Cấu Trúc

```
se-2025/
├── fe/                 # Frontend Next.js
├── be/                 # Backend Spring Boot  
├── docker-compose.yml  # Docker orchestration
├── .github/           # GitHub Actions workflows
└── docs/              # Documentation
```

## 🧪 Development

### Frontend
```bash
cd fe
npm install
npm run dev
```

### Backend
```bash
cd be/se-cnpm-beelifeventures
mvn spring-boot:run
```

## 📝 Scripts

- `./run-app.sh` - Quản lý Docker containers
- `./quick-build.sh` - Fast local builds
- `./scripts/deploy-vps.sh` - Deploy script cho VPS

## 👥 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## Bản thiết kế Figma design

https://www.figma.com/design/05Wq9VVWOjP9R6xwCecbzI/Bee?node-id=0-1&t=JDYHM03S92iALkZ0-1

## 📝 License

Distributed under the MIT License.

---

**Made with ❤️ by BeeLife Team** 
