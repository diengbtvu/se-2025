package com.beelifeventures.BeeLifeVentures.service;

import com.beelifeventures.BeeLifeVentures.model.dto.OrdersDTO;

import java.util.List;

public interface OrdersService {
    List<OrdersDTO> findAll();
    OrdersDTO findById(Long id);
    OrdersDTO save(OrdersDTO ordersDTO);
    void delete(Long id);
    OrdersDTO update(OrdersDTO ordersDTO);
}