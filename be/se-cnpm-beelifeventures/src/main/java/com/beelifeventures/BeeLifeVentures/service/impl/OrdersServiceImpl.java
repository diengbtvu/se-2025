package com.beelifeventures.BeeLifeVentures.service.impl;

import com.beelifeventures.BeeLifeVentures.model.dto.OrdersDTO;
import com.beelifeventures.BeeLifeVentures.repository.OrdersRepository;
import com.beelifeventures.BeeLifeVentures.repository.ProductRepository;
import com.beelifeventures.BeeLifeVentures.repository.entity.CustomerEntity;
import com.beelifeventures.BeeLifeVentures.repository.entity.OrderDetailEntity;
import com.beelifeventures.BeeLifeVentures.repository.entity.OrdersEntity;
import com.beelifeventures.BeeLifeVentures.repository.CustomerRepository;
import com.beelifeventures.BeeLifeVentures.repository.entity.ProductEntity;
import com.beelifeventures.BeeLifeVentures.service.OrdersService;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrdersServiceImpl implements OrdersService {
    @Autowired
    private OrdersRepository ordersRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private ProductRepository productRepository;

    @Override
    public List<OrdersDTO> findAll() {
        return ordersRepository.findAll().stream()
                .map(order -> {
                    OrdersDTO dto = modelMapper.map(order, OrdersDTO.class);
                    dto.setCustomerId(order.getCustomer().getId());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    public OrdersDTO findById(Long id) {
        OrdersEntity order = ordersRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        OrdersDTO dto = modelMapper.map(order, OrdersDTO.class);
        dto.setCustomerId(order.getCustomer().getId());
        return dto;
    }

    @Override
    public OrdersDTO save(OrdersDTO ordersDTO) {
        CustomerEntity customer = customerRepository.findById(ordersDTO.getCustomerId())
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));
        OrdersEntity entity = modelMapper.map(ordersDTO, OrdersEntity.class);
        entity.setCustomer(customer);

        // Xử lý orderDetails đúng cách
        if (entity.getOrderDetails() != null) {
            for (OrderDetailEntity detail : entity.getOrderDetails()) {
                detail.setOrder(entity); // set lại quan hệ cha
            }
        }

        OrdersEntity saved = ordersRepository.save(entity);
        OrdersDTO dto = modelMapper.map(saved, OrdersDTO.class);
        dto.setCustomerId(saved.getCustomer().getId());
        return dto;
    }

    @Override
    public void delete(Long id) {
        OrdersEntity order = ordersRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        // Hoàn lại số lượng sản phẩm về kho
        if (order.getOrderDetails() != null) {
            for (OrderDetailEntity detail : order.getOrderDetails()) {
                ProductEntity product = detail.getProduct();
                if (product != null) {
                    Integer currentStock = product.getStockQuantity() != null ? product.getStockQuantity() : 0;
                    product.setStockQuantity(currentStock + detail.getQuantity());
                    productRepository.save(product);
                }
            }
        }

        ordersRepository.delete(order);
    }

    @Override
    public OrdersDTO update(OrdersDTO ordersDTO) {
        OrdersEntity entity = ordersRepository.findById(ordersDTO.getId())
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        CustomerEntity customer = customerRepository.findById(ordersDTO.getCustomerId())
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));
        entity.setCustomer(customer);
        entity.setOrderDate(ordersDTO.getOrderDate());
        entity.setStatus(ordersDTO.getStatus());
        entity.setTotal(ordersDTO.getTotal());
        entity.setNote(ordersDTO.getNote());
        OrdersEntity updated = ordersRepository.save(entity);
        OrdersDTO dto = modelMapper.map(updated, OrdersDTO.class);
        dto.setCustomerId(updated.getCustomer().getId());
        return dto;
    }
}