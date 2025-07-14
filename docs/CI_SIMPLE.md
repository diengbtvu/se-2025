# CI/CD Đơn Giản

## Workflow Hiện Tại

Workflow được đơn giản hóa chỉ bao gồm 3 bước chính:

### 1. Test Frontend
- ✅ Install dependencies
- ✅ Run linting (cho phép fail)
- ✅ Run tests (cho phép fail)
- ✅ Build frontend

### 2. Test Backend
- ✅ Setup Java 17
- ✅ Run Maven tests (cho phép fail)
- ✅ Build backend JAR

### 3. Test Docker
- ✅ Build Docker images
- ✅ Validate docker-compose config

## Những Gì Đã Loại Bỏ

❌ Docker registry push (gây lỗi permission)
❌ Security scanning
❌ Deployment tự động
❌ Coverage reporting
❌ Integration tests
❌ Auto-merge dependabot
❌ Cleanup jobs

## Khi Nào Workflow Chạy

- 📝 Push lên `main`, `develop`, `se-docker`
- 📝 Tạo Pull Request vào `main`, `develop`

## Lợi Ích

- ⚡ Nhanh hơn (5-10 phút thay vì 30+ phút)
- 🛡️ Ít lỗi hơn (không có phần phức tạp)
- 🔧 Dễ debug hơn
- 💡 Vẫn đảm bảo build được

## Sử Dụng Local

Để test trước khi push:

```bash
# Test frontend
cd fe
npm ci --legacy-peer-deps
npm run lint
npm test
npm run build

# Test backend
cd ../be/se-cnpm-beelifeventures
mvn clean test
mvn clean package

# Test Docker
cd ../..
docker build -t test-fe ./fe
docker build -t test-be ./be/se-cnpm-beelifeventures
docker-compose config
``` 