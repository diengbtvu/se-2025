# Tài liệu API Quản lý Sản phẩm - Admin Panel

## Tổng quan
Tài liệu này mô tả đầy đủ các chức năng API cho trang quản lý sản phẩm trong hệ thống admin, bao gồm các thao tác CRUD và xử lý ràng buộc khi xóa dữ liệu.

## Base URL
```
http://localhost:8080
```

## Authentication
Tất cả các API admin đều yêu cầu xác thực với token JWT trong header:
```
Authorization: Bearer <token>
```

## 1. API Lấy danh sách sản phẩm

### GET /api/admin/products
**Mô tả:** Lấy danh sách sản phẩm có phân trang

**Query Parameters:**
- `page` (optional): Số trang (mặc định: 0)
- `size` (optional): Số lượng mục trên mỗi trang (mặc định: 10)

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "name": "Mật ong nguyên chất",
      "description": "Mật ong tự nhiên 100%",
      "price": 150000,
      "productType": "Hữu cơ",
      "manufactureDate": "2024-01-15",
      "expiryDate": "2025-01-15",
      "stockQuantity": 50,
      "imageUrl": "https://example.com/honey.jpg",
      "inStock": true,
      "category": "Mật ong"
    }
  ],
  "totalElements": 25,
  "totalPages": 3,
  "size": 10,
  "number": 0
}
```

## 2. API Lấy thông tin chi tiết sản phẩm

### GET /api/admin/products/{productId}
**Mô tả:** Lấy thông tin chi tiết của một sản phẩm

**Path Parameters:**
- `productId`: ID của sản phẩm

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Mật ong nguyên chất",
  "description": "Mật ong tự nhiên 100%",
  "price": 150000,
  "productType": "Hữu cơ",
  "manufactureDate": "2024-01-15",
  "expiryDate": "2025-01-15",
  "stockQuantity": 50,
  "imageUrl": "https://example.com/honey.jpg",
  "inStock": true,
  "category": "Mật ong"
}
```

## 3. API Tạo sản phẩm mới

### POST /api/admin/products
**Mô tả:** Tạo sản phẩm mới trong hệ thống

**Request Body:**
```json
{
  "name": "Mật ong nguyên chất",
  "description": "Mật ong tự nhiên 100%",
  "price": 150000,
  "productType": "Hữu cơ",
  "manufactureDate": "2024-01-15",
  "expiryDate": "2025-01-15",
  "stockQuantity": 50,
  "imageUrl": "https://example.com/honey.jpg",
  "category": "Mật ong"
}
```

**Các trường bắt buộc:**
- `name`: Tên sản phẩm
- `description`: Mô tả sản phẩm
- `price`: Giá sản phẩm (VNĐ)
- `stockQuantity`: Số lượng tồn kho
- `imageUrl`: URL hình ảnh sản phẩm
- `category`: Danh mục sản phẩm

**Các trường tùy chọn:**
- `productType`: Loại sản phẩm
- `manufactureDate`: Ngày sản xuất (YYYY-MM-DD)
- `expiryDate`: Ngày hết hạn (YYYY-MM-DD)

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Mật ong nguyên chất",
  "description": "Mật ong tự nhiên 100%",
  "price": 150000,
  "productType": "Hữu cơ",
  "manufactureDate": "2024-01-15",
  "expiryDate": "2025-01-15",
  "stockQuantity": 50,
  "imageUrl": "https://example.com/honey.jpg",
  "inStock": true,
  "category": "Mật ong"
}
```

## 4. API Cập nhật sản phẩm

### PUT /api/admin/products/{productId}
**Mô tả:** Cập nhật thông tin sản phẩm

**Path Parameters:**
- `productId`: ID của sản phẩm cần cập nhật

**Request Body:** (Tương tự như tạo mới, tất cả trường đều optional)
```json
{
  "name": "Mật ong nguyên chất cập nhật",
  "description": "Mật ong tự nhiên 100% - phiên bản mới",
  "price": 160000,
  "stockQuantity": 45
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Mật ong nguyên chất cập nhật",
  "description": "Mật ong tự nhiên 100% - phiên bản mới",
  "price": 160000,
  "productType": "Hữu cơ",
  "manufactureDate": "2024-01-15",
  "expiryDate": "2025-01-15",
  "stockQuantity": 45,
  "imageUrl": "https://example.com/honey.jpg",
  "inStock": true,
  "category": "Mật ong"
}
```

## 5. API Xóa sản phẩm

### DELETE /api/admin/products/{productId}
**Mô tả:** Xóa sản phẩm khỏi hệ thống

**Path Parameters:**
- `productId`: ID của sản phẩm cần xóa

**Response (200 OK):**
```
"Sản phẩm đã được xóa thành công"
```

**Lỗi ràng buộc (409 Conflict):**
```
"Không thể xóa sản phẩm vì có đơn hàng hoặc giỏ hàng chứa sản phẩm này"
```

## 6. Xử lý Ràng buộc khi Xóa

### Kiểm tra ràng buộc trước khi xóa
Hệ thống sẽ kiểm tra các ràng buộc sau trước khi cho phép xóa sản phẩm:

1. **Ràng buộc với đơn hàng:** Sản phẩm có trong các đơn hàng
2. **Ràng buộc với giỏ hàng:** Sản phẩm có trong giỏ hàng của người dùng

### Xóa cưỡng bức (Force Delete)
Khi sản phẩm có ràng buộc, admin có thể chọn xóa cưỡng bức:

1. **Xóa cart items:** Xóa tất cả cart items chứa sản phẩm này
2. **Xóa order details:** Xóa tất cả order detail items chứa sản phẩm này
3. **Xóa sản phẩm:** Cuối cùng xóa sản phẩm

### API Kiểm tra ràng buộc
```javascript
// Kiểm tra xem có thể xóa sản phẩm không
const constraints = await adminAPI.checkProductDeletionConstraints(productId);

