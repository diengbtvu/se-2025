# BÁO CÁO ĐỒ ÁN PHÁT TRIỂN PHẦN MỀM
## Ứng dụng BeeLife Ventures – Quản lý & Kết nối ngành nuôi ong hiện đại

---

## 1. Giới thiệu

### 1.1. Tên dự án và chủ đề
- **Tên dự án:** BeeLife Ventures
- **Chủ đề:** Ứng dụng quản lý, kết nối và hỗ trợ ngành nuôi ong hiện đại, cung cấp nền tảng thương mại điện tử, quản lý đơn hàng, sản phẩm, khách hàng, và tích hợp các dịch vụ số hóa cho người nuôi ong, doanh nghiệp và khách hàng.

### 1.2. Mục tiêu của ứng dụng
- Xây dựng nền tảng số giúp kết nối các bên trong ngành nuôi ong: người nuôi ong, doanh nghiệp, khách hàng.
- Hỗ trợ quản lý sản phẩm, đơn hàng, khách hàng, tối ưu quy trình vận hành.
- Tăng cường chuyển đổi số, minh bạch hóa thông tin, thúc đẩy phát triển bền vững ngành nuôi ong.

### 1.3. Lý do chọn đề tài
- Ngành nuôi ong tại Việt Nam còn nhiều thủ công, thiếu nền tảng số hóa.
- Nhu cầu kết nối, thương mại điện tử, quản lý hiện đại ngày càng tăng.
- Đề tài mang tính thực tiễn, có thể mở rộng và ứng dụng thực tế.

*Ghi chú: Chèn ảnh minh họa ngành nuôi ong, ảnh thực tế, biểu đồ tăng trưởng ngành nếu có.*

---

## 2. Phân tích yêu cầu

### 2.1. Các chức năng chính của hệ thống (Functional Requirements)
- Quản lý tài khoản người dùng (đăng ký, đăng nhập, phân quyền)
- Quản lý sản phẩm (thêm, sửa, xóa, xem danh sách)
- Quản lý đơn hàng (tạo đơn, cập nhật trạng thái, xem lịch sử)
- Quản lý giỏ hàng
- Quản lý khách hàng
- Tìm kiếm, lọc sản phẩm
- Thống kê, báo cáo đơn hàng, doanh thu
- Tích hợp thanh toán (nếu có)
- Quản trị hệ thống (admin)

#### Bảng mô tả chức năng chính
| STT | Chức năng                | Mô tả chi tiết                                                                 |
|-----|--------------------------|-------------------------------------------------------------------------------|
| 1   | Đăng ký/Đăng nhập        | Người dùng đăng ký tài khoản, xác thực qua email, đăng nhập hệ thống          |
| 2   | Quản lý sản phẩm         | Thêm, sửa, xóa, xem chi tiết sản phẩm, upload hình ảnh                        |
| 3   | Quản lý đơn hàng         | Tạo đơn, cập nhật trạng thái, xem lịch sử, hủy đơn                            |
| 4   | Quản lý giỏ hàng         | Thêm/xóa sản phẩm vào giỏ, cập nhật số lượng                                  |
| 5   | Quản lý khách hàng       | Xem danh sách, tìm kiếm, chỉnh sửa thông tin khách hàng                       |
| 6   | Thống kê, báo cáo        | Thống kê doanh thu, số lượng đơn hàng, sản phẩm bán chạy                      |
| 7   | Quản trị hệ thống        | Quản lý user, phân quyền, kiểm soát hoạt động hệ thống                        |

*Ghi chú: Chèn ảnh sơ đồ use case tổng thể, bảng phân rã chức năng, ảnh mockup chức năng chính.*

### 2.2. Các yêu cầu phi chức năng (Non-functional Requirements)
- Hiệu năng: Ứng dụng đáp ứng nhanh, tải trang < 2s
- Bảo mật: Sử dụng JWT, phân quyền, mã hóa mật khẩu
- Khả năng mở rộng: Thiết kế microservices, dễ mở rộng module
- Khả năng triển khai cloud, Docker hóa toàn bộ hệ thống
- Dễ sử dụng, giao diện thân thiện, hỗ trợ đa thiết bị
- Đảm bảo backup, khôi phục dữ liệu

