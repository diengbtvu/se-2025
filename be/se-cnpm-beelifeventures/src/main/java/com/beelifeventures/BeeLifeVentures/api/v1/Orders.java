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
@CrossOrigin(origins = "*", maxAge = 3600)
public class Orders {
    @Autowired
    private OrdersService ordersService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserAccountRepository userAccountRepository;
    
    @Autowired
    private CustomerRepository customerRepository;
    
    // GET all orders of current account, requires login
    @CrossOrigin(origins = "*")
    @GetMapping
    @Operation(summary = "Get all orders of current user", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> getAllMyOrders(HttpServletRequest request) {
        try {

            CustomerEntity customer = getCurrentCustomerFromToken(request);

            // Get all orders of customer
            List<OrderDetailResponseDTO> orders = ordersService.findAllOrdersByCustomer(customer.getId());
            return ResponseEntity.ok(orders);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error getting order list: " + e.getMessage());
        }
    }

    // GET order by ID (kept for backward compatibility)
    @CrossOrigin(origins = "*")
    @GetMapping("/{id}")
    @Operation(summary = "Get order by ID", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> getOrderById(@PathVariable Long id, HttpServletRequest request) {
        try {
            // Get customer info from JWT token to check permission
            CustomerEntity customer = getCurrentCustomerFromToken(request);

            OrdersDTO order = ordersService.findById(id);

            // Check order ownership
            if (!order.getCustomerId().equals(customer.getId())) {
                return ResponseEntity.badRequest().body("You do not have permission to view this order");
            }

            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error getting order info: " + e.getMessage());
        }
    }

    @CrossOrigin(origins = "*")
    @PostMapping
    @Operation(summary = "Create order", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> createOrder(@RequestBody OrdersCreateDTO ordersCreateDTO, HttpServletRequest request) {
        try {
            // Get customer info from JWT token
            CustomerEntity customer = getCurrentCustomerFromToken(request);

            // Create order with customerId from token
            OrdersDTO savedOrder = ordersService.saveWithCustomer(ordersCreateDTO, customer.getId());
            return ResponseEntity.ok(savedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error creating order: " + e.getMessage());
        }
    }

    @CrossOrigin(origins = "*")
    @PutMapping
    @Operation(summary = "Update order", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> updateOrder(@RequestBody OrderUpdateDTO orderUpdateDTO, HttpServletRequest request) {
        try {
            // Get customer info from JWT token
            CustomerEntity customer = getCurrentCustomerFromToken(request);

            // Update order with customer permission
            OrdersDTO updatedOrder = ordersService.updateOrderByCustomer(orderUpdateDTO, customer.getId());
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error updating order: " + e.getMessage());
        }
    }

    @CrossOrigin(origins = "*")
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete order", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> deleteOrder(@PathVariable Long id, HttpServletRequest request) {
        try {
            // Get customer info from  JWT token to check permission
            CustomerEntity customer = getCurrentCustomerFromToken(request);

            // Check ownership before deleting
            OrdersDTO order = ordersService.findById(id);
            if (!order.getCustomerId().equals(customer.getId())) {
                return ResponseEntity.badRequest().body("You do not have permission to delete this order");
            }

            ordersService.delete(id);
            return ResponseEntity.ok("Order deleted successfully");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting order: " + e.getMessage());
        }
    }

    // Helper method to extract customer from JWT token
    private CustomerEntity getCurrentCustomerFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) 
        {
            throw new RuntimeException("Invalid token");
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.validateToken(token)) 
        {
            throw new RuntimeException("Token is invalid or expired");
        }

        String userName = jwtUtil.extractUsername(token);
        if (userName == null) 
        {
            throw new RuntimeException("Cannot extract user info from token");
        }

        Optional<UserAccountEntity> userAccount = userAccountRepository.findByUserName(userName);
        if (!userAccount.isPresent()) 
        {
            throw new RuntimeException("User info not found");
        }

        Optional<CustomerEntity> customer = customerRepository.findByUserAccount(userAccount.get());
        if (!customer.isPresent()) {
            throw new RuntimeException("Customer info not found");
        }

     
        return customer.get();
    }

}