// Kết quả trả về:
{
  "canDelete": false,
  "constraints": {
    "hasOrders": true,
    "orderCount": 3,
    "hasCartItems": true,
    "cartItemCount": 2
  }
}
```

### API Xóa với ràng buộc
```javascript
// Xóa cưỡng bức - sẽ xóa tất cả dữ liệu liên quan
await adminAPI.deleteProductWithConstraints(productId, true);

// Xóa thường - chỉ xóa nếu không có ràng buộc
await adminAPI.deleteProductWithConstraints(productId, false);
```

## 7. Các API Hỗ trợ khác

### Lấy tất cả sản phẩm (không phân trang)
```javascript
const allProducts = await adminAPI.getAllProducts();
```

### Tìm kiếm sản phẩm
```javascript
// Tìm kiếm theo từ khóa
const searchResults = await adminAPI.searchProducts(keyword);
```

## 8. Xử lý Lỗi

### Các mã lỗi thường gặp:

**401 Unauthorized:**
- Token không hợp lệ hoặc hết hạn
- Không có quyền admin

**403 Forbidden:**
- Không có quyền truy cập API admin

**404 Not Found:**
- Sản phẩm không tồn tại

**409 Conflict:**
- Không thể xóa do ràng buộc dữ liệu

**422 Unprocessable Entity:**
- Dữ liệu đầu vào không hợp lệ
- Thiếu trường bắt buộc

**500 Internal Server Error:**
- Lỗi server

### Ví dụ xử lý lỗi:
```javascript
try {
  await adminAPI.deleteProduct(productId);
} catch (error) {
  if (error.message.includes('ràng buộc')) {
    // Hiển thị modal xác nhận xóa cưỡng bức
    showForceDeleteModal();
  } else {
    // Hiển thị thông báo lỗi thông thường
    showErrorMessage(error.message);
  }
}
```

## 9. Best Practices

### Frontend Implementation:
1. **Validation:** Kiểm tra dữ liệu trước khi gửi API
2. **Loading States:** Hiển thị trạng thái loading khi gọi API
3. **Error Handling:** Xử lý lỗi một cách graceful
4. **Confirmation:** Yêu cầu xác nhận trước khi xóa
5. **Feedback:** Hiển thị thông báo thành công/thất bại

### Security:
1. **Authentication:** Luôn kiểm tra token trước khi gọi API
2. **Authorization:** Chỉ admin mới có thể truy cập
3. **Input Validation:** Validate dữ liệu đầu vào
4. **CSRF Protection:** Sử dụng CSRF token nếu cần

### Performance:
1. **Pagination:** Sử dụng phân trang cho danh sách lớn
2. **Caching:** Cache dữ liệu khi cần thiết
3. **Optimistic Updates:** Cập nhật UI trước khi API response
4. **Debouncing:** Debounce search input

## 10. Ví dụ Sử dụng Hoàn chỉnh

```javascript
// Component quản lý sản phẩm
const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getProductsPaginated(0, 100);
      setProducts(response.content || []);
    } catch (error) {
      console.error('Lỗi khi tải sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tạo sản phẩm mới
  const createProduct = async (productData) => {
    try {
      await adminAPI.createProduct(productData);
      fetchProducts(); // Refresh danh sách
      showSuccessMessage('Sản phẩm đã được tạo thành công');
    } catch (error) {
      showErrorMessage('Lỗi khi tạo sản phẩm: ' + error.message);
    }
  };

  // Xóa sản phẩm
  const deleteProduct = async (productId, forceDelete = false) => {
    try {
      if (forceDelete) {
        await adminAPI.deleteProductWithConstraints(productId, true);
      } else {
        await adminAPI.deleteProduct(productId);
      }
      fetchProducts(); // Refresh danh sách
      showSuccessMessage('Sản phẩm đã được xóa thành công');
    } catch (error) {
      if (error.message.includes('ràng buộc')) {
        showForceDeleteConfirmation(productId);
      } else {
        showErrorMessage('Lỗi khi xóa sản phẩm: ' + error.message);
      }
    }
  };

  return (
    <div>
      {/* UI components */}
    </div>
  );
};
```

## Kết luận
Tài liệu này cung cấp đầy đủ thông tin về các API quản lý sản phẩm, bao gồm cả xử lý ràng buộc khi xóa dữ liệu. Việc implement đúng các API này sẽ đảm bảo hệ thống hoạt động ổn định và an toàn. 