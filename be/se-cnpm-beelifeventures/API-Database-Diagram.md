# Sơ đồ Tương tác API - Database BeeLifeVentures Backend (Enhanced)

## 🏗️ Kiến trúc Hệ thống

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client/UI     │───▶│   Controller    │───▶│   Service       │───▶│   Repository    │
│   (React/Vue)   │    │   (@RestController) │    │   (@Service)    │    │   (JpaRepository)│
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │                        │
         │                        ▼                        ▼                        ▼
         │              ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
         │              │   JWT Filter    │    │      DTO        │    │     Entity      │
         │              │  (Security)     │    │  (Data Transfer)│    │  (JPA Mapping)  │
         │              └─────────────────┘    └─────────────────┘    └─────────────────┘
         │                                                                      │
         └──────────────────────────────────────────────────────────────────────▼
                                                                       ┌─────────────────┐
                                                                       │   MySQL DB      │
                                                                       │ (Remote Server) │
                                                                       └─────────────────┘
```

## 📊 Chi tiết Database Schema

### 🗄️ Bảng và Quan hệ

```sql
-- Bảng user_account
CREATE TABLE user_account (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER'
);

-- Bảng customer  
CREATE TABLE customer (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_account_id BIGINT NOT NULL UNIQUE,
    name VARCHAR(255),
    phone_number VARCHAR(20),
    email VARCHAR(255),
    address VARCHAR(500), -- Thêm trường địa chỉ
    FOREIGN KEY (user_account_id) REFERENCES user_account(id)
);

-- Bảng product
CREATE TABLE product (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    product_type VARCHAR(50),
    manufacture_date DATE,
    expiry_date DATE,
    stock_quantity INT,
    image_url VARCHAR(500)
);

-- Bảng orders
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    order_date DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    note VARCHAR(255),
    FOREIGN KEY (customer_id) REFERENCES customer(id)
);

-- Bảng order_detail
CREATE TABLE order_detail (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id)
);
```

### 🔗 Entity Relationships Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                            BEELIFEVENTURES DATABASE SCHEMA                              │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│   ┌──────────────────┐         ┌──────────────────┐                                    │
│   │   user_account   │    1:1  │     customer     │                                    │
│   ├──────────────────┤◄────────┤├──────────────────┤                                    │
│   │ id (PK)          │         │ id (PK)          │                                    │
│   │ user_name (UNQ)  │         │ user_account_id  │                                    │
│   │ password         │         │ name             │                                    │
│   │ role             │         │ phone_number     │                                    │
│   └──────────────────┘         │ email            │                                    │
│                                │ address          │                                    │
│                                └──────────────────┘                                    │
│                                         │ 1:N                                          │
│                                         ▼                                              │
│                                ┌──────────────────┐                                    │
│                                │     orders       │                                    │
│                                ├──────────────────┤                                    │
│   ┌──────────────────┐         │ id (PK)          │                                    │
│   │     product      │         │ customer_id (FK) │                                    │
│   ├──────────────────┤         │ order_date       │                                    │
│   │ id (PK)          │         │ status           │                                    │
│   │ name             │         │ total            │                                    │
│   │ description      │         │ note             │                                    │
│   │ price            │         └──────────────────┘                                    │
│   │ product_type     │                  │ 1:N                                          │
│   │ manufacture_date │                  ▼                                              │
│   │ expiry_date      │         ┌──────────────────┐                                    │
│   │ stock_quantity   │    N:M  │   order_detail   │                                    │
│   │ image_url        │◄────────┤├──────────────────┤                                    │
│   └──────────────────┘         │ id (PK)          │                                    │
│                                │ order_id (FK)    │                                    │
│                                │ product_id (FK)  │                                    │
│                                │ quantity         │                                    │
│                                │ price            │                                    │
│                                └──────────────────┘                                    │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

## 🚀 API Endpoints và Data Flow

### 1. Authentication Module

#### 🔐 POST `/api/auth/register`
```
Request Body: UserAccountDTO
{
  "userName": "john_doe",
  "password": "password123",
  "name": "John Doe",
  "phoneNumber": "0987654321",
  "email": "john@example.com"
}

