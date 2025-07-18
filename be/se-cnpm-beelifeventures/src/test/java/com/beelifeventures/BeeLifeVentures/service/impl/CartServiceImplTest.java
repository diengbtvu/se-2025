package com.beelifeventures.BeeLifeVentures.service.impl;

import com.beelifeventures.BeeLifeVentures.model.dto.AddToCartDTO;
import com.beelifeventures.BeeLifeVentures.model.dto.CartDTO;
import com.beelifeventures.BeeLifeVentures.repository.CartItemRepository;
import com.beelifeventures.BeeLifeVentures.repository.CartRepository;
import com.beelifeventures.BeeLifeVentures.repository.CustomerRepository;
import com.beelifeventures.BeeLifeVentures.repository.ProductRepository;
import com.beelifeventures.BeeLifeVentures.repository.entity.CartEntity;
import com.beelifeventures.BeeLifeVentures.repository.entity.CustomerEntity;
import com.beelifeventures.BeeLifeVentures.repository.entity.ProductEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CartServiceImplTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private CartServiceImpl cartService;

    private CustomerEntity customer;
    private ProductEntity product;
    private CartEntity cart;

    @BeforeEach
    void setUp() {
        customer = new CustomerEntity();
        customer.setId(1L);

        product = new ProductEntity();
        product.setId(1L);
        product.setStockQuantity(10);

        cart = new CartEntity();
        cart.setId(1L);
        cart.setCustomer(customer);
        cart.setCartItems(new ArrayList<>());
    }

    @Test
    void getOrCreateCart_ShouldReturnExistingCart() {
        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(cartRepository.findByCustomer(customer)).thenReturn(Optional.of(cart));
        when(modelMapper.map(any(), any())).thenReturn(new CartDTO());


        CartDTO result = cartService.getOrCreateCart(1L);

        assertNotNull(result);
    }

    @Test
    void addToCart_ShouldAddToCart() {
        AddToCartDTO addToCartDTO = new AddToCartDTO();
        addToCartDTO.setProductId(1L);
        addToCartDTO.setQuantity(1);

        when(customerRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(cartRepository.findByCustomer(customer)).thenReturn(Optional.of(cart));
        when(cartItemRepository.findByCartAndProduct(cart, product)).thenReturn(Optional.empty());
        when(modelMapper.map(any(), any())).thenReturn(new CartDTO());


        CartDTO result = cartService.addToCart(1L, addToCartDTO);

        assertNotNull(result);
    }
}
