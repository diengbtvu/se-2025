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
public class Cart {
    
    @Autowired
    private CartService cartService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserAccountRepository userAccountRepository;
    
    @Autowired
    private CustomerRepository customerRepository;

    /**
     * Lấy giỏ hàng của user hiện tại
     */
    @CrossOrigin(origins = "*")
    @GetMapping
    @Operation(summary = "Get current user's cart", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> getMyCart(HttpServletRequest request) {
        try {
            CustomerEntity customer = getCurrentCustomerFromToken(request);
            CartDTO cart = cartService.getOrCreateCart(customer.getId());
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy giỏ hàng: " + e.getMessage());
        }
    }

    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    @CrossOrigin(origins = "*")
    @PostMapping("/add")
    @Operation(summary = "Add product to cart", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> addToCart(@Valid @RequestBody AddToCartDTO addToCartDTO, HttpServletRequest request) {
        try 
        {
            CustomerEntity customer = getCurrentCustomerFromToken(request);
            CartDTO cart = cartService.addToCart(customer.getId(), addToCartDTO);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi thêm sản phẩm vào giỏ hàng: " + e.getMessage());
        }
    }

    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng
     */
    @CrossOrigin(origins = "*")
    @PutMapping("/update")
    @Operation(summary = "Update cart item quantity", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> updateCartItem(@Valid @RequestBody UpdateCartItemDTO updateCartItemDTO, HttpServletRequest request) {
        try 
        {
            CustomerEntity customer = getCurrentCustomerFromToken(request);
            CartDTO cart = cartService.updateCartItem(customer.getId(), updateCartItemDTO);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi cập nhật giỏ hàng: " + e.getMessage());
        }
    }

    /**
     * Xóa sản phẩm khỏi giỏ hàng
     */
    @CrossOrigin(origins = "*")
    @DeleteMapping("/remove/{productId}")
    @Operation(summary = "Remove product from cart", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> removeFromCart(@PathVariable Long productId, HttpServletRequest request) {
        try {
            CustomerEntity customer = getCurrentCustomerFromToken(request);
            CartDTO cart = cartService.removeFromCart(customer.getId(), productId);
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa sản phẩm khỏi giỏ hàng: " + e.getMessage());
        }
    }

    /**
     * Xóa tất cả sản phẩm khỏi giỏ hàng
     */
    @CrossOrigin(origins = "*")
    @DeleteMapping("/clear")
    @Operation(summary = "Clear all items from cart", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> clearCart(HttpServletRequest request) {
        try {
            CustomerEntity customer = getCurrentCustomerFromToken(request);
            cartService.clearCart(customer.getId());
            return ResponseEntity.ok("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi xóa giỏ hàng: " + e.getMessage());
        }
    }

    /**
     * Lấy số lượng sản phẩm trong giỏ hàng
     */
    @CrossOrigin(origins = "*")
    @GetMapping("/count")
    @Operation(summary = "Get cart items count", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> getCartItemCount(HttpServletRequest request) 
    {
        try {
            CustomerEntity customer = getCurrentCustomerFromToken(request);
            Integer count = cartService.getCartItemCount(customer.getId());
            return ResponseEntity.ok(count);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi lấy số lượng sản phẩm: " + e.getMessage());
        }
    }

    /**
     * Tạo đơn hàng từ giỏ hàng
     */
    @CrossOrigin(origins = "*")
    @PostMapping("/checkout")
    @Operation(summary = "Create order from cart", security = @SecurityRequirement(name = "Bearer Authentication"))
    public ResponseEntity<?> createOrderFromCart(@Valid @RequestBody CartToOrderDTO cartToOrderDTO, HttpServletRequest request) {
        try 
        {
            CustomerEntity customer = getCurrentCustomerFromToken(request);
            OrdersDTO order = cartService.createOrderFromCart(customer.getId(), cartToOrderDTO);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Lỗi khi tạo đơn hàng từ giỏ hàng: " + e.getMessage());
        }
    }

    // Helper method để extract customer từ JWT token (giống như trong Orders controller)
    private CustomerEntity getCurrentCustomerFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) 
        {
            throw new RuntimeException("Token không hợp lệ");
        }

        String token = authHeader.substring(7);
        
        if (!jwtUtil.validateToken(token)) 
        {
            throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn");
        }
        
        String userName = jwtUtil.extractUsername(token);
        if (userName == null) 
        {
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
