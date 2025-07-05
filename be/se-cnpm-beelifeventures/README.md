# BeeLifeVentures - E-commerce Backend API
## 🚀 Giới thiệu

BeeLifeVentures be là một hệ thống backend cho ứng dụng thương mại điện tử, được xây dựng bằng Spring Boot. Hệ thống cung cấp các chức năng quản lý sản phẩm, đơn hàng, người dùng và thống kê cho admin.

### Tính năng chính:
- ✅ Quản lý User (đăng ký, đăng nhập, profile)
- ✅ Quản lý SP (CRUD)
- ✅ Cart và Orders
- ✅ Mânager (admin dashboard, thống kê)
- ✅ Báo cáo doanh thu
- ✅ JWT Authentication
- ✅ API Documentation với Swagger

## 👥 Tác giả phát triển

**Dự án backend được phát triển bởi:**
- **Trần Minh Điền** - Backend Developer
  - GitHub: [@diengbtvu](https://github.com/diengbtvu)
- **Nguyễn Văn Hoàng** - Backend Developer
  - GitHub: [@vanhoangtvu](https://github.com/vanhoangtvu)

## 📋 Mục lục

1. [🚀 Giới thiệu](#-giới-thiệu)
2. [👥 Tác giả phát triển](#-tác-giả-phát-triển)
3. [⚙️ Cài đặt và chạy](#️-cài-đặt-và-chạy)
4. [🏗️ Cấu trúc dự án](#️-cấu-trúc-dự-án)
5. [📖 Hướng dẫn API](#-hướng-dẫn-api)
6. [👑 Hướng dẫn Admin](#-hướng-dẫn-admin)
7. [🗄️ Database Schema](#️-database-schema)
8. [📚 Hướng dẫn sử dụng](#-hướng-dẫn-sử-dụng)
9. [🔄 Workflow](#-workflow)
10. [🔍 Monitoring và Troubleshooting](#-monitoring-và-troubleshooting)
11. [🐳 Docker Commands](#-docker-commands-hữu-ích)

## ⚙️ Cài đặt và chạy

### Yêu cầu hệ thống:
- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Docker (optional)

### 1. Clone repository:
```bash
git clone <repository-url>
cd BeeLifeVentures
```

### 2. Cấu hình database:
Chỉnh sửa file `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/beelifeventure
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 3. Chạy với Maven:
```bash
mvn clean install
mvn spring-boot:run
```

### 4. Chạy với Docker:
Chỉ cần chạy một lệnh duy nhất:

```bash
docker-compose up --build
```

Hoặc chạy ở chế độ detached (chạy ngầm):

```bash
docker-compose up --build -d
```

Docker sẽ tự động:
- Build source code bằng Maven
- Đóng gói ứng dụng thành file JAR
- Tạo image Docker với ứng dụng
- Chạy container từ image vừa tạo

### 5. Truy cập ứng dụng:
- API Base URL: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`

## � Hướng dẫn Admin

### Đăng nhập Admin
1. **Tài khoản mặc định:**
   - Username: `admin`
   - Password: `admin123` (nên đổi sau lần đăng nhập đầu tiên)

2. **Đăng nhập qua API:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "admin",
    "password": "admin123"
  }'
```

3. **Lưu JWT Token:** Sao chép token từ response để sử dụng cho các API admin

### Dashboard Admin
Truy cập dashboard để xem tổng quan hệ thống:
```bash
curl -X GET http://localhost:8080/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Thông tin dashboard bao gồm:**
- 📊 Tổng số người dùng
- 🛒 Tổng số đơn hàng
- 💰 Doanh thu tổng
- 📦 Số sản phẩm đang bán
- 👥 Lượt truy cập hiện tại (24h)

### Quản lý người dùng

#### Xem danh sách users
```bash
# Lấy tất cả users (không phân trang)
curl -X GET http://localhost:8080/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Lấy users có phân trang
curl -X GET "http://localhost:8080/api/admin/users/paginated?page=0&size=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Xem lượt truy cập hiện tại
```bash
curl -X GET http://localhost:8080/api/admin/active-users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Xóa người dùng
```bash
curl -X DELETE http://localhost:8080/api/admin/users/{userId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Quản lý sản phẩm

#### Tạo sản phẩm mới
```bash
curl -X POST http://localhost:8080/api/admin/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mật ong rừng U Minh",
    "description": "Mật ong nguyên chất từ rừng U Minh",
    "price": 180000,
    "stockQuantity": 50,
    "category": "Mật ong",
    "imageUrl": "https://example.com/honey.jpg"
  }'
```

#### Cập nhật sản phẩm
```bash
curl -X PUT http://localhost:8080/api/admin/products/{productId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mật ong rừng U Minh (Cập nhật)",
    "price": 200000,
    "stockQuantity": 30
  }'
```

#### Xóa sản phẩm
```bash
curl -X DELETE http://localhost:8080/api/admin/products/{productId} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Quản lý đơn hàng

#### Xem tất cả đơn hàng
```bash
curl -X GET "http://localhost:8080/api/admin/orders?page=0&size=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Cập nhật trạng thái đơn hàng
```bash
curl -X PUT http://localhost:8080/api/admin/orders/{orderId}/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "SHIPPED"
  }'
```

**Các trạng thái đơn hàng:**
- `PENDING` - Chờ xác nhận
- `PROCESSING` - Đang xử lý
- `SHIPPED` - Đã giao shipper
- `DELIVERED` - Đã giao hàng
- `CANCELLED` - Đã hủy

### Báo cáo doanh thu

#### Báo cáo theo khoảng thời gian
```bash
curl -X GET "http://localhost:8080/api/admin/revenue/report?fromDate=2025-01-01&toDate=2025-12-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Tips cho Admin

1. **Bảo mật:**
   - Đổi mật khẩu admin ngay sau lần đăng nhập đầu tiên
   - Không share JWT token với người khác
   - Token có thời hạn, cần login lại khi hết hạn

2. **Monitoring:**
   - Kiểm tra lượt truy cập hàng ngày qua endpoint `/admin/active-users`
   - Theo dõi doanh thu qua báo cáo định kỳ
   - Quản lý tồn kho sản phẩm thường xuyên

3. **Workflow đơn hàng:**
   ```
   PENDING → PROCESSING → SHIPPED → DELIVERED
                ↓
            CANCELLED (nếu cần)
   ```

4. **Sử dụng Swagger UI:**
   - Truy cập `http://localhost:8080/swagger-ui/index.html`
   - Dễ dàng test API và xem documentation
   - Nhập JWT token vào phần "Authorize"

## �🛠 Công nghệ sử dụng

### Backend Framework:
- **Spring Boot 3.4.3** - Framework chính
- **Spring Security** - Bảo mật và xác thực
- **Spring Data JPA** - ORM và database operations
- **Hibernate** - ORM implementation

### Database:
- **MySQL 8** - Cơ sở dữ liệu chính
- **H2** - Database cho testing

### Libraries & Tools:
- **JWT (jjwt 0.11.5)** - JSON Web Token
- **ModelMapper 3.1.1** - Object mapping
- **Lombok** - Code generation
- **Swagger/OpenAPI 3** - API documentation
- **Maven** - Build tool
- **Docker** - Containerization

## 📁 Cấu trúc dự án

```
src/main/java/com/beelifeventures/BeeLifeVentures/
│
├── api/v1/                          # REST Controllers
│   ├── Admin.java                   # Admin management endpoints
│   ├── Auth.java                    # Authentication endpoints
│   ├── Cart.java                    # Shopping cart endpoints
│   ├── Orders.java                  # Order management endpoints
│   └── Product.java                 # Product endpoints
│
├── config/                          # Configuration classes
│   ├── ModelMapperConfig.java       # ModelMapper configuration
│   ├── PasswordConfig.java          # Password encoder configuration
│   ├── SecurityConfig.java          # Spring Security configuration
│   └── SwaggerConfig.java           # Swagger/OpenAPI configuration
│
├── controller/                      # Additional controllers
│   └── UtilController.java          # Utility endpoints
│
├── model/dto/                       # Data Transfer Objects
│   ├── AdminDashboardDTO.java       # Admin dashboard data
│   ├── AdminOrderStatusUpdateDTO.java
│   ├── AdminRevenueReportDTO.java   # Revenue report data
│   ├── AdminUserManagementDTO.java  # User management data
│   ├── CartItemDTO.java             # Cart item data
│   ├── CustomerUpdateDTO.java       # Customer update data
│   ├── LoginDTO.java                # Login request data
│   ├── OrderDetailResponseDTO.java  # Order detail response
│   ├── ProductDTO.java              # Product data
│   └── UserAccountDTO.java          # User account data
│
├── repository/                      # Data Access Layer
│   ├── entity/                      # JPA Entities
│   │   ├── CartEntity.java          # Shopping cart entity
│   │   ├── CartItemEntity.java      # Cart item entity
│   │   ├── CustomerEntity.java      # Customer entity
│   │   ├── OrderDetailEntity.java   # Order detail entity
│   │   ├── OrdersEntity.java        # Order entity
│   │   ├── ProductEntity.java       # Product entity
│   │   └── UserAccountEntity.java   # User account entity
│   │
│   ├── CartRepository.java          # Cart data access
│   ├── CustomerRepository.java      # Customer data access
│   ├── OrdersRepository.java        # Orders data access
│   ├── ProductRepository.java       # Product data access
│   └── UserAccountRepository.java   # User account data access
│
├── security/                        # Security components
│   ├── JwtFilter.java               # JWT authentication filter
│   ├── JwtSecurityConfig.java       # JWT security configuration
│   └── JwtUtil.java                 # JWT utility methods
│
├── service/                         # Business Logic Layer
│   ├── impl/                        # Service implementations
│   │   └── AdminServiceImpl.java    # Admin service implementation
│   ├── AdminService.java            # Admin service interface
│   ├── OrdersService.java           # Orders service
│   ├── ProductService.java          # Product service
│   └── UserAccountService.java      # User account service
│
└── BeeLifeVenturesApplication.java  # Main application class
```

## 🗄 Cơ sở dữ liệu

### Database Entity Relationship
┌───────────────────┐         ┌───────────────────┐
│    USER_ACCOUNT   │         │     CUSTOMER      │
├───────────────────┤  1:1    ├───────────────────┤
│ 🔑 id (PK)       │◀───────▶│ 🔑 id (PK)       │
│ 👤 username      │         │ 📝 name          │
│ 🔒 password      │         │ 📧 email         │
│ 👑 role          │         │ 📱 phone         │
│ 📊 status        │         │ 🏠 address       │
│ 📅 created_at    │         │ 🔗 user_id (FK)  │
└───────────────────┘         └───────────────────┘
                                       │
                                    1:1 │
                                       ▼
                              ┌───────────────────┐
                              │       CART        │
                              ├───────────────────┤
                              │ 🔑 id (PK)       │
                              │ 🔗 customer_id   │
                              │ 📅 created_at    │
                              └───────────────────┘
                                       │
                                    1:N │
                                       ▼
┌───────────────────┐         ┌───────────────────┐
│     PRODUCT       │         │    CART_ITEM      │
├───────────────────┤  1:N    ├───────────────────┤
│ 🔑 id (PK)       │◀───────▶│ 🔑 id (PK)       │
│ 🏷️ name          │         │ 🔗 cart_id (FK)  │
│ 📝 description   │         │ 🔗 product_id    │
│ 💰 price         │         │ 📊 quantity      │
│ 📦 stock         │         │ 💰 price         │
│ 📂 category      │         └───────────────────┘
│ 🖼️ image_url     │
└───────────────────┘
         │                    ┌───────────────────┐
      1:N│                    │      ORDERS       │
         │            ┌──────▶├───────────────────┤
         │            │       │ 🔑 id (PK)       │
         │            │ 1:N   │ 🔗 customer_id   │
         │            │       │ 💵 total_amount  │
         │            │       │ 📊 status        │
         │            │       │ 🏠 shipping_addr │
         │            │       │ 💳 payment_method│
         │            │       │ 📅 created_at    │
         │            │       └───────────────────┘
         │            │                │
         │            │             1:N│
         │            │                ▼
         │            │       ┌───────────────────┐
         │            │       │   ORDER_DETAIL    │
         │            │       ├───────────────────┤
         └────────────┼──────▶│ 🔑 id (PK)       │
                      │       │ 🔗 order_id (FK) │
                      │       │ 🔗 product_id    │
                      │       │ 📊 quantity      │
                      │       │ 💰 unit_price    │
                      │       │ 💵 total_price   │
                      │       └───────────────────┘
                      │
                      └────── CUSTOMER (1:N)
```
### Cấu trúc Database

#### Bảng `user_account` - Quản lý tài khoản người dùng
| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|--------------|--------|
| id | BIGINT (PK) | ID duy nhất của tài khoản |
| user_name | VARCHAR(255) | Tên đăng nhập (duy nhất) |
| password | VARCHAR(255) | Mật khẩu đã mã hóa |
| role | VARCHAR(50) | Vai trò (USER/ADMIN) |
| status | VARCHAR(20) | Trạng thái tài khoản (ACTIVE/INACTIVE/BANNED) |
| created_at | DATETIME | Thời gian tạo tài khoản |
| last_login | DATETIME | Lần đăng nhập cuối cùng |

#### Bảng `customer` - Thông tin khách hàng
| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|--------------|--------|
| id | BIGINT (PK) | ID duy nhất của khách hàng |
| name | VARCHAR(255) | Họ tên khách hàng |
| email | VARCHAR(255) | Địa chỉ email |
| phone_number | VARCHAR(20) | Số điện thoại |
| address | TEXT | Địa chỉ |
| user_account_id | BIGINT (FK) | Liên kết với bảng user_account |

#### Bảng `product` - Quản lý sản phẩm
| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|--------------|--------|
| id | BIGINT (PK) | ID duy nhất của sản phẩm |
| name | VARCHAR(255) | Tên sản phẩm |
| description | TEXT | Mô tả chi tiết sản phẩm |
| price | DECIMAL(10,2) | Giá sản phẩm |
| stock_quantity | INT | Số lượng tồn kho |
| category | VARCHAR(100) | Danh mục sản phẩm |
| image_url | VARCHAR(500) | Đường dẫn hình ảnh |
| status | VARCHAR(20) | Trạng thái sản phẩm (ACTIVE/INACTIVE) |
| created_at | DATETIME | Thời gian tạo |
| updated_at | DATETIME | Thời gian cập nhật cuối |

#### Bảng `cart` - Giỏ hàng
| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|--------------|--------|
| id | BIGINT (PK) | ID duy nhất của giỏ hàng |
| customer_id | BIGINT (FK) | Liên kết với bảng customer |
| created_at | DATETIME | Thời gian tạo giỏ hàng |
| updated_at | DATETIME | Thời gian cập nhật cuối |

#### Bảng `cart_item` - Chi tiết giỏ hàng
| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|--------------|--------|
| id | BIGINT (PK) | ID duy nhất của item |
| cart_id | BIGINT (FK) | Liên kết với bảng cart |
| product_id | BIGINT (FK) | Liên kết với bảng product |
| quantity | INT | Số lượng sản phẩm |
| price | DECIMAL(10,2) | Giá tại thời điểm thêm vào giỏ |

#### Bảng `orders` - Đơn hàng
| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|--------------|--------|
| id | BIGINT (PK) | ID duy nhất của đơn hàng |
| customer_id | BIGINT (FK) | Liên kết với bảng customer |
| total_amount | DECIMAL(10,2) | Tổng giá trị đơn hàng |
| status | VARCHAR(50) | Trạng thái đơn hàng (PENDING/PROCESSING/SHIPPED/DELIVERED/CANCELLED) |
| shipping_address | TEXT | Địa chỉ giao hàng |
| payment_method | VARCHAR(50) | Phương thức thanh toán |
| notes | TEXT | Ghi chú đơn hàng |
| created_at | DATETIME | Thời gian tạo đơn |
| updated_at | DATETIME | Thời gian cập nhật cuối |

#### Bảng `order_detail` - Chi tiết đơn hàng
| Thuộc tính | Kiểu dữ liệu | Mô tả |
|------------|--------------|--------|
| id | BIGINT (PK) | ID duy nhất của chi tiết |
| order_id | BIGINT (FK) | Liên kết với bảng orders |
| product_id | BIGINT (FK) | Liên kết với bảng product |
| quantity | INT | Số lượng sản phẩm |
| unit_price | DECIMAL(10,2) | Giá đơn vị |
| total_price | DECIMAL(10,2) | Tổng giá (quantity × unit_price) |

### Mối quan hệ giữa các bảng
- `user_account` (1) ↔ (1) `customer`: Một tài khoản có một thông tin khách hàng
- `customer` (1) ↔ (1) `cart`: Một khách hàng có một giỏ hàng
- `cart` (1) ↔ (n) `cart_item`: Một giỏ hàng có nhiều sản phẩm
- `product` (1) ↔ (n) `cart_item`: Một sản phẩm có thể có trong nhiều giỏ hàng
- `customer` (1) ↔ (n) `orders`: Một khách hàng có thể có nhiều đơn hàng
- `orders` (1) ↔ (n) `order_detail`: Một đơn hàng có nhiều chi tiết sản phẩm
- `product` (1) ↔ (n) `order_detail`: Một sản phẩm có thể có trong nhiều đơn hàng

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Đăng ký tài khoản mới
```json
{
  "userName": "string",
  "password": "string",
  "name": "string",
  "email": "string",
  "phoneNumber": "string"
}
```

#### POST /api/auth/login
Đăng nhập
```json
{
  "userName": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "token": "Bearer eyJhbGciOiJIUzI1NiJ9...",
  "role": "USER|ADMIN",
  "message": "Login successful"
}
```

#### GET /api/auth/profile
Lấy thông tin profile (yêu cầu JWT token)

#### PUT /api/auth/profile
Cập nhật thông tin profile

### Product Endpoints

#### GET /api/products
Lấy danh sách sản phẩm (có phân trang)
- Query params: `page`, `size`, `category`, `keyword`

#### GET /api/products/{id}
Lấy chi tiết sản phẩm

#### GET /api/products/search
Tìm kiếm sản phẩm
- Query params: `keyword`, `category`, `minPrice`, `maxPrice`

### Cart Endpoints

#### GET /api/cart
Lấy giỏ hàng hiện tại (yêu cầu JWT token)

#### POST /api/cart/add
Thêm sản phẩm vào giỏ hàng
```json
{
  "productId": 1,
  "quantity": 2
}
```

#### PUT /api/cart/update/{itemId}
Cập nhật số lượng sản phẩm trong giỏ hàng
```json
{
  "quantity": 3
}
```

#### DELETE /api/cart/remove/{itemId}
Xóa sản phẩm khỏi giỏ hàng

### Orders Endpoints

#### POST /api/orders/checkout
Tạo đơn hàng từ giỏ hàng
```json
{
  "shippingAddress": "string",
  "paymentMethod": "COD|BANK_TRANSFER",
  "notes": "string"
}
```

#### GET /api/orders
Lấy danh sách đơn hàng của user (yêu cầu JWT token)

#### GET /api/orders/{id}
Lấy chi tiết đơn hàng

### Admin Endpoints

#### GET /api/admin/dashboard
Lấy thông tin dashboard admin

#### GET /api/admin/users
Lấy danh sách tất cả users (không phân trang)

#### GET /api/admin/users/paginated
Lấy danh sách users (có phân trang)
- Query params: `page`, `size`

#### GET /api/admin/active-users
Lấy số lượt truy cập hiện tại (24h qua)
**Response:**
```json
{
  "activeUsersCount": 15,
  "description": "Số lượt truy cập trong 24 giờ qua"
}
```

#### DELETE /api/admin/users/{id}
Xóa người dùng

#### GET /api/admin/products
Lấy danh sách sản phẩm cho admin

#### POST /api/admin/products
Tạo sản phẩm mới
```json
{
  "name": "string",
  "description": "string",
  "price": 0,
  "stockQuantity": 0,
  "category": "string",
  "imageUrl": "string"
}
```

#### PUT /api/admin/products/{id}
Cập nhật sản phẩm

#### DELETE /api/admin/products/{id}
Xóa sản phẩm

#### GET /api/admin/orders
Lấy danh sách tất cả đơn hàng

#### PUT /api/admin/orders/{id}/status
Cập nhật trạng thái đơn hàng
```json
{
  "status": "PENDING|PROCESSING|SHIPPED|DELIVERED|CANCELLED"
}
```

#### GET /api/admin/revenue/report
Lấy báo cáo doanh thu
- Query params: `fromDate`, `toDate` (format: yyyy-MM-dd)

## 🔐 Authentication & Authorization

### JWT Token
- Tất cả các endpoint cần authentication đều yêu cầu JWT token trong header:
```
Authorization: Bearer <token>
```

### Roles:
- **USER**: Người dùng thông thường (cart, orders, profile)
- **ADMIN**: Quản trị viên (tất cả chức năng + quản lý)

### Security Features:
- Password encryption với BCrypt
- JWT token expiration
- Role-based access control
- CORS configuration
- Input validation

## 🔧 Hướng dẫn sử dụng

### 1. Workflow đăng ký và đăng nhập:
```
1. POST /api/auth/register → Tạo tài khoản
2. POST /api/auth/login → Lấy JWT token
3. Sử dụng token cho các API khác
```

### 2. Workflow mua hàng:
```
1. GET /api/products → Xem sản phẩm
2. POST /api/cart/add → Thêm vào giỏ hàng
3. GET /api/cart → Xem giỏ hàng
4. POST /api/orders/checkout → Đặt hàng
5. GET /api/orders → Theo dõi đơn hàng
```

### 3. Workflow admin:
```
1. Đăng nhập với tài khoản ADMIN
2. GET /api/admin/dashboard → Xem tổng quan
3. GET /api/admin/active-users → Xem lượt truy cập
4. Quản lý products, orders, users...
```

### 4. Environment Variables:
```properties
DB_URL=jdbc:mysql://host:port/database
DB_USERNAME=username
DB_PASSWORD=password
JWT_SECRET=your_secret_key
```

## 📊 Monitoring & Analytics

### Thống kê hiện có:
- Số lượng users đang hoạt động (24h qua)
- Tổng doanh thu theo khoảng thời gian
- Số lượng đơn hàng theo trạng thái
- Thông tin dashboard tổng quan

### Logs:
- SQL queries được log (development mode)
- Security events
- API access logs

## 🐛 Troubleshooting

### Lỗi thường gặp:

1. **Connection refused khi kết nối database:**
   - Kiểm tra MySQL service đã chạy
   - Kiểm tra connection string trong application.properties

2. **JWT token expired:**
   - Login lại để lấy token mới
   - Kiểm tra thời gian server

3. **403 Forbidden:**
   - Kiểm tra role của user
   - Đảm bảo token được gửi đúng format

4. **404 Not Found:**
   - Kiểm tra URL endpoint
   - Kiểm tra context path

## 🏃‍♂️ Các lệnh Docker hữu ích

- Dừng ứng dụng:
```bash
docker-compose down
```

- Xem logs:
```bash
docker-compose logs
```

- Xem logs theo thời gian thực:
```bash
docker-compose logs -f
```

- Rebuild lại image:
```bash
docker-compose build --no-cache
```

- Xóa tất cả containers và images:
```bash
docker system prune -a
```

## 📝 Phiên bản và Cập nhật

### Version 1.0.0:
- ✅ Basic CRUD operations
- ✅ Authentication & Authorization
- ✅ Shopping cart functionality
- ✅ Order management
- ✅ Admin panel
- ✅ API documentation

### Tính năng sắp tới:
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] File upload for product images
- [ ] Advanced search and filtering
- [ ] Real-time notifications
- [ ] Mobile app API support

## 👥 Đóng góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Liên hệ

- **Trần Minh Điền:**
  - GitHub: [@diengbtvu](https://github.com/diengbtvu)
- **Nguyễn Văn Hoàng:**
  - GitHub: [@vanhoangtvu](https://github.com/vanhoangtvu)

---

*Tài liệu này được cập nhật lần cuối: July 6, 2025*