Flow:
Auth.register() → UserAccountEntity.save() → CustomerEntity.save()
Database Impact:
- INSERT INTO user_account (user_name, password, role)
- INSERT INTO customer (user_account_id, name, phone_number, email, address)
```

#### 🔐 POST `/api/auth/login`
```
Request Body: LoginDTO
{
  "userName": "john_doe",
  "password": "password123"
}

Flow:
Auth.login() → UserAccountRepository.findByUserName() → PasswordEncoder.matches() → JwtUtil.generateToken()
Database Query:
- SELECT * FROM user_account WHERE user_name = ?
```

#### 🔐 GET `/api/auth/profile` (Protected)
```
Headers: Authorization: Bearer <JWT_TOKEN>

Flow:
Auth.getProfile() → JwtUtil.extractUsername() → UserAccountRepository.findByUserName() → CustomerRepository.findByUserAccount()
Database Queries:
- SELECT * FROM user_account WHERE user_name = ?
- SELECT * FROM customer WHERE user_account_id = ?
```

#### 🔐 PUT `/api/auth/profile` (Protected)
```
Headers: Authorization: Bearer <JWT_TOKEN>
Request Body: CustomerUpdateDTO
{
  "name": "Nguyễn Văn An",
  "phoneNumber": "0987654321",
  "email": "an@example.com",
  "address": "123 Đường ABC, Quận 1, TP.HCM"
}

Flow:
Auth.updateProfile() → JwtUtil.extractUsername() → CustomerRepository.findByUserAccount() → CustomerRepository.save()
Database Impact:
- SELECT * FROM user_account WHERE user_name = ?
- SELECT * FROM customer WHERE user_account_id = ?
- UPDATE customer SET name=?, phone_number=?, email=?, address=? WHERE id = ?
```

### 2. Product Management Module

#### 📦 GET `/api/product`
```
Flow:
Product.getAllProducts() → ProductService.findAll() → ProductRepository.findAll()
Database Query:
- SELECT * FROM product
```

#### 📦 POST `/api/product`
```
Request Body: ProductDTO
{
  "name": "Mật ong hoa cà phê",
  "description": "Mật ong từ hoa cà phê nguyên chất",
  "price": 150000,
  "productType": "Mật ong",
  "manufactureDate": "2024-01-15",
  "expiryDate": "2026-01-15",
  "stockQuantity": 100,
  "imageUrl": "https://example.com/honey.jpg"
}

Flow:
Product.addProduct() → ProductService.save() → ProductRepository.save()
Database Impact:
- INSERT INTO product (name, description, price, product_type, manufacture_date, expiry_date, stock_quantity, image_url)
```

#### 📦 PUT `/api/product`
```
Request Body: ProductDTO (with id)

Flow:
Product.putProduct() → ProductService.findById() → ProductService.update() → ProductRepository.save()
Database Impact:
- SELECT * FROM product WHERE id = ?
- UPDATE product SET name=?, description=?, price=?, ... WHERE id = ?
```

#### 📦 DELETE `/api/product`
```
Request Body: ProductDTO (with id)

Flow:
Product.deleteProduct() → ProductService.delete() → ProductRepository.delete()
Database Impact:
- SELECT * FROM product WHERE id = ?
- DELETE FROM product WHERE id = ?
```

### 3. Enhanced Order Management Module (JWT Required)

#### 🛒 GET `/api/orders` (Protected - JWT Required)
```
Headers: Authorization: Bearer <JWT_TOKEN>

Flow:
Orders.getAllMyOrders() → getCurrentCustomerFromToken() → OrdersService.findAllOrdersByCustomer()
Response: Tất cả đơn hàng của user hiện tại với thông tin đầy đủ:
[
  {
    "orderId": 1,
    "customerName": "Nguyễn Văn An",
    "customerPhone": "0987654321",
    "customerEmail": "an@example.com",
    "customerAddress": "123 Đường ABC, Quận 1, TP.HCM",
    "orderDate": "2024-01-15T10:30:00",
    "status": "PENDING",
    "total": 400000,
    "note": "Giao hàng buổi sáng",
    "orderItems": [
      {
        "productId": 1,
        "productName": "Mật ong hoa cà phê",
        "quantity": 2,
        "price": 150000,
        "total": 300000
      },
      {
        "productId": 2,
        "productName": "Mật ong hoa vải",
        "quantity": 1,
        "price": 100000,
        "total": 100000
      }
    ]
  }
]

