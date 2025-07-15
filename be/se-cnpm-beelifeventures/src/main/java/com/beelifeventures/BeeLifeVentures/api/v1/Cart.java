package com.beelifeventures.BeeLifeVentures.api.v1;

import com.beelifeventures.BeeLifeVentures.model.dto.*;
import com.beelifeventures.BeeLifeVentures.repository.CustomerRepository;
import com.beelifeventures.BeeLifeVentures.repository.UserAccountRepository;
import com.beelifeventures.BeeLifeVentures.repository.entity.CustomerEntity;
import com.beelifeventures.BeeLifeVentures.repository.entity.UserAccountEntity;
import com.beelifeventures.BeeLifeVentures.security.JwtUtil;
import com.beelifeventures.BeeLifeVentures.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;
@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*", maxAge = 3600)
public class Cart {
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserAccountRepository userAccountRepository;
    
    @Autowired
    private CustomerRepository customerRepository;


    @CrossOrigin(origins = "*")
    @GetMapping
    @Operation(summary = "Get current user's cart", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> getMyCart(HttpServletRequest request) {
        try {
            CustomerEntity customer = getCurrentCustomerFromToken(request);
            CartDTO cart = cartService.getOrCreateCart(customer.getId());
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error getting cart: " + e.getMessage());
        }
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/add")
    @Operation(summary = "Add product to cart", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> addToCart(@Valid @RequestBody AddToCartDTO addToCartDTO, HttpServletRequest request) {
        try {
            CustomerEntity customer = getCurrentCustomerFromToken(request);
            CartDTO cart = cartService.addToCart(customer.getId(), addToCartDTO);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error adding product to cart: " + e.getMessage());
        }
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/update")
    @Operation(summary = "Update cart item quantity", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> updateCartItem(@Valid @RequestBody UpdateCartItemDTO updateCartItemDTO, HttpServletRequest request) {
        try {
            CustomerEntity customer = getCurrentCustomerFromToken(request);
            CartDTO cart = cartService.updateCartItem(customer.getId(), updateCartItemDTO);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error updating cart: " + e.getMessage());
        }
    }

    @CrossOrigin(origins = "*")
    @DeleteMapping("/remove/{productId}")
    @Operation(summary = "Remove product from cart", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> removeFromCart(@PathVariable Long productId, HttpServletRequest request) {
        try {
            CustomerEntity customer = getCurrentCustomerFromToken(request);
            CartDTO cart = cartService.removeFromCart(customer.getId(), productId);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error removing product from cart: " + e.getMessage());
        }
    }

    @CrossOrigin(origins = "*")
    @DeleteMapping("/clear")
    @Operation(summary = "Clear all items from cart", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> clearCart(HttpServletRequest request) {
        try {
            CustomerEntity customer = getCurrentCustomerFromToken(request);
            cartService.clearCart(customer.getId());
            return ResponseEntity.ok("All products have been removed from the cart.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error clearing cart: " + e.getMessage());
        }
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/count")
    @Operation(summary = "Get cart items count", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> getCartItemCount(HttpServletRequest request) {
        try {
            CustomerEntity customer = getCurrentCustomerFromToken(request);
            Integer count = cartService.getCartItemCount(customer.getId());
            return ResponseEntity.ok(count);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error getting product count: " + e.getMessage());
        }
    }

    @CrossOrigin(origins = "*")
    @PostMapping("/checkout")
    @Operation(summary = "Create order from cart", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> createOrderFromCart(@Valid @RequestBody CartToOrderDTO cartToOrderDTO, HttpServletRequest request) {
        try {
            CustomerEntity customer = getCurrentCustomerFromToken(request);
            OrdersDTO order = cartService.createOrderFromCart(customer.getId(), cartToOrderDTO);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error creating order from cart: " + e.getMessage());
        }
    }

    // Helper method to extract customer from JWT token (same as in Orders controller)
    private CustomerEntity getCurrentCustomerFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Invalid token");
        }

        String token = authHeader.substring(7);

        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid or expired token");
        }

        String userName = jwtUtil.extractUsername(token);
        if (userName == null) {
            throw new RuntimeException("Cannot extract user info from token");
        }

        Optional<UserAccountEntity> userAccount = userAccountRepository.findByUserName(userName);
        if (!userAccount.isPresent()) {
            throw new RuntimeException("User not found");
        }

        Optional<CustomerEntity> customer = customerRepository.findByUserAccount(userAccount.get());
        if (!customer.isPresent()) {
            throw new RuntimeException("Customer info not found");
        }

        return customer.get();
    }
}
