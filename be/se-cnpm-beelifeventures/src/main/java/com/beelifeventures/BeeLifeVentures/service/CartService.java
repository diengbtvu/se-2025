package com.beelifeventures.BeeLifeVentures.service;

import com.beelifeventures.BeeLifeVentures.model.dto.*;

public interface CartService {
    
    /**
     * Lấy giỏ hàng của customer (tạo mới nếu chưa có)
     */
    CartDTO getOrCreateCart(Long customerId);
    
    /**
     * Thêm sản phẩm vào giỏ hàng
     */
    CartDTO addToCart(Long customerId, AddToCartDTO addToCartDTO);
    
    /**
     * Cập nhật số lượng sản phẩm trong giỏ hàng
     */
    CartDTO updateCartItem(Long customerId, UpdateCartItemDTO updateCartItemDTO);
    
    /**
     * Xóa sản phẩm khỏi giỏ hàng
     */
    CartDTO removeFromCart(Long customerId, Long productId);
    
    /**
     * Xóa tất cả sản phẩm khỏi giỏ hàng
     */
    void clearCart(Long customerId);
    
    /**
     * Tạo đơn hàng từ giỏ hàng
     */
    OrdersDTO createOrderFromCart(Long customerId, CartToOrderDTO cartToOrderDTO);
    
    /**
     * Đếm số lượng sản phẩm trong giỏ hàng
     */
    Integer getCartItemCount(Long customerId);
}