Database Queries:
- SELECT * FROM orders WHERE customer_id = ? (từ JWT token)
- JOIN với customer, order_detail, product để lấy thông tin đầy đủ
```

#### 🛒 GET `/api/orders/{id}` (Protected - JWT Required)
```
Headers: Authorization: Bearer <JWT_TOKEN>
Path Variable: id (Long)

Flow:
Orders.getOrderById() → getCurrentCustomerFromToken() → Kiểm tra quyền sở hữu → OrdersService.findById()
Security: Chỉ cho phép xem đơn hàng của chính mình
Database Queries:
- SELECT * FROM orders WHERE id = ? AND customer_id = ?
```

#### 🛒 POST `/api/orders` (Protected - JWT Required)
```
Headers: Authorization: Bearer <JWT_TOKEN>
Request Body: OrdersCreateDTO (customerId tự động lấy từ JWT token)
{
  "status": "PENDING",
  "note": "Giao hàng buổi sáng",
  "orderItems": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 150000
    },
    {
      "productId": 2,
      "quantity": 1,
      "price": 250000
    }
  ]
}

Flow:
Orders.createOrder() → getCurrentCustomerFromToken() → OrdersService.saveWithCustomer() → @Transactional
Database Impact:
1. SELECT * FROM user_account WHERE user_name = ? (từ JWT)
2. SELECT * FROM customer WHERE user_account_id = ? (từ JWT)
3. For each orderItem:
   - SELECT * FROM product WHERE id = ?
   - Check stock_quantity >= quantity
4. INSERT INTO orders (customer_id, order_date, status, total, note)
5. For each orderItem:
   - INSERT INTO order_detail (order_id, product_id, quantity, price)
   - UPDATE product SET stock_quantity = stock_quantity - ? WHERE id = ?
```

#### 🛒 PUT `/api/orders` (Protected - JWT Required)
```
Headers: Authorization: Bearer <JWT_TOKEN>
Request Body: OrderUpdateDTO
{
  "orderId": 1,
  "customerAddress": "456 Đường XYZ, Quận 2, TP.HCM",
  "note": "Giao hàng buổi chiều",
  "orderItems": [
    {
      "productId": 1,
      "quantity": 3
    },
    {
      "productId": 2,
      "quantity": 2
    }
  ]
}

Flow:
Orders.updateOrder() → getCurrentCustomerFromToken() → OrdersService.updateOrderByCustomer() → @Transactional
Security: 
- Chỉ cho phép cập nhật đơn hàng của chính mình
- Chỉ cho phép cập nhật khi status = "PENDING"
Database Impact:
1. SELECT * FROM orders WHERE id = ? AND customer_id = ?
2. Kiểm tra status = "PENDING"
3. UPDATE customer SET address = ? WHERE id = ?
4. UPDATE orders SET note = ?, total = ? WHERE id = ?
5. For each order_detail:
   - Hoàn lại stock: UPDATE product SET stock_quantity = stock_quantity + old_quantity
   - Cập nhật quantity mới: UPDATE order_detail SET quantity = ?
   - Trừ stock mới: UPDATE product SET stock_quantity = stock_quantity - new_quantity
```

#### 🛒 DELETE `/api/orders/{id}` (Protected - JWT Required)
```
Headers: Authorization: Bearer <JWT_TOKEN>
Path Variable: id (Long)

Flow:
Orders.deleteOrder() → getCurrentCustomerFromToken() → Kiểm tra quyền sở hữu → OrdersService.delete()
Security: Chỉ cho phép xóa đơn hàng của chính mình
Database Impact:
1. SELECT * FROM orders WHERE id = ? AND customer_id = ?
2. SELECT * FROM order_detail WHERE order_id = ?
3. For each order_detail:
   - UPDATE product SET stock_quantity = stock_quantity + quantity WHERE id = product_id