#### Bảng mô tả yêu cầu phi chức năng
| STT | Yêu cầu                  | Mô tả chi tiết                                                                 |
|-----|--------------------------|-------------------------------------------------------------------------------|
| 1   | Hiệu năng                | Ứng dụng phản hồi nhanh, tối ưu truy vấn DB, cache dữ liệu                    |
| 2   | Bảo mật                  | Mã hóa mật khẩu, xác thực JWT, phân quyền user/admin                          |
| 3   | Khả năng mở rộng         | Thiết kế module độc lập, dễ tích hợp dịch vụ mới                              |
| 4   | Triển khai cloud         | Docker hóa, dễ deploy trên nhiều môi trường                                   |
| 5   | Dễ sử dụng               | UI/UX thân thiện, hỗ trợ mobile, desktop                                      |
| 6   | Backup/khôi phục         | Có script backup DB, hướng dẫn khôi phục dữ liệu                              |

---

## 3. Thiết kế hệ thống

### 3.1. Kiến trúc tổng thể
- Ứng dụng theo mô hình **Client-Server**:
  - **Frontend:** Next.js (React), giao tiếp qua RESTful API
  - **Backend:** Spring Boot, cung cấp API, xử lý nghiệp vụ
  - **Database:** MySQL
  - **Triển khai:** Docker, VPS/cloud

*Ghi chú: Chèn sơ đồ kiến trúc tổng thể (Mermaid hoặc vẽ tay, Visio, draw.io, ...)*

### 3.2. Thiết kế cơ sở dữ liệu
- Sử dụng MySQL, chuẩn hóa dữ liệu, đảm bảo toàn vẹn
- Các bảng chính: User, Product, Order, OrderDetail, Cart, Customer, ...

#### Sơ đồ ERD:
*Ghi chú: Chèn sơ đồ ERD hoặc bảng quan hệ dữ liệu tại đây*

#### Bảng mô tả các bảng dữ liệu chính
| Bảng         | Trường chính           | Mô tả ngắn gọn                                  |
|--------------|------------------------|-------------------------------------------------|
| User         | id, username, password | Thông tin tài khoản người dùng                  |
| Product      | id, name, price, ...   | Thông tin sản phẩm                              |
| Order        | id, user_id, status    | Đơn hàng, trạng thái, liên kết user             |
| OrderDetail  | id, order_id, product_id| Chi tiết từng sản phẩm trong đơn hàng           |
| Cart         | id, user_id            | Giỏ hàng của từng user                          |
| Customer     | id, name, phone, ...   | Thông tin khách hàng                            |

### 3.3. Thiết kế API
- Sử dụng RESTful API, chuẩn hóa endpoint, method, request/response
- Ví dụ các endpoint chính:
  - `POST /api/v1/auth/login` – Đăng nhập
  - `GET /api/v1/products` – Lấy danh sách sản phẩm
  - `POST /api/v1/orders` – Tạo đơn hàng
  - ...

#### Bảng mô tả API chính
| Endpoint                  | Method | Request body/params         | Response (mẫu)           | Chức năng                |
|---------------------------|--------|----------------------------|--------------------------|--------------------------|
| /api/v1/auth/login        | POST   | username, password         | token, user info         | Đăng nhập                |
| /api/v1/products          | GET    | page, size, filter         | list sản phẩm            | Lấy danh sách sản phẩm   |
| /api/v1/orders            | POST   | order info                 | orderId, status          | Tạo đơn hàng             |
| /api/v1/cart              | GET    | userId                     | list sản phẩm trong giỏ  | Xem giỏ hàng             |

*Ghi chú: Chèn link tài liệu Swagger, ảnh chụp màn hình test API, ví dụ request/response thực tế.*

### 3.4. Thiết kế giao diện (UI/UX)
- Thiết kế hiện đại, thân thiện, responsive
- Sử dụng Figma để thiết kế giao diện

#### Ảnh chụp các màn hình chính:
*Ghi chú: Chèn ảnh chụp màn hình: Trang chủ, Đăng nhập, Quản lý sản phẩm, Đơn hàng, Giỏ hàng, v.v.*

