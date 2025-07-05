package com.beelifeventures.BeeLifeVentures.api.v1;

import com.beelifeventures.BeeLifeVentures.model.dto.*;
import com.beelifeventures.BeeLifeVentures.repository.CustomerRepository;
import com.beelifeventures.BeeLifeVentures.repository.UserAccountRepository;
import com.beelifeventures.BeeLifeVentures.repository.entity.CustomerEntity;
import com.beelifeventures.BeeLifeVentures.repository.entity.UserAccountEntity;
import com.beelifeventures.BeeLifeVentures.security.JwtUtil;
import com.beelifeventures.BeeLifeVentures.service.OrdersService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class Orders {
    @Autowired
    private OrdersService ordersService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserAccountRepository userAccountRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    // GET tất cả orders của user hiện tại (yêu cầu đăng nhập)
    @CrossOrigin(origins = "*")
    @GetMapping
    @Operation(summary = "Get all orders of current user", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> getAllMyOrders(HttpServletRequest request) {
        try {
            // Lấy thông tin customer từ JWT token
            CustomerEntity customer = getCurrentCustomerFromToken(request);
            
            // Lấy tất cả orders của customer
            List<OrderDetailResponseDTO> orders = ordersService.findAllOrdersByCustomer(customer.getId());
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy danh sách đơn hàng: " + e.getMessage());
        }
    }

    // GET order theo ID (giữ lại cho backward compatibility)
    @CrossOrigin(origins = "*")
    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> getOrderById(@PathVariable Long id, HttpServletRequest request) {
        try {
            // Lấy thông tin customer từ JWT token để kiểm tra quyền
            CustomerEntity customer = getCurrentCustomerFromToken(request);
            
            OrdersDTO order = ordersService.findById(id);
            
            // Kiểm tra quyền sở hữu đơn hàng
            if (!order.getCustomerId().equals(customer.getId())) {
                return ResponseEntity.badRequest().body("Không có quyền xem đơn hàng này");
            }
            
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy thông tin đơn hàng: " + e.getMessage());
        }
    }

    @CrossOrigin(origins = "*")
    @PostMapping
    @Operation(summary = "Create order", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> createOrder(@RequestBody OrdersCreateDTO ordersCreateDTO, HttpServletRequest request) {
        try {
            // Lấy thông tin customer từ JWT token
            CustomerEntity customer = getCurrentCustomerFromToken(request);
            
            // Tạo order với customerId từ token
            OrdersDTO savedOrder = ordersService.saveWithCustomer(ordersCreateDTO, customer.getId());
            return ResponseEntity.ok(savedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi tạo đơn hàng: " + e.getMessage());
        }
    }

    @CrossOrigin(origins = "*")
    @PutMapping
    @Operation(summary = "Update order", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> updateOrder(@RequestBody OrderUpdateDTO orderUpdateDTO, HttpServletRequest request) {
        try {
            // Lấy thông tin customer từ JWT token
            CustomerEntity customer = getCurrentCustomerFromToken(request);
            
            // Cập nhật order với quyền customer
            OrdersDTO updatedOrder = ordersService.updateOrderByCustomer(orderUpdateDTO, customer.getId());
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi cập nhật đơn hàng: " + e.getMessage());
        }
    }

    @CrossOrigin(origins = "*")
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete order", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> deleteOrder(@PathVariable Long id, HttpServletRequest request) {
        try {
            // Lấy thông tin customer từ JWT token để kiểm tra quyền
            CustomerEntity customer = getCurrentCustomerFromToken(request);
            
            // Kiểm tra quyền sở hữu trước khi xóa
            OrdersDTO order = ordersService.findById(id);
            if (!order.getCustomerId().equals(customer.getId())) {
                return ResponseEntity.badRequest().body("Không có quyền xóa đơn hàng này");
            }
            
            ordersService.delete(id);
            return ResponseEntity.ok("Đã xóa đơn hàng thành công");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa đơn hàng: " + e.getMessage());
        }
    }

    // Helper method để extract customer từ JWT token
    private CustomerEntity getCurrentCustomerFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Token không hợp lệ");
        }

        String token = authHeader.substring(7);
        
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn");
        }
        
        String userName = jwtUtil.extractUsername(token);
        if (userName == null) {
            throw new RuntimeException("Không thể lấy thông tin user từ token");
        }

        Optional<UserAccountEntity> userAccount = userAccountRepository.findByUserName(userName);
        if (!userAccount.isPresent()) {
            throw new RuntimeException("Không tìm thấy thông tin người dùng");
        }

        Optional<CustomerEntity> customer = customerRepository.findByUserAccount(userAccount.get());
        if (!customer.isPresent()) {
            throw new RuntimeException("Không tìm thấy thông tin khách hàng");
        }

        return customer.get();
    }

}
