package com.beelifeventures.BeeLifeVentures.api.v1;

import com.beelifeventures.BeeLifeVentures.model.dto.*;
import com.beelifeventures.BeeLifeVentures.repository.UserAccountRepository;
import com.beelifeventures.BeeLifeVentures.repository.entity.UserAccountEntity;
import com.beelifeventures.BeeLifeVentures.security.JwtUtil;
import com.beelifeventures.BeeLifeVentures.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class Admin {

    @Autowired
    private AdminService adminService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserAccountRepository userAccountRepository;

    // ========================= DASHBOARD =========================
    
    /**
     * Lấy thông tin dashboard tổng quan
     */
    @CrossOrigin(origins = "*")
    @GetMapping("/dashboard")
    @Operation(summary = "Get admin dashboard data", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> getDashboard(HttpServletRequest request) {
        try {
            if (!isAdmin(request)) {
                return ResponseEntity.status(403).body("Access denied. Admin role required.");
            }
            
            AdminDashboardDTO dashboard = adminService.getDashboardData();
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy thông tin dashboard: " + e.getMessage());
        }
    }

    // ========================= USER MANAGEMENT =========================

    /**
     * Lấy danh sách tất cả người dùng (không phân trang)
     */
    @CrossOrigin(origins = "*")
    @GetMapping("/users")
    @Operation(summary = "Get all users", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> getAllUsers(HttpServletRequest request) {
        try {
            if (!isAdmin(request)) {
                return ResponseEntity.status(403).body("Access denied. Admin role required.");
            }
            
            List<AdminUserManagementDTO> users = adminService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy danh sách người dùng: " + e.getMessage());
        }
    }

    /**
     * Lấy danh sách người tùy chọn
     */
    @CrossOrigin(origins = "*")
    @GetMapping("/users/paginated")
    @Operation(summary = "Get all users with to .", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> getAllUsersWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {
        try {
            if (!isAdmin(request)) {
                return ResponseEntity.status(403).body("Access denied. Admin role required.");
            }
            
            Pageable pageable = PageRequest.of(page, size);
            Page<AdminUserManagementDTO> users = adminService.getAllUsersWithPagination(pageable);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy danh sách người dùng: " + e.getMessage());
        }
    }

    /**
     * Lấy thông tin user theo ID
     */
    @CrossOrigin(origins = "*")
    @GetMapping("/users/{userId}")
    @Operation(summary = "Get user by ID", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> getUserById(@PathVariable Long userId, HttpServletRequest request) {
        try {
            if (!isAdmin(request)) {
                return ResponseEntity.status(403).body("Access denied. Admin role required.");
            }
            
            AdminUserManagementDTO user = adminService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy thông tin người dùng: " + e.getMessage());
        }
    }

    /**
     * Xóa người dùng
     */
    @CrossOrigin(origins = "*")
    @DeleteMapping("/users/{userId}")
    @Operation(summary = "Delete user", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> deleteUser(@PathVariable Long userId, HttpServletRequest request) {
        try {
            if (!isAdmin(request)) {
                return ResponseEntity.status(403).body("Access denied. Admin role required.");
            }
            
            adminService.deleteUser(userId);
            return ResponseEntity.ok("Xóa người dùng thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa người dùng: " + e.getMessage());
        }
    }

    /**
     * Tìm kiếm người dùng
     */
    @CrossOrigin(origins = "*")
    @GetMapping("/users/search")
    @Operation(summary = "Search users", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> searchUsers(@RequestParam String keyword, HttpServletRequest request) {
        try {
            if (!isAdmin(request)) {
                return ResponseEntity.status(403).body("Access denied. Admin role required.");
            }
            
            List<AdminUserManagementDTO> users = adminService.searchUsers(keyword);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi tìm kiếm người dùng: " + e.getMessage());
        }
    }

    // ========================= Quản lý sản phẩm =========================

    /**
     * Tạo sản phẩm mới
     */
    @CrossOrigin(origins = "*")
    @PostMapping("/products")
    @Operation(summary = "Create new product", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductDTO productDTO, HttpServletRequest request) {
        try {
            if (!isAdmin(request)) {
                return ResponseEntity.status(403).body("Access denied. Admin role required.");
            }
            
            ProductDTO createdProduct = adminService.createProduct(productDTO);
            return ResponseEntity.ok(createdProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi tạo sản phẩm: " + e.getMessage());
        }
    }

    /**
     * Cập nhật sản phẩm
     */
    @CrossOrigin(origins = "*")
    @PutMapping("/products/{productId}")
    @Operation(summary = "Update product", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> updateProduct(
            @PathVariable Long productId,
            @Valid @RequestBody ProductDTO productDTO,
            HttpServletRequest request) {
        try {
            if (!isAdmin(request)) {
                return ResponseEntity.status(403).body("Access denied. Admin role required.");
            }
            
            ProductDTO updatedProduct = adminService.updateProduct(productId, productDTO);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi cập nhật sản phẩm: " + e.getMessage());
        }
    }

    /**
     * Xóa sản phẩm
     */
    @CrossOrigin(origins = "*")
    @DeleteMapping("/products/{productId}")
    @Operation(summary = "Delete product", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId, HttpServletRequest request) {
        try {
            if (!isAdmin(request)) {
                return ResponseEntity.status(403).body("Access denied. Admin role required.");
            }
            
            adminService.deleteProduct(productId);
            return ResponseEntity.ok("Xóa sản phẩm thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa sản phẩm: " + e.getMessage());
        }
    }

    /**
     * Lấy tất cả sản phẩm cho admin
     */
    @CrossOrigin(origins = "*")
    @GetMapping("/products")
    @Operation(summary = "Get all products for admin", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {
        try {
            if (!isAdmin(request)) {
                return ResponseEntity.status(403).body("Access denied. Admin role required.");
            }
            
            if (page == -1) {
                // Lấy tất cả không phân trang
                List<ProductDTO> products = adminService.getAllProductsForAdmin();
                return ResponseEntity.ok(products);
            } else {
                // Phân trang
                Pageable pageable = PageRequest.of(page, size);
                Page<ProductDTO> products = adminService.getProductsWithPagination(pageable);
                return ResponseEntity.ok(products);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy danh sách sản phẩm: " + e.getMessage());
        }
    }

    // ========================= Quản Lý orders =========================

    /**
     * Lấy tất cả đơn hàng
     */
    @CrossOrigin(origins = "*")
    @GetMapping("/orders")
    @Operation(summary = "Get all orders for admin", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {
        try {
            if (!isAdmin(request)) {
                return ResponseEntity.status(403).body("Access denied. Admin role required.");
            }
            
            Pageable pageable = PageRequest.of(page, size);
            Page<OrderDetailResponseDTO> orders = adminService.getAllOrders(pageable);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy danh sách đơn hàng: " + e.getMessage());
        }
    }

    /**
     * Lấy đơn hàng theo ID
     */
    @CrossOrigin(origins = "*")
    @GetMapping("/orders/{orderId}")
    @Operation(summary = "Get order by ID", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> getOrderById(@PathVariable Long orderId, HttpServletRequest request) {
        try {
            if (!isAdmin(request)) {
                return ResponseEntity.status(403).body("Access denied. Admin role required.");
            }
            
            OrderDetailResponseDTO order = adminService.getOrderById(orderId);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy thông tin đơn hàng: " + e.getMessage());
        }
    }

    /**
     * Cập nhật trạng thái đơn hàng
     */
    @CrossOrigin(origins = "*")
    @PutMapping("/orders/{orderId}/status")
    @Operation(summary = "Update order status", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody AdminOrderStatusUpdateDTO statusUpdate,
            HttpServletRequest request) {
        try {
            if (!isAdmin(request)) {
                return ResponseEntity.status(403).body("Access denied. Admin role required.");
            }
            
            adminService.updateOrderStatus(orderId, statusUpdate);
            return ResponseEntity.ok("Cập nhật trạng thái đơn hàng thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi cập nhật trạng thái đơn hàng: " + e.getMessage());
        }
    }

    /**
     * Xóa đơn hàng
     */
    @CrossOrigin(origins = "*")
    @DeleteMapping("/orders/{orderId}")
    @Operation(summary = "Delete order", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> deleteOrder(@PathVariable Long orderId, HttpServletRequest request) {
        try {
            if (!isAdmin(request)) {
                return ResponseEntity.status(403).body("Access denied. Admin role required.");
            }
            
            adminService.deleteOrder(orderId);
            return ResponseEntity.ok("Xóa đơn hàng thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa đơn hàng: " + e.getMessage());
        }
    }

    /**
     * Lấy đơn hàng theo trạng thái
     */
    @CrossOrigin(origins = "*")
    @GetMapping("/orders/status/{status}")
    @Operation(summary = "Get orders by status", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> getOrdersByStatus(@PathVariable String status, HttpServletRequest request) {
        try {
            if (!isAdmin(request)) {
                return ResponseEntity.status(403).body("Access denied. Admin role required.");
            }
            
            List<OrderDetailResponseDTO> orders = adminService.getOrdersByStatus(status);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy đơn hàng theo trạng thái: " + e.getMessage());
        }
    }

    // ========================= Daassbo report danh thu =========================

    /**
     * Lấy báo cáo doanh thu theo khoảng thời gian
     */
    @CrossOrigin(origins = "*")
    @GetMapping("/revenue/report")
    @Operation(summary = "Get revenue report", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> getRevenueReport(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate fromDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate toDate,
            HttpServletRequest request) {
        try {
            if (!isAdmin(request)) {
                return ResponseEntity.status(403).body("Access denied. Admin role required.");
            }
            
            AdminRevenueReportDTO report = adminService.getRevenueReport(fromDate, toDate);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy báo cáo doanh thu: " + e.getMessage());
        }
    }

    /**
     * Lấy số lượt truy cập hiện tại (số user đã login trong 24h qua)
     */
    @CrossOrigin(origins = "*")
    @GetMapping("/active-users")
    @Operation(summary = "Get current active users count", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> getCurrentActiveUsers(HttpServletRequest request) {
        try {
            if (!isAdmin(request)) {
                return ResponseEntity.status(403).body("Access denied. Admin role required.");
            }
            
            Long activeUsersCount = adminService.getCurrentActiveUsers();
            Map<String, Object> response = new HashMap<>();
            response.put("activeUsersCount", activeUsersCount);
            response.put("description", "Số lượt truy cập trong 24 giờ qua");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy số lượt truy cập: " + e.getMessage());
        }
    }

    // =========================  METHODS =========================

    /**
     * Kiểm tra quyền admin
     */
    private boolean isAdmin(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return false;
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return false;
            }

            String userName = jwtUtil.extractUsername(token);
            if (userName == null) {
                return false;
            }

            return adminService.isAdmin(userName);
        } catch (Exception e) {
            return false;
        }
    }
}
