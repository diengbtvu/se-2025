# BeeLife Ventures - Frontend

## 🚀 Giới thiệu

BeeLife Ventures là ứng dụng thương mại điện tử chuyên về các sản phẩm nuôi ong thông minh. Frontend được xây dựng bằng Next.js 14 với TypeScript, Tailwind CSS và các công nghệ hiện đại.

### Tính năng chính:
- ✅ **Quản lý User** (đăng ký, đăng nhập, profile)
- ✅ **Quản lý Sản phẩm** (hiển thị, tìm kiếm, phân loại)
- ✅ **Giỏ hàng và Đơn hàng** (thêm vào giỏ, mua ngay, theo dõi)
- ✅ **Admin Dashboard** (quản lý sản phẩm, đơn hàng, người dùng)
- ✅ **Responsive Design** (mobile-first)
- ✅ **JWT Authentication**
- ✅ **Testing** (Jest, Testing Library)

## 🛠️ Công nghệ sử dụng

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context + Custom Hooks
- **Testing:** Jest + Testing Library
- **UI Components:** Framer Motion, Custom Components
- **API:** RESTful API với Axios
- **Authentication:** JWT Token

## 📋 Yêu cầu hệ thống

- Node.js 18+ 
- npm hoặc yarn
- Git

## 🚀 Cách chạy trên máy local

### 1. Clone repository
```bash
git clone <repository-url>
cd se-2025/fe
```

### 2. Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### 3. Cấu hình môi trường
Tạo file `.env.local` trong thư mục `fe/`:
```env


```

### 4. Chạy development server
```bash
npm run dev
# hoặc
yarn dev
```

### 5. Truy cập ứng dụng
Mở trình duyệt và truy cập: `http://localhost:3000`

## 🐳 Cách chạy với Docker

### 1. Build Docker image
```bash
docker build -t beelife-frontend .
```

### 2. Chạy container
```bash
docker run -p 3000:3000 beelife-frontend
```

### 3. Hoặc sử dụng docker-compose (nếu có)
```bash
docker-compose up --build
```

## 🧪 Chạy Tests

### Chạy tất cả tests
```bash
npm test
```

### Chạy tests với coverage
```bash
npm run test:coverage
```

### Chạy tests trong watch mode
```bash
npm run test:watch
```

### Chạy tests cụ thể
```bash
npm test -- --testNamePattern="Login"
```

## 📁 Cấu trúc dự án

```
fe/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── login/             # Trang đăng nhập/đăng ký
│   │   ├── products/          # Trang sản phẩm
│   │   ├── cart/              # Trang giỏ hàng
│   │   ├── orders/            # Trang đơn hàng
│   │   └── admin/             # Trang admin
│   ├── components/            # React components
│   │   ├── common/           # Components dùng chung
│   │   ├── layouts/          # Layout components
│   │   └── 3d/              # 3D components
│   ├── hooks/                # Custom React hooks
│   ├── services/             # API services
│   ├── types/                # TypeScript types
│   ├── utils/                # Utility functions
│   └── __tests__/           # Test files
├── public/                   # Static files
├── jest.config.js           # Jest configuration
├── tailwind.config.js       # Tailwind configuration
└── package.json             # Dependencies
```

## 🎯 Những gì đã hoàn thành

### ✅ **Authentication & Authorization**
- [x] Đăng nhập/đăng ký với validation
- [x] JWT token management
- [x] Protected routes
- [x] User profile management

### ✅ **Product Management**
- [x] Hiển thị danh sách sản phẩm
- [x] Chi tiết sản phẩm
- [x] Thêm vào giỏ hàng
- [x] Mua ngay (buy now)
- [x] Tìm kiếm và lọc sản phẩm

### ✅ **Cart & Orders**
- [x] Giỏ hàng với CRUD operations
- [x] Đặt hàng với validation
- [x] Theo dõi trạng thái đơn hàng
- [x] Lịch sử đơn hàng

### ✅ **Admin Dashboard**
- [x] Quản lý sản phẩm (CRUD)
- [x] Quản lý đơn hàng
- [x] Quản lý người dùng
- [x] Thống kê doanh thu
- [x] Dashboard analytics

### ✅ **UI/UX Features**
- [x] Responsive design (mobile-first)
- [x] Dark/Light theme support
- [x] Loading states và error handling
- [x] Animations với Framer Motion
- [x] 3D product cards
- [x] Modern UI components

### ✅ **Testing**
- [x] Unit tests cho components
- [x] Integration tests cho pages
- [x] Hook testing
- [x] API testing
- [x] Test coverage reporting

### ✅ **Performance & Optimization**
- [x] Image optimization
- [x] Code splitting
- [x] Lazy loading
- [x] SEO optimization
- [x] Error boundaries

### ✅ **Google Drive API Integration**
- [x]  Tải dữ liệu tĩnh (hình ảnh, tệp đính kèm) lên Google Drive thông qua Google Drive API.
- [x]  Tự động xác thực OAuth2 và lưu trữ file trong thư mục được chỉ định trên Google Drive.
- [x]  Phân quyền chia sẻ file nếu cần (public/private).
- [x] Dùng trong các trường hợp: người dùng tải ảnh sản phẩm, hóa đơn, chứng từ, v.v.

### ✅ **Gemini AI Chatbot (Google Generative AI API)**
- [x]  Tích hợp AI chatbot sử dụng Google Gemini API để hỗ trợ khách hàng ngay trong trang web.
- [x]  Hỏi đáp tự nhiên về sản phẩm, tình trạng đơn hàng, hỗ trợ sử dụng website...
- [x]  Hỗ trợ đa ngôn ngữ và phản hồi theo thời gian thực (real-time chat).


## 🔧 Scripts có sẵn

```bash
# Development
npm run dev          # Chạy development server
npm run build        # Build production
npm run start        # Chạy production server

# Testing
npm test             # Chạy tests
npm run test:watch   # Chạy tests trong watch mode
npm run test:coverage # Chạy tests với coverage

# Linting & Formatting
npm run lint         # Kiểm tra code style
npm run lint:fix     # Tự động fix code style
```

## 🌐 API Endpoints

Frontend kết nối với backend qua các endpoints:

- **Authentication:** `/api/auth/*`
- **Products:** `/api/products/*`
- **Cart:** `/api/cart/*`
- **Orders:** `/api/orders/*`
- **Admin:** `/api/admin/*`

## 🐛 Troubleshooting

### Lỗi thường gặp:

1. **Port 3000 đã được sử dụng:**
   ```bash
   # Tìm process đang sử dụng port 3000
   lsof -i :3000
   # Kill process
   kill -9 <PID>
   ```

2. **API không kết nối được:**
   - Kiểm tra backend có đang chạy không
   - Kiểm tra URL trong `.env.local`
   - Kiểm tra CORS settings

3. **Tests fail:**
   ```bash
   # Clear Jest cache
   npm test -- --clearCache
   ```

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs trong terminal
2. Kiểm tra browser console
3. Đảm bảo backend đang chạy
4. Kiểm tra network tab trong DevTools

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy lên Vercel
```

### Docker
```bash
docker build -t beelife-frontend .
docker run -p 3000:3000 beelife-frontend
```

---

**Tác giả:** BeeLife Ventures Team  
**Phiên bản:** 1.0.0  
**Cập nhật:** 2024
