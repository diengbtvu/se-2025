# Auto Save Guide - BeeLife Frontend

## 🚀 Cách chạy với Auto Save

### Option 1: Sử dụng script (Khuyến nghị)
```bash
chmod +x run-autosave.sh
./run-autosave.sh
```

### Option 2: Sử dụng Docker Compose
```bash
docker-compose up frontend-fast
```

### Option 3: Sử dụng Docker trực tiếp
```bash
docker build -f Dockerfile.fast -t beelife-frontend:fast .
docker run -d --name beelife-frontend-fast -p 3002:3000 \
  -v $(pwd):/app -v /app/node_modules \
  -e WATCHPACK_POLLING=true -e CHOKIDAR_USEPOLLING=true \
  beelife-frontend:fast
```

## ⚡ Tính năng Auto Save

### ✅ Đã bật:
- **File Watching**: Tự động phát hiện thay đổi file
- **Hot Reload**: Tự động reload khi save
- **Turbo Mode**: Next.js turbo để tăng tốc
- **Polling**: Tối ưu cho Docker environment
- **Volume Mounting**: Sync code giữa host và container

### 🔧 Cấu hình:
- **Port**: http://localhost:3002
- **Polling Interval**: 1000ms
- **Aggregate Timeout**: 300ms
- **Environment**: Development mode

## 📝 Cách sử dụng:

1. **Chạy container**:
   ```bash
   ./run-autosave.sh
   ```

2. **Mở browser**: http://localhost:3002

3. **Edit code**: Thay đổi bất kỳ file nào trong `src/`

4. **Auto reload**: Browser sẽ tự động reload

## 🛠️ Troubleshooting:

### Nếu auto save không hoạt động:
```bash
# Restart container
docker-compose restart frontend-fast

# Check logs
docker-compose logs frontend-fast

# Rebuild container
docker-compose build --no-cache frontend-fast
```

### Nếu chậm:
```bash
# Giảm polling interval trong next.config.mjs
poll: 500,  # Thay vì 1000
```

### Nếu port bị conflict:
```bash
# Thay đổi port trong docker-compose.yml
ports:
  - "3003:3000"  # Thay vì 3002:3000
```

## 🎯 Tips:

1. **IDE Settings**: Bật auto save trong IDE của bạn
2. **File Types**: Auto save hoạt động với tất cả file types
3. **Performance**: Turbo mode giúp reload nhanh hơn
4. **Debugging**: Check logs nếu có vấn đề

## 🛑 Dừng Auto Save:
```bash
docker-compose down
``` 