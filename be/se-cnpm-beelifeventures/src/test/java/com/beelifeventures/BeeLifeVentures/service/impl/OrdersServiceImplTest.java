package com.beelifeventures.BeeLifeVentures.service.impl;

import com.beelifeventures.BeeLifeVentures.model.dto.OrdersDTO;
import com.beelifeventures.BeeLifeVentures.repository.CustomerRepository;
import com.beelifeventures.BeeLifeVentures.repository.OrdersRepository;
import com.beelifeventures.BeeLifeVentures.repository.ProductRepository;
import com.beelifeventures.BeeLifeVentures.repository.entity.CustomerEntity;
import com.beelifeventures.BeeLifeVentures.repository.entity.OrdersEntity;
import com.beelifeventures.BeeLifeVentures.repository.entity.ProductEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrdersServiceImplTest {

    @Mock
    private OrdersRepository ordersRepository;

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private OrdersServiceImpl ordersService;

    private OrdersEntity order;
    private CustomerEntity customer;
    private ProductEntity product;

    @BeforeEach
    void setUp() {
        customer = new CustomerEntity();
        customer.setId(1L);

        product = new ProductEntity();
        product.setId(1L);
        product.setStockQuantity(10);

        order = new OrdersEntity();
        order.setId(1L);
        order.setCustomer(customer);
    }

    @Test
    void findById_ShouldReturnOrder() {
        when(ordersRepository.findById(1L)).thenReturn(Optional.of(order));
        when(modelMapper.map(any(), any())).thenReturn(new OrdersDTO());


        OrdersDTO result = ordersService.findById(1L);

        assertNotNull(result);
    }

    @Test
    void findAll_ShouldReturnAllOrders() {
        when(ordersRepository.findAll()).thenReturn(Collections.singletonList(order));
        when(modelMapper.map(any(), any())).thenReturn(new OrdersDTO());


        List<OrdersDTO> result = ordersService.findAll();

        assertNotNull(result);
    }
}
