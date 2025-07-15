# Hướng Dẫn Setup Auto Deploy lên VPS

## 📋 Yêu Cầu

- VPS với Ubuntu 20.04+ hoặc tương đương
- Docker và Docker Compose đã cài đặt
- Git đã cài đặt
- Port 3000 (Frontend) và 8080 (Backend) đã mở

## 🔧 Setup VPS

### 1. Cài đặt Docker (nếu chưa có)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Tạo SSH Key cho GitHub Actions

```bash
# Tạo SSH key mới (không đặt passphrase)
ssh-keygen -t ed25519 -f ~/.ssh/github_actions -N ""

# Copy public key vào authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# Hiển thị private key để copy vào GitHub Secrets
cat ~/.ssh/github_actions
```

### 3. Copy Script Deploy lên VPS

```bash
# Tạo thư mục scripts
mkdir -p ~/scripts

# Tạo file deploy script
nano ~/scripts/deploy-vps.sh

# Copy nội dung từ scripts/deploy-vps.sh vào đây
# Sau đó chmod để có thể execute
chmod +x ~/scripts/deploy-vps.sh
```

## 🔑 Setup GitHub Secrets

1. Vào repository trên GitHub
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Thêm các secrets sau:

### VPS_HOST
- **Name**: `VPS_HOST`
- **Value**: IP của VPS (ví dụ: `123.456.789.0`)

### VPS_USERNAME
- **Name**: `VPS_USERNAME`  
- **Value**: Username SSH (thường là `root` hoặc `ubuntu`)

### VPS_SSH_KEY
- **Name**: `VPS_SSH_KEY`
- **Value**: Private key từ bước 2 (copy toàn bộ nội dung)

## 🚀 Test Deploy

### 1. Push code lên main

```bash
git add .
git commit -m "feat: add auto deploy"
git push origin main
```

### 2. Kiểm tra GitHub Actions

- Vào tab Actions trên GitHub
- Xem workflow đang chạy
- Job `deploy` sẽ chỉ chạy khi push lên `main`

### 3. Kiểm tra trên VPS

```bash
# SSH vào VPS
ssh user@your-vps-ip

# Kiểm tra containers
docker-compose ps

# Xem logs
docker-compose logs -f
```

## 🔒 Bảo Mật

### 1. Giới hạn SSH Key

Thêm vào đầu file `~/.ssh/authorized_keys`:

```
command="cd ~/se-2025 && ~/scripts/deploy-vps.sh",no-port-forwarding,no-X11-forwarding,no-agent-forwarding ssh-ed25519 AAAAC3... (your key)
```

### 2. Firewall

```bash
# Chỉ mở port cần thiết
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 3000/tcp  # Frontend
sudo ufw allow 8080/tcp  # Backend
sudo ufw enable
```

### 3. Sử dụng Nginx Reverse Proxy (Tùy chọn)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🛠️ Troubleshooting

### Lỗi Permission Denied

```bash
# Fix quyền cho docker
sudo usermod -aG docker $USER
newgrp docker
```

### Lỗi Port đã sử dụng

```bash
# Kiểm tra port
sudo netstat -tlnp | grep :3000
sudo netstat -tlnp | grep :8080

# Stop service đang dùng port
sudo systemctl stop service-name
```

### Rollback khi deploy fail

```bash
# Vào thư mục backup
cd ~/backups/se-2025

# Tìm backup gần nhất
ls -la

# Restore
cd ~/se-2025
tar -xzf ~/backups/se-2025/backup_TIMESTAMP.tar.gz
docker-compose up -d
```

## 📊 Monitoring (Tùy chọn)

### Cài đặt Portainer

```bash
docker volume create portainer_data
docker run -d -p 9000:9000 \
  --name=portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce
```

Truy cập: `http://your-vps:9000`

### Health Check Endpoint

Thêm vào backend:

```java
@GetMapping("/health")
public ResponseEntity<Map<String, String>> health() {
    Map<String, String> status = new HashMap<>();
    status.put("status", "UP");
    status.put("timestamp", Instant.now().toString());
    return ResponseEntity.ok(status);
}
```

## 🎉 Hoàn Thành!

Sau khi setup xong, mỗi lần push code lên `main`:
1. GitHub Actions sẽ tự động build và test
2. Nếu pass hết test, sẽ tự động deploy lên VPS
3. Script sẽ backup, update và health check
4. Nếu fail sẽ rollback tự động 