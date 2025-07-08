package com.beelifeventures.BeeLifeVentures.service.impl;

import com.beelifeventures.BeeLifeVentures.model.dto.*;
import com.beelifeventures.BeeLifeVentures.repository.*;
import com.beelifeventures.BeeLifeVentures.repository.entity.*;
import com.beelifeventures.BeeLifeVentures.service.CartService;
import com.beelifeventures.BeeLifeVentures.service.OrdersService;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrdersService ordersService;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    @Transactional
    public CartDTO getOrCreateCart(Long customerId) {
        CustomerEntity customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));

        Optional<CartEntity> existingCart = cartRepository.findByCustomer(customer);
        
        CartEntity cart;
        if (existingCart.isPresent()) {
            cart = existingCart.get();
        } else {
            // Tạo giỏ hàng mới
            cart = new CartEntity();
            cart.setCustomer(customer);
            cart.setCartItems(new ArrayList<>());
            cart = cartRepository.save(cart);
        }

        return convertToCartDTO(cart);
    }

    @Override
    @Transactional
    public CartDTO addToCart(Long customerId, AddToCartDTO addToCartDTO) {
        CustomerEntity customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));

        ProductEntity product = productRepository.findById(addToCartDTO.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        // Kiểm tra tồn kho
        if (product.getStockQuantity() < addToCartDTO.getQuantity()) {
            throw new RuntimeException("Không đủ hàng trong kho. Còn lại: " + product.getStockQuantity());
        }

        // Lấy hoặc tạo giỏ hàng
        CartEntity cart = cartRepository.findByCustomer(customer).orElse(null);
        if (cart == null) {
            cart = new CartEntity();
            cart.setCustomer(customer);
            cart.setCartItems(new ArrayList<>());
            cart = cartRepository.save(cart);
        }

        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        Optional<CartItemEntity> existingItem = cartItemRepository.findByCartAndProduct(cart, product);
        
        if (existingItem.isPresent()) {
            // Cập nhật số lượng
            CartItemEntity cartItem = existingItem.get();
            int newQuantity = cartItem.getQuantity() + addToCartDTO.getQuantity();
            
            if (newQuantity > product.getStockQuantity()) {
                throw new RuntimeException("Không đủ hàng trong kho. Còn lại: " + product.getStockQuantity());
            }
            
            cartItem.setQuantity(newQuantity);
            cartItem.setUpdatedAt(LocalDateTime.now());
            cartItemRepository.save(cartItem);
        } else {
            // Thêm sản phẩm mới
            CartItemEntity cartItem = new CartItemEntity();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(addToCartDTO.getQuantity());
            cartItem.setPriceAtTime(product.getPrice());
            cartItemRepository.save(cartItem);
        }

        return convertToCartDTO(cart);
    }

    @Override
    @Transactional
    public CartDTO updateCartItem(Long customerId, UpdateCartItemDTO updateCartItemDTO) {
        CustomerEntity customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));

        CartEntity cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found"));

        ProductEntity product = productRepository.findById(updateCartItemDTO.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        CartItemEntity cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found"));

        // Kiểm tra tồn kho
        if (product.getStockQuantity() < updateCartItemDTO.getQuantity()) {
            throw new RuntimeException("Không đủ hàng trong kho. Còn lại: " + product.getStockQuantity());
        }

        cartItem.setQuantity(updateCartItemDTO.getQuantity());
        cartItem.setUpdatedAt(LocalDateTime.now());
        cartItemRepository.save(cartItem);

        return convertToCartDTO(cart);
    }

    @Override
    @Transactional
    public CartDTO removeFromCart(Long customerId, Long productId) {
        CustomerEntity customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));

        CartEntity cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found"));

        ProductEntity product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        CartItemEntity cartItem = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new EntityNotFoundException("Cart item not found"));

        cartItemRepository.delete(cartItem);

        return convertToCartDTO(cart);
    }

    @Override
    @Transactional
    public void clearCart(Long customerId) {
        CustomerEntity customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));

        Optional<CartEntity> cart = cartRepository.findByCustomer(customer);
        if (cart.isPresent()) {
            cartItemRepository.deleteByCart(cart.get());
        }
    }

    @Override
    @Transactional
    public OrdersDTO createOrderFromCart(Long customerId, CartToOrderDTO cartToOrderDTO) {
        CustomerEntity customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));

        CartEntity cart = cartRepository.findByCustomer(customer)
                .orElseThrow(() -> new EntityNotFoundException("Cart not found"));

        List<CartItemEntity> selectedItems;
        if (cartToOrderDTO.getSelectedCartItemIds() != null && !cartToOrderDTO.getSelectedCartItemIds().isEmpty()) {
            // Lấy các sản phẩm được chọn
            selectedItems = cart.getCartItems().stream()
                    .filter(item -> cartToOrderDTO.getSelectedCartItemIds().contains(item.getId()))
                    .collect(Collectors.toList());
        } else {
            // Lấy tất cả sản phẩm trong giỏ hàng
            selectedItems = cart.getCartItems();
        }

        if (selectedItems.isEmpty()) {
            throw new RuntimeException("Giỏ hàng trống hoặc không có sản phẩm nào được chọn");
        }

        // Tạo OrdersCreateDTO từ cart items
        OrdersCreateDTO ordersCreateDTO = new OrdersCreateDTO();
        ordersCreateDTO.setStatus(cartToOrderDTO.getStatus());
        ordersCreateDTO.setNote(cartToOrderDTO.getNote());

        List<OrderItemDTO> orderItems = selectedItems.stream()
                .map(cartItem -> {
                    OrderItemDTO orderItem = new OrderItemDTO();
                    orderItem.setProductId(cartItem.getProduct().getId());
                    orderItem.setQuantity(cartItem.getQuantity());
                    orderItem.setPrice(cartItem.getPriceAtTime());
                    return orderItem;
                })
                .collect(Collectors.toList());

        ordersCreateDTO.setOrderItems(orderItems);

        // Tạo đơn hàng
        OrdersDTO order = ordersService.saveWithCustomer(ordersCreateDTO, customerId);

        // Xóa các sản phẩm đã order khỏi giỏ hàng
        cartItemRepository.deleteAll(selectedItems);

        return order;
    }

    @Override
    public Integer getCartItemCount(Long customerId) {
        Optional<CartEntity> cart = cartRepository.findByCustomerId(customerId);
        if (cart.isPresent()) {
            return cart.get().getCartItems().stream()
                    .mapToInt(CartItemEntity::getQuantity)
                    .sum();
        }
        return 0;
    }

    private CartDTO convertToCartDTO(CartEntity cart) {
        CartDTO cartDTO = new CartDTO();
        cartDTO.setId(cart.getId());
        cartDTO.setCustomerId(cart.getCustomer().getId());
        cartDTO.setCustomerName(cart.getCustomer().getName());
        cartDTO.setCreatedAt(cart.getCreatedAt());
        cartDTO.setUpdatedAt(cart.getUpdatedAt());

        List<CartItemDTO> cartItemDTOs = cart.getCartItems().stream()
                .map(this::convertToCartItemDTO)
                .collect(Collectors.toList());

        cartDTO.setCartItems(cartItemDTOs);

        // Tính tổng tiền và số lượng
        BigDecimal totalAmount = cartItemDTOs.stream()
                .map(CartItemDTO::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Integer totalItems = cartItemDTOs.stream()
                .mapToInt(CartItemDTO::getQuantity)
                .sum();

        cartDTO.setTotalAmount(totalAmount);
        cartDTO.setTotalItems(totalItems);

        return cartDTO;
    }

    private CartItemDTO convertToCartItemDTO(CartItemEntity cartItem) {
        CartItemDTO dto = new CartItemDTO();
        dto.setId(cartItem.getId());
        dto.setCartId(cartItem.getCart().getId());
        dto.setProductId(cartItem.getProduct().getId());
        dto.setProductName(cartItem.getProduct().getName());
        dto.setProductDescription(cartItem.getProduct().getDescription());
        dto.setProductImageUrl(cartItem.getProduct().getImageUrl());
        dto.setProductType(cartItem.getProduct().getProductType());
        dto.setQuantity(cartItem.getQuantity());
        dto.setPriceAtTime(cartItem.getPriceAtTime());
        dto.setCurrentPrice(cartItem.getProduct().getPrice());
        dto.setTotalPrice(cartItem.getPriceAtTime().multiply(BigDecimal.valueOf(cartItem.getQuantity())));
        dto.setStockQuantity(cartItem.getProduct().getStockQuantity());
        dto.setCreatedAt(cartItem.getCreatedAt());
        dto.setUpdatedAt(cartItem.getUpdatedAt());
        return dto;
    }
}