4. DELETE FROM order_detail WHERE order_id = ? (CASCADE)
5. DELETE FROM orders WHERE id = ?
```

## 🔧 Service Layer Business Logic

### ProductService Implementation
```java
findAll() → List<ProductEntity> → List<ProductDTO>
save(ProductDTO) → ProductEntity → productRepository.save()
update(ProductDTO) → ProductEntity.setFields() → productRepository.save()
delete(ProductDTO) → productRepository.findById() → productRepository.delete()
```

### OrdersService Implementation
```java
save(OrdersDTO) → @Transactional:
  1. Validate customer exists
  2. Calculate total from orderItems
  3. Check product stock availability
  4. Create OrdersEntity with OrderDetailEntity list
  5. Update product stock quantities
  6. Save orders with cascade to order_detail
```

## 🔐 Enhanced Security Features (Updated)

### JWT Authentication Flow (Enhanced)
```
1. Login → Validate credentials → Generate JWT with username
2. Protected endpoints → JwtFilter intercepts → Extract & validate token
3. Set SecurityContext with UserDetails
4. Auto-extract Customer ID from JWT for orders (No manual customerId required)
5. Controller methods execute with authenticated user context
```

### Protected Endpoints
```
- PUT /api/auth/profile (Update user profile)
- GET /api/auth/profile (Get user profile) 
- POST /api/orders (Create order - customerId auto from JWT)
- PUT /api/orders (Update order)
- DELETE /api/orders/{id} (Delete order)
```

### Security Improvements
- **Automatic Customer ID Resolution**: Orders API automatically gets customer ID from JWT token
- **Profile Management**: Users can update their own profile information only
- **Token-based Authorization**: All sensitive operations require valid JWT token
- **Address Field**: Added address support for better customer data management

### CORS Configuration
```java
@CrossOrigin(origins = "*") // Applied to all endpoints
Allowed Methods: GET, POST, PUT, DELETE, OPTIONS
Allowed Headers: Authorization, Content-Type
```

## 🗄️ Database Configuration

### Connection Settings
```properties
URL: jdbc:mysql://14.225.220.60:3306/beelifeventure
Username: phuocthuy
Driver: MySQL 8.0.33
Dialect: MySQL8Dialect
DDL Mode: none (manual schema management)
SQL Logging: enabled
```

### JPA Configuration
```properties
hibernate.ddl-auto=none
hibernate.enable_lazy_load_no_trans=true
show-sql=true
format_sql=true
```

## 📈 Enhanced Data Flow Example: Complete Order Process

```
1. User Registration:
   POST /api/auth/register → user_account + customer tables (with address)

2. User Login:
   POST /api/auth/login → JWT token generation

3. Update Profile (Enhanced):
   PUT /api/auth/profile → Update customer info (name, phone, email, address)
   - JWT token validates user identity
   - Customer record updated automatically

4. Browse Products:
   GET /api/product → product table query

5. Create Order (Enhanced Security):
   POST /api/orders → 
   - JWT token automatically provides customer ID
   - No need to manually specify customerId in request
   - Validate customer from token
   - Check product availability
   - Calculate total
   - Insert orders + order_detail
   - Update product stock

6. View All Orders (New Feature):
   GET /api/orders → 
   - JWT token identifies customer
   - Return ALL orders of current user with complete details:
     * Customer info (name, phone, email, address)
     * Product names and details
     * Order status and totals
     * No need to specify order IDs

7. Update Order (New Feature):
   PUT /api/orders → 
   - JWT token validates ownership
   - Allow updates to: customer address, quantities, note
   - Only pending orders can be modified
   - Automatic inventory adjustment
   - Security: Only order owner can modify

8. View Specific Order:
   GET /api/orders/{id} → 
   - JWT token validates ownership
   - Return complete order information
   - Security: Only show orders belonging to current user

9. Delete Order:
   DELETE /api/orders/{id} →
   - JWT token validates ownership
   - Restore product inventory
   - Security: Only order owner can delete
