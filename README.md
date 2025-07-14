# 🐝 BeeLifeVentures

> Hệ thống quản lý trang trại ong thông minh với công nghệ IoT

[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](./DOCKER_README.md)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js-green)](./fe/)
[![Backend](https://img.shields.io/badge/Backend-Spring%20Boot-brightgreen)](./be/)

## 🚀 Quick Start

```bash
# Khởi chạy toàn bộ hệ thống
docker-compose up --build

# Hoặc sử dụng script tiện lợi
./run-app.sh start
```

## 🌐 Truy cập ứng dụng

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Docs**: Xem [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md)

## 📁 Cấu trúc dự án

```
se-2025/
├── 📱 fe/                    # Frontend (Next.js + TypeScript)
├── ⚙️  be/                    # Backend (Spring Boot + Java)
├── 📚 docs/                  # Tài liệu dự án
├── 🐳 docker-compose.yml     # Docker orchestration
└── 🎯 run-app.sh             # Script quản lý ứng dụng
```

## 🔧 Lệnh quản lý

```bash
./run-app.sh start      # Khởi chạy production
./run-app.sh dev        # Khởi chạy development
./run-app.sh stop       # Dừng ứng dụng
./run-app.sh logs       # Xem logs
./run-app.sh status     # Kiểm tra trạng thái
./run-app.sh help       # Xem tất cả lệnh
```

## 📖 Tài liệu

- 📋 **[Tổng quan dự án](docs/PROJECT_OVERVIEW.md)** - Thông tin chi tiết về dự án
- 🐳 **[Hướng dẫn Docker](DOCKER_README.md)** - Setup và troubleshooting Docker
- 🔧 **[Backend Guide](be/se-cnpm-beelifeventures/README.md)** - API documentation
- 🎨 **[Frontend Guide](fe/README.md)** - Component & development guide

## 🛠️ Công nghệ

| Component | Technology | Version |
|-----------|------------|---------|
| Frontend | Next.js + TypeScript | 15.x |
| Backend | Spring Boot + Java | 3.x / 17 |
| Database | MySQL | 8.0 |
| Container | Docker + Compose | Latest |

## 🎯 Tính năng chính

- ✅ **Quản lý sản phẩm** - CRUD operations
- ✅ **Giỏ hàng thông minh** - Real-time updates
- ✅ **Xác thực JWT** - Secure authentication
- ✅ **Dashboard admin** - Analytics & management
- ✅ **Responsive design** - Mobile-friendly UI
- ✅ **Docker deployment** - Easy containerization

## 👥 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Made with ❤️ by BeeLife Team**  
📧 Contact: [team@beelife.vn](mailto:team@beelife.vn) 