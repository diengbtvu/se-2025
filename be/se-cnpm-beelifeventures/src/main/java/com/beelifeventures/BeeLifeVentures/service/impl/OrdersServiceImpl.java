package com.beelifeventures.BeeLifeVentures.service.impl;

import com.beelifeventures.BeeLifeVentures.model.dto.*;
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
        dto.setCustomerName(order.getCustomer().getName()); 
        
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

    @Override
    @Transactional
    public OrdersDTO saveWithCustomer(OrdersCreateDTO ordersCreateDTO, Long customerId) {
        // Kiểm tra customer
        CustomerEntity customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new EntityNotFoundException("Customer not found"));

        BigDecimal total = BigDecimal.ZERO;
        List<OrderDetailEntity> orderDetails = new ArrayList<>();

        // Kiểm tra và cập nhật số lượng tồn kho
        if (ordersCreateDTO.getOrderItems() != null && !ordersCreateDTO.getOrderItems().isEmpty()) {
            for (OrderItemDTO item : ordersCreateDTO.getOrderItems()) {
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
        entity.setStatus(ordersCreateDTO.getStatus() != null ? ordersCreateDTO.getStatus() : "PENDING");
        entity.setNote(ordersCreateDTO.getNote());
        entity.setTotal(total); // Lưu tổng tiền đã tính

        // Thiết lập quan hệ hai chiều
        entity.setOrderDetails(orderDetails);
        orderDetails.forEach(detail -> detail.setOrder(entity));

        OrdersEntity saved = ordersRepository.save(entity);

        // Map về DTO để trả về
        OrdersDTO dto = modelMapper.map(saved, OrdersDTO.class);
        dto.setCustomerId(saved.getCustomer().getId());
        dto.setCustomerName(saved.getCustomer().getName());
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
    public List<OrderDetailResponseDTO> findAllOrdersByCustomer(Long customerId) {
        // Tìm tất cả orders của customer sử dụng repository method
        List<OrdersEntity> orders = ordersRepository.findByCustomerId(customerId);

        return orders.stream()
                .map(order -> {
                    OrderDetailResponseDTO dto = new OrderDetailResponseDTO();
                    dto.setOrderId(order.getId());
                    dto.setCustomerName(order.getCustomer().getName());
                    dto.setCustomerPhone(order.getCustomer().getPhoneNumber());
                    dto.setCustomerEmail(order.getCustomer().getEmail());
                    dto.setCustomerAddress(order.getCustomer().getAddress());
                    dto.setOrderDate(order.getOrderDate());
                    dto.setStatus(order.getStatus());
                    dto.setTotal(order.getTotal());
                    dto.setNote(order.getNote());

                    // Map order items với thông tin sản phẩm
                    if (order.getOrderDetails() != null) {
                        List<OrderItemDetailDTO> items = order.getOrderDetails().stream()
                                .map(detail -> {
                                    OrderItemDetailDTO itemDTO = new OrderItemDetailDTO();
                                    itemDTO.setProductId(detail.getProduct().getId());
                                    itemDTO.setProductName(detail.getProduct().getName());
                                    itemDTO.setQuantity(detail.getQuantity());
                                    itemDTO.setPrice(detail.getPrice());
                                    itemDTO.setTotal(detail.getPrice().multiply(BigDecimal.valueOf(detail.getQuantity())));
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
    public OrdersDTO updateOrderByCustomer(OrderUpdateDTO orderUpdateDTO, Long customerId) {
        // Tìm order và kiểm tra quyền sở hữu
        OrdersEntity order = ordersRepository.findById(orderUpdateDTO.getOrderId())
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));

        if (!order.getCustomer().getId().equals(customerId)) {
            throw new RuntimeException("Không có quyền chỉnh sửa đơn hàng này");
        }

        // Chỉ cho phép cập nhật nếu trạng thái là PENDING
        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Chỉ có thể chỉnh sửa đơn hàng đang chờ xử lý");
        }

        // Cập nhật địa chỉ customer
        if (orderUpdateDTO.getCustomerAddress() != null && !orderUpdateDTO.getCustomerAddress().trim().isEmpty()) {
            CustomerEntity customer = order.getCustomer();
            customer.setAddress(orderUpdateDTO.getCustomerAddress().trim());
            customerRepository.save(customer);
        }

        // Cập nhật note
        if (orderUpdateDTO.getNote() != null) {
            order.setNote(orderUpdateDTO.getNote());
        }

        // Cập nhật số lượng sản phẩm
        if (orderUpdateDTO.getOrderItems() != null && !orderUpdateDTO.getOrderItems().isEmpty()) {
            BigDecimal newTotal = BigDecimal.ZERO;

            // Hoàn lại số lượng sản phẩm cũ
            for (OrderDetailEntity detail : order.getOrderDetails()) {
                ProductEntity product = detail.getProduct();
                product.setStockQuantity(product.getStockQuantity() + detail.getQuantity());
                productRepository.save(product);
            }

            // Cập nhật số lượng mới
            for (int i = 0; i < orderUpdateDTO.getOrderItems().size(); i++) {
                OrderItemUpdateDTO itemUpdate = orderUpdateDTO.getOrderItems().get(i);
                if (i < order.getOrderDetails().size()) {
                    OrderDetailEntity detail = order.getOrderDetails().get(i);
                    ProductEntity product = detail.getProduct();

                    // Kiểm tra số lượng tồn kho
                    if (product.getStockQuantity() < itemUpdate.getQuantity()) {
                        throw new RuntimeException("Không đủ số lượng sản phẩm: " + product.getName());
                    }

                    // Cập nhật số lượng
                    detail.setQuantity(itemUpdate.getQuantity());
                    product.setStockQuantity(product.getStockQuantity() - itemUpdate.getQuantity());
                    productRepository.save(product);

                    // Tính tổng tiền mới
                    BigDecimal itemTotal = detail.getPrice().multiply(BigDecimal.valueOf(itemUpdate.getQuantity()));
                    newTotal = newTotal.add(itemTotal);
                }
            }

            order.setTotal(newTotal);
        }

        OrdersEntity savedOrder = ordersRepository.save(order);

        // Map về DTO để trả về
        OrdersDTO dto = modelMapper.map(savedOrder, OrdersDTO.class);
        dto.setCustomerId(savedOrder.getCustomer().getId());
        dto.setCustomerName(savedOrder.getCustomer().getName());

        return dto;
    }
}