#### Liên kết bản thiết kế Figma:
- [Link Figma](#)

---

## 4. Triển khai và công nghệ sử dụng

### 4.1. Danh sách công nghệ sử dụng
- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Spring Boot, Java, Maven
- **Database:** MySQL
- **DevOps:** Docker, Docker Compose, GitHub Actions, VPS, Nginx
- **Khác:** Figma (UI/UX), Postman (test API)

### 4.2. Quy trình CI/CD với GitHub Actions
- Tự động build, test, deploy khi push code lên GitHub
- Các bước chính: Build FE/BE, test, build Docker image, deploy lên VPS

*Ghi chú: Chèn sơ đồ hoặc mô tả quy trình CI/CD, ảnh chụp màn hình pipeline, file workflow mẫu.*

### 4.3. Cấu hình Docker và quy trình triển khai
- Docker hóa toàn bộ hệ thống (FE, BE, DB)
- Sử dụng docker-compose để quản lý
- Triển khai lên VPS, cấu hình Nginx reverse proxy

*Ghi chú: Chèn file cấu hình mẫu, ảnh chụp màn hình deploy, log deploy, ...*

---

## 5. Quản lý dự án

### 5.1. Sử dụng Jira để lập kế hoạch và theo dõi tiến độ
- Lập Product Backlog, chia Sprint, phân công task
- Theo dõi tiến độ qua Scrum Board, Burndown chart
- Cập nhật trạng thái công việc hàng ngày

*Ghi chú: Chèn ảnh chụp màn hình Jira, backlog, board, burndown chart, bảng phân công.*

### 5.2. Phân công nhiệm vụ từng thành viên
- **Trần Minh Điền (DevOps):** Thiết kế kiến trúc, DevOps, CI/CD, deploy, quản lý dự án, tài liệu
- **Nguyễn Văn Hoàng (Backend):** Thiết kế DB, phát triển API, bảo mật, test backend
- **Nguyễn Lê Duy (Frontend):** Thiết kế UI/UX, phát triển giao diện, kết nối API, test frontend

#### Bảng phân công chi tiết
| Thành viên         | Vai trò    | Nhiệm vụ chính                                      |
|--------------------|------------|-----------------------------------------------------|
| Trần Minh Điền     | DevOps     | Kiến trúc, CI/CD, Docker, deploy, quản lý dự án     |
| Nguyễn Văn Hoàng   | Backend    | DB, API, bảo mật, test backend                      |
| Nguyễn Lê Duy      | Frontend   | UI/UX, giao diện, kết nối API, test frontend        |

---

## 6. Kiểm thử

### 6.1. Chiến lược kiểm thử và công cụ sử dụng
- Kiểm thử đơn vị (unit test) cho backend (JUnit), frontend (Jest)
- Kiểm thử tích hợp (integration test)
- Kiểm thử API với Postman
- Tích hợp kiểm thử tự động trong CI/CD (GitHub Actions)

#### Bảng mô tả kiểm thử
| Loại kiểm thử      | Công cụ      | Mô tả thực hiện                                    |
|--------------------|--------------|----------------------------------------------------|
| Unit test backend  | JUnit        | Test service, repository, controller                |
| Unit test frontend | Jest         | Test component, page, hook                          |
| API test           | Postman      | Test endpoint, kiểm tra response, status code       |
| Integration test   | Manual/Auto  | Test luồng nghiệp vụ từ FE đến BE, DB               |

### 6.2. Kết quả kiểm thử API
- Đã kiểm thử các API chính: đăng nhập, CRUD sản phẩm, đặt hàng, v.v.
- Kết quả: Đạt yêu cầu, không phát hiện lỗi nghiêm trọng

*Ghi chú: Chèn ảnh chụp màn hình Postman, kết quả test, log CI/CD, bảng tổng hợp kết quả test.*

---

## 7. Đánh giá và kết luận

### 7.1. Những khó khăn gặp phải
- Làm việc nhóm online, phân chia task ban đầu chưa hợp lý
- Tích hợp CI/CD, Docker, deploy gặp lỗi cấu hình
- Thiếu kinh nghiệm với một số công nghệ mới
- Quản lý tiến độ, cập nhật Jira chưa đều

### 7.2. Bài học rút ra và đề xuất cải thiện
- Cần lập kế hoạch chi tiết, phân công rõ ràng ngay từ đầu
- Chủ động học hỏi, tìm hiểu công nghệ mới
- Tăng cường giao tiếp, họp nhóm thường xuyên
- Có thể mở rộng thêm các tính năng nâng cao, tích hợp AI, big data, ...

---

## 8. Phụ lục

### 8.1. Hướng dẫn cài đặt và chạy ứng dụng
- Clone repo về máy
- Cài Docker, docker-compose
- Chạy lệnh: `docker-compose up --build`
- Truy cập FE: http://localhost:8000, BE: http://localhost:8082

### 8.2. Liên kết GitHub repository và link demo
- [GitHub Frontend](#)
- [GitHub Backend](#)
- [Link demo online (nếu có)](#)

### 8.3. Tài liệu tham khảo, link Figma, Swagger, ...
- [Figma UI/UX](#)
- [Swagger API](#)

---

*Ghi chú: Các mục trên cần bổ sung hình ảnh, sơ đồ, bảng biểu, mã nguồn, ảnh chụp màn hình để hoàn thiện báo cáo ~30 trang.* 