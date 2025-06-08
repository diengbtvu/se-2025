package com.beelifeventures.BeeLifeVentures.service.impl;

import com.beelifeventures.BeeLifeVentures.model.dto.OrderItemDTO;
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
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
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
    public OrdersDTO findById(Long id) {
        OrdersEntity order = ordersRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        
        OrdersDTO dto = modelMapper.map(order, OrdersDTO.class);
        dto.setCustomerId(order.getCustomer().getId());
        dto.setCustomerName(order.getCustomer().getName()); // Thêm dòng này
        
        // Map thông tin chi tiết đơn hàng
        if (order.getOrderDetails() != null) {
            List<OrderItemDTO> items = order.getOrderDetails().stream()
                .map(detail -> {
                    OrderItemDTO itemDTO = new OrderItemDTO();
                    itemDTO.setProductId(detail.getProduct().getId());
                    itemDTO.setQuantity(detail.getQuantity());
                    itemDTO.setPrice(detail.getPrice());
                    return itemDTO;
                })
                .collect(Collectors.toList());
            dto.setOrderItems(items);
            dto.setTotal(order.getTotal());
        }
        
        return dto;
    }

    @Override
    public List<OrdersDTO> findAll() {
        return ordersRepository.findAll().stream()
                .map(order -> {
                    OrdersDTO dto = modelMapper.map(order, OrdersDTO.class);
                    dto.setCustomerId(order.getCustomer().getId());
                    dto.setCustomerName(order.getCustomer().getName()); // Thêm dòng này
                    
                    // Map thông tin chi tiết đơn hàng
                    if (order.getOrderDetails() != null) {
                        List<OrderItemDTO> items = order.getOrderDetails().stream()
                            .map(detail -> {
                                OrderItemDTO itemDTO = new OrderItemDTO();
                                itemDTO.setProductId(detail.getProduct().getId());
                                itemDTO.setQuantity(detail.getQuantity());
                                itemDTO.setPrice(detail.getPrice());
                                return itemDTO;
                            })
                            .collect(Collectors.toList());
                        dto.setOrderItems(items);
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrdersDTO save(OrdersDTO ordersDTO) {
        // Kiểm tra customer
        CustomerEntity customer = customerRepository.findById(ordersDTO.getCustomerId())
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));

        BigDecimal total = BigDecimal.ZERO;
        List<OrderDetailEntity> orderDetails = new ArrayList<>();

        // Kiểm tra và cập nhật số lượng tồn kho
        if (ordersDTO.getOrderItems() != null && !ordersDTO.getOrderItems().isEmpty()) {
            for (OrderItemDTO item : ordersDTO.getOrderItems()) {
                ProductEntity product = productRepository.findById(item.getProductId())
                        .orElseThrow(() -> new EntityNotFoundException("Product not found: " + item.getProductId()));

                // Kiểm tra số lượng tồn kho
                if (product.getStockQuantity() < item.getQuantity()) {
                    throw new RuntimeException("Insufficient stock for product: " + product.getName());
                }

                // Tính tiền cho từng sản phẩm
                BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
                total = total.add(itemTotal);

                // Tạo chi tiết đơn hàng
                OrderDetailEntity detail = new OrderDetailEntity();
                detail.setProduct(product);
                detail.setQuantity(item.getQuantity());
                detail.setPrice(product.getPrice()); // Lưu giá tại thời điểm đặt hàng
                orderDetails.add(detail);

                // Trừ số lượng tồn kho
                product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
                productRepository.save(product);
            }
        }

        // Lưu đơn hàng
        OrdersEntity entity = new OrdersEntity();
        entity.setCustomer(customer);
        entity.setOrderDate(LocalDateTime.now());
        entity.setStatus(ordersDTO.getStatus());
        entity.setNote(ordersDTO.getNote());
        entity.setTotal(total); // Lưu tổng tiền đã tính

        // Thiết lập quan hệ hai chiều
        entity.setOrderDetails(orderDetails);
        orderDetails.forEach(detail -> detail.setOrder(entity));

        OrdersEntity saved = ordersRepository.save(entity);

        // Map về DTO để trả về
        OrdersDTO dto = modelMapper.map(saved, OrdersDTO.class);
        dto.setCustomerId(saved.getCustomer().getId());
        dto.setTotal(total);

        // Map chi tiết đơn hàng
        List<OrderItemDTO> itemDTOs = saved.getOrderDetails().stream()
            .map(detail -> {
                OrderItemDTO itemDTO = new OrderItemDTO();
                itemDTO.setProductId(detail.getProduct().getId());
                itemDTO.setQuantity(detail.getQuantity());
                itemDTO.setPrice(detail.getPrice());
                return itemDTO;
            })
            .collect(Collectors.toList());
        dto.setOrderItems(itemDTOs);

        return dto;
    }

    @Override
    @Transactional
    public void delete(Long id) {
        OrdersEntity order = ordersRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        // Hoàn số lượng sản phẩm về kho
        if (order.getOrderDetails() != null) {
            for (OrderDetailEntity detail : order.getOrderDetails()) {
                ProductEntity product = detail.getProduct();
                // Cộng lại số lượng đã order vào kho
                product.setStockQuantity(product.getStockQuantity() + detail.getQuantity());
                productRepository.save(product);
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