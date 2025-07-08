package com.beelifeventures.BeeLifeVentures.service;

import com.beelifeventures.BeeLifeVentures.model.dto.OrderDetailResponseDTO;
import com.beelifeventures.BeeLifeVentures.model.dto.OrderUpdateDTO;
import com.beelifeventures.BeeLifeVentures.model.dto.OrdersCreateDTO;
import com.beelifeventures.BeeLifeVentures.model.dto.OrdersDTO;

import java.util.List;

public interface OrdersService {
    List<OrdersDTO> findAll();
    OrdersDTO findById(Long id);
    OrdersDTO save(OrdersDTO ordersDTO);
    OrdersDTO saveWithCustomer(OrdersCreateDTO ordersCreateDTO, Long customerId);
    void delete(Long id);
    OrdersDTO update(OrdersDTO ordersDTO);
    
    // New methods for enhanced functionality
    List<OrderDetailResponseDTO> findAllOrdersByCustomer(Long customerId);
    OrdersDTO updateOrderByCustomer(OrderUpdateDTO orderUpdateDTO, Long customerId);
}