```

## 🔍 Performance Optimizations

### Database Indexes
```sql
-- Primary Keys (Auto-indexed)
PRIMARY KEY (id) on all tables

-- Foreign Key Indexes
INDEX idx_customer_user_account (user_account_id)
INDEX idx_orders_customer (customer_id)  
INDEX idx_order_detail_order (order_id)
INDEX idx_order_detail_product (product_id)

-- Unique Constraints
UNIQUE INDEX idx_user_account_username (user_name)

-- Search Optimizations
INDEX idx_product_name (name)
INDEX idx_product_type (product_type)
INDEX idx_customer_email (email)
```

### JPA Fetch Strategies
```java
@OneToMany(mappedBy = "order", fetch = FetchType.LAZY) // order_detail
@ManyToOne(fetch = FetchType.LAZY) // order in order_detail
@OneToOne(fetch = FetchType.EAGER) // user_account in customer
```

---
*Sơ đồ này mô tả đầy đủ kiến trúc, luồng dữ liệu và tương tác API-Database của hệ thống BeeLifeVentures Backend với các tính năng bảo mật được cải thiện*

## 🆕 Enhanced Features Summary

### New DTOs Added
1. **CustomerUpdateDTO**: For updating user profile information
   - name, phoneNumber, email, address fields
   - Used in PUT /api/auth/profile

2. **OrdersCreateDTO**: Simplified order creation without customerId
   - status, note, orderItems fields
   - customerId automatically extracted from JWT token

3. **OrderDetailResponseDTO**: Complete order information display
   - orderId, customerName, customerPhone, customerEmail, customerAddress
   - orderDate, status, total, note, orderItems with product details

4. **OrderItemDetailDTO**: Detailed order item information
   - productId, productName, quantity, price, total
   - Enhanced display with product names and calculated totals

5. **OrderUpdateDTO**: For updating existing orders
   - orderId, customerAddress, note, orderItems
   - Allows customers to modify their pending orders

6. **OrderItemUpdateDTO**: For updating order item quantities
   - productId, quantity fields

### Updated Database Schema
- **customer table**: Added `address` field for complete user information
- **OrdersRepository**: Added methods findByCustomer() and findByCustomerId()

### Enhanced API Endpoints
1. **GET /api/orders**: Get ALL orders of current user (JWT required)
   - Returns complete order information with product names, customer details
   - No need to specify order ID - shows all user's orders

2. **GET /api/orders/{id}**: Get specific order by ID (JWT required)
   - Security: Only allows viewing own orders
   - Enhanced with ownership verification

3. **POST /api/orders**: Create order (JWT required)
   - Automatic customer identification from JWT token
   - Enhanced security with authentication requirement

4. **PUT /api/orders**: Update order (JWT required)
   - Allows updating: customer address, note, product quantities
   - Security: Only pending orders can be modified
   - Security: Only order owner can modify

5. **DELETE /api/orders/{id}**: Delete order (JWT required)
   - Security: Only order owner can delete
   - Enhanced with ownership verification

6. **PUT /api/auth/profile**: Update user profile with JWT authentication

### Security Improvements
- **All order operations require JWT authentication**
- **Ownership verification**: Users can only access their own orders
- **Status-based permissions**: Only pending orders can be modified
- **Customer ID auto-extraction**: No manual customer ID specification needed
- **Profile updates restricted to authenticated user only**

### Business Logic Enhancements
- **OrdersService.findAllOrdersByCustomer()**: Get all orders with complete details
- **OrdersService.updateOrderByCustomer()**: Secure order updates with ownership check
- **Enhanced order display**: Shows product names, customer details, calculated totals
- **Smart inventory management**: Automatic stock adjustment during order updates
- **Address management**: Orders can update customer delivery address

### User Experience Improvements
- **Complete order information**: No need for multiple API calls
- **Flexible order updates**: Change quantities and delivery address
- **Secure operations**: All sensitive operations require authentication
- **Detailed product information**: Product names included in order responses
- **Order ownership**: Users only see and manage their own orders

---