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
@CrossOrigin(origins = "*", maxAge = 3600)
public class Admin {

    @Autowired
    private AdminService adminService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserAccountRepository userAccountRepository;

    // ========================= DASHBOARD =========================
    
    /**
     * Get overview dashboard information
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
            return ResponseEntity.badRequest().body("Error getting dashboard info: " + e.getMessage());
        }
    }

    // ========================= USER MANAGEMENT =========================

    /**
     * Get all users (not paginated)
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
            return ResponseEntity.badRequest().body("Error getting user list: " + e.getMessage());
        }
    }

    /**
     * Get paginated user list
     */
    @CrossOrigin(origins = "*")
    @GetMapping("/users/paginated")
    @Operation(summary = "Get all users with pagination", security = @SecurityRequirement(name = "Bearer Authentication"))
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
            return ResponseEntity.badRequest().body("Error getting user list: " + e.getMessage());
        }
    }

    /**
     * Get user info by ID
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
            return ResponseEntity.badRequest().body("Error getting user info: " + e.getMessage());
        }
    }

    /**
     * Delete user
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
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting user: " + e.getMessage());
        }
    }

    /**
     * Search users
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
            return ResponseEntity.badRequest().body("Error searching users: " + e.getMessage());
        }
    }

    // ========================= PRODUCT MANAGEMENT =========================

    /**
     * Create new product
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
            return ResponseEntity.badRequest().body("Error creating product: " + e.getMessage());
        }
    }

    /**
     * Update product
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
            return ResponseEntity.badRequest().body("Error updating product: " + e.getMessage());
        }
    }

    /**
     * Delete product
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
            return ResponseEntity.ok("Product deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting product: " + e.getMessage());
        }
    }

    /**
     * Get all products for admin
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
                // Get all products without pagination
                List<ProductDTO> products = adminService.getAllProductsForAdmin();
                return ResponseEntity.ok(products);
            } else {
                // Paginated
                Pageable pageable = PageRequest.of(page, size);
                Page<ProductDTO> products = adminService.getProductsWithPagination(pageable);
                return ResponseEntity.ok(products);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting product list: " + e.getMessage());
        }
    }

    // ========================= ORDER MANAGEMENT =========================

    /**
     * Get all orders
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
            return ResponseEntity.badRequest().body("Error getting order list: " + e.getMessage());
        }
    }

    /**
     * Get order by ID
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
            return ResponseEntity.badRequest().body("Error getting order info: " + e.getMessage());
        }
    }

    /**
     * Update order status
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
            return ResponseEntity.ok("Order status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating order status: " + e.getMessage());
        }
    }

    /**
     * Delete order
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
            return ResponseEntity.ok("Order deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting order: " + e.getMessage());
        }
    }

    /**
     * Get orders by status
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
            return ResponseEntity.badRequest().body("Error getting orders by status: " + e.getMessage());
        }
    }

    // ========================= Revenue Report =========================

    /**
     * Get revenue report by date range
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
            return ResponseEntity.badRequest().body("Error getting revenue report: " + e.getMessage());
        }
    }

    /**
     * Get current active users count (users logged in within last 24 hours)
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
            response.put("description", "Number of logins in the last 24 hours");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error getting active users count: " + e.getMessage());
        }
    }

    // =========================  METHODS =========================

    /**
     * Check admin permission
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
