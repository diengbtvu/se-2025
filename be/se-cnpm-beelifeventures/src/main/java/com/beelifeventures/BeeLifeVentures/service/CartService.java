package com.beelifeventures.BeeLifeVentures.service;

import com.beelifeventures.BeeLifeVentures.model.dto.*;

public interface CartService {
    

    CartDTO getOrCreateCart(Long customerId);
    

    CartDTO addToCart(Long customerId, AddToCartDTO addToCartDTO);
    

    CartDTO updateCartItem(Long customerId, UpdateCartItemDTO updateCartItemDTO);
    

    CartDTO removeFromCart(Long customerId, Long productId);
    

    void clearCart(Long customerId);
    

    OrdersDTO createOrderFromCart(Long customerId, CartToOrderDTO cartToOrderDTO);
    

    Integer getCartItemCount(Long customerId);
}
