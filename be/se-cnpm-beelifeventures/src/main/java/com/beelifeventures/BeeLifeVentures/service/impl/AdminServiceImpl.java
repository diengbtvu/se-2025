package com.beelifeventures.BeeLifeVentures.service.impl;

import com.beelifeventures.BeeLifeVentures.model.dto.*;
import com.beelifeventures.BeeLifeVentures.repository.*;
import com.beelifeventures.BeeLifeVentures.repository.entity.*;
import com.beelifeventures.BeeLifeVentures.service.AdminService;
import com.beelifeventures.BeeLifeVentures.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrdersRepository ordersRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    @Qualifier("customPasswordEncoder")
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    @Transactional
    public void initializeAdminAccount() {
        // Kiểm tra xem đã có admin chưa
        Optional<UserAccountEntity> existingAdmin = userAccountRepository.findByUserName("admin");
        if (existingAdmin.isPresent()) {
            return; // Admin đã tồn tại
        }

        // Tạo admin account
        UserAccountEntity admin = new UserAccountEntity();
        admin.setUserName("admin");
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setRole("ADMIN");
        admin.setStatus("ACTIVE");
        userAccountRepository.save(admin);

        // Tạo customer info cho admin
        CustomerEntity adminCustomer = new CustomerEntity();
        adminCustomer.setUserAccount(admin);
        adminCustomer.setName("Administrator");
        adminCustomer.setEmail("admin@beelifeventures.com");
        adminCustomer.setPhoneNumber("0000000000");
        adminCustomer.setAddress("System");
        customerRepository.save(adminCustomer);
    }

    @Override
    public boolean isAdmin(String userName) {
        Optional<UserAccountEntity> user = userAccountRepository.findByUserName(userName);
        return user.isPresent() && "ADMIN".equals(user.get().getRole());
    }

    @Override
    public List<AdminUserManagementDTO> getAllUsers() {
        List<UserAccountEntity> users = userAccountRepository.findAll();
        return users.stream()
                .map(this::convertToUserManagementDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Page<AdminUserManagementDTO> getAllUsersWithPagination(Pageable pageable) {
        Page<UserAccountEntity> users = userAccountRepository.findAll(pageable);
        List<AdminUserManagementDTO> userDTOs = users.getContent().stream()
                .map(this::convertToUserManagementDTO)
                .collect(Collectors.toList());
        
        return new PageImpl<>(userDTOs, pageable, users.getTotalElements());
    }

    @Override
    public AdminUserManagementDTO getUserById(Long userId) {
        UserAccountEntity user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        return convertToUserManagementDTO(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        UserAccountEntity user = userAccountRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        
        if ("ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Cannot delete admin user");
        }
        
        userAccountRepository.delete(user);
    }

    @Override
    public Long getCurrentActiveUsers() {
        // Đếm số lượng user đã đăng nhập trong 24h qua (có lastLogin trong 24h)
        LocalDateTime last24Hours = LocalDateTime.now().minusHours(24);
        return userAccountRepository.findAll().stream()
                .filter(user -> user.getLastLogin() != null && user.getLastLogin().isAfter(last24Hours))
                .count();
    }

    @Override
    public List<AdminUserManagementDTO> searchUsers(String keyword) {
        List<UserAccountEntity> users = userAccountRepository.findAll().stream()
                .filter(user -> user.getUserName().toLowerCase().contains(keyword.toLowerCase()) ||
                               (getCustomerByUser(user) != null && 
                                getCustomerByUser(user).getName() != null && 
                                getCustomerByUser(user).getName().toLowerCase().contains(keyword.toLowerCase())))
                .collect(Collectors.toList());
        
        return users.stream()
                .map(this::convertToUserManagementDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProductDTO createProduct(ProductDTO productDTO) {
        productService.save(productDTO);
        return productDTO;
    }

    @Override
    @Transactional
    public ProductDTO updateProduct(Long productId, ProductDTO productDTO) {
        productDTO.setId(productId);
        return productService.update(productDTO);
    }

    @Override
    @Transactional
    public void deleteProduct(Long productId) {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setId(productId);
        productService.delete(productDTO);
    }

    @Override
    public List<ProductDTO> getAllProductsForAdmin() {
        return productService.findAll();
    }

    @Override
    public Page<ProductDTO> getProductsWithPagination(Pageable pageable) {
        Page<ProductEntity> products = productRepository.findAll(pageable);
        List<ProductDTO> productDTOs = products.getContent().stream()
                .map(product -> modelMapper.map(product, ProductDTO.class))
                .collect(Collectors.toList());
        
        return new PageImpl<>(productDTOs, pageable, products.getTotalElements());
    }

    @Override
    public Page<OrderDetailResponseDTO> getAllOrders(Pageable pageable) {
        Page<OrdersEntity> orders = ordersRepository.findAll(pageable);
        List<OrderDetailResponseDTO> orderDTOs = orders.getContent().stream()
                .map(this::convertToOrderDetailResponse)
                .collect(Collectors.toList());
        
        return new PageImpl<>(orderDTOs, pageable, orders.getTotalElements());
    }

    @Override
    public OrderDetailResponseDTO getOrderById(Long orderId) {
        OrdersEntity order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        return convertToOrderDetailResponse(order);
    }

    @Override
    @Transactional
    public void updateOrderStatus(Long orderId, AdminOrderStatusUpdateDTO statusUpdate) {
        OrdersEntity order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        
        order.setStatus(statusUpdate.getStatus());
        if (statusUpdate.getNote() != null) {
            order.setNote(order.getNote() + " | Admin: " + statusUpdate.getNote());
        }
        ordersRepository.save(order);
    }

    @Override
    @Transactional
    public void deleteOrder(Long orderId) {
        OrdersEntity order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found"));
        ordersRepository.delete(order);
    }

    @Override
    public List<OrderDetailResponseDTO> getOrdersByStatus(String status) {
        List<OrdersEntity> orders = ordersRepository.findAll().stream()
                .filter(order -> status.equals(order.getStatus()))
                .collect(Collectors.toList());
        
        return orders.stream()
                .map(this::convertToOrderDetailResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AdminDashboardDTO getDashboardData() {
        AdminDashboardDTO dashboard = new AdminDashboardDTO();
        
        // Overview stats
        dashboard.setTotalUsers((int) userAccountRepository.count());
        dashboard.setTotalProducts((int) productRepository.count());
        dashboard.setTotalOrders((int) ordersRepository.count());
        
        BigDecimal totalRevenue = ordersRepository.findAll().stream()
                .filter(order -> !"CANCELLED".equals(order.getStatus()))
                .map(OrdersEntity::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dashboard.setTotalRevenue(totalRevenue);
        
        // Today stats
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime todayEnd = LocalDate.now().atTime(23, 59, 59);
        
        List<OrdersEntity> todayOrders = ordersRepository.findAll().stream()
                .filter(order -> order.getOrderDate().isAfter(todayStart) && 
                                order.getOrderDate().isBefore(todayEnd))
                .collect(Collectors.toList());
        
        dashboard.setTodayOrders(todayOrders.size());
        BigDecimal todayRevenue = todayOrders.stream()
                .filter(order -> !"CANCELLED".equals(order.getStatus()))
                .map(OrdersEntity::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dashboard.setTodayRevenue(todayRevenue);
        
        // Stock status
        List<ProductEntity> allProducts = productRepository.findAll();
        dashboard.setLowStockProducts((int) allProducts.stream()
                .filter(p -> p.getStockQuantity() != null && p.getStockQuantity() <= 10 && p.getStockQuantity() > 0)
                .count());
        dashboard.setOutOfStockProducts((int) allProducts.stream()
                .filter(p -> p.getStockQuantity() != null && p.getStockQuantity() <= 0)
                .count());
        
        // Order status counts
        List<OrdersEntity> allOrders = ordersRepository.findAll();
        dashboard.setPendingOrders((int) allOrders.stream().filter(o -> "PENDING".equals(o.getStatus())).count());
        dashboard.setConfirmedOrders((int) allOrders.stream().filter(o -> "CONFIRMED".equals(o.getStatus())).count());
        dashboard.setShippingOrders((int) allOrders.stream().filter(o -> "SHIPPING".equals(o.getStatus())).count());
        dashboard.setDeliveredOrders((int) allOrders.stream().filter(o -> "DELIVERED".equals(o.getStatus())).count());
        dashboard.setCancelledOrders((int) allOrders.stream().filter(o -> "CANCELLED".equals(o.getStatus())).count());
        
        return dashboard;
    }

    @Override
    public AdminRevenueReportDTO getRevenueReport(LocalDate fromDate, LocalDate toDate) {
        AdminRevenueReportDTO report = new AdminRevenueReportDTO();
        report.setFromDate(fromDate);
        report.setToDate(toDate);
        
        LocalDateTime startDateTime = fromDate.atStartOfDay();
        LocalDateTime endDateTime = toDate.atTime(23, 59, 59);
        
        List<OrdersEntity> ordersInPeriod = ordersRepository.findAll().stream()
                .filter(order -> order.getOrderDate().isAfter(startDateTime) && 
                                order.getOrderDate().isBefore(endDateTime))
                .collect(Collectors.toList());
        
        report.setTotalOrders(ordersInPeriod.size());
        
        BigDecimal totalRevenue = ordersInPeriod.stream()
                .filter(order -> !"CANCELLED".equals(order.getStatus()))
                .map(OrdersEntity::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        report.setTotalRevenue(totalRevenue);
        
        if (ordersInPeriod.size() > 0) {
            report.setAverageOrderValue(totalRevenue.divide(BigDecimal.valueOf(ordersInPeriod.size()), 2, BigDecimal.ROUND_HALF_UP));
        } else {
            report.setAverageOrderValue(BigDecimal.ZERO);
        }
        
        // Revenue by status
        report.setPendingRevenue(calculateRevenueByStatus(ordersInPeriod, "PENDING"));
        report.setConfirmedRevenue(calculateRevenueByStatus(ordersInPeriod, "CONFIRMED"));
        report.setShippingRevenue(calculateRevenueByStatus(ordersInPeriod, "SHIPPING"));
        report.setDeliveredRevenue(calculateRevenueByStatus(ordersInPeriod, "DELIVERED"));
        report.setCancelledRevenue(calculateRevenueByStatus(ordersInPeriod, "CANCELLED"));
        
        // Order counts by status
        report.setPendingOrders((int) ordersInPeriod.stream().filter(o -> "PENDING".equals(o.getStatus())).count());
        report.setConfirmedOrders((int) ordersInPeriod.stream().filter(o -> "CONFIRMED".equals(o.getStatus())).count());
        report.setShippingOrders((int) ordersInPeriod.stream().filter(o -> "SHIPPING".equals(o.getStatus())).count());
        report.setDeliveredOrders((int) ordersInPeriod.stream().filter(o -> "DELIVERED".equals(o.getStatus())).count());
        report.setCancelledOrders((int) ordersInPeriod.stream().filter(o -> "CANCELLED".equals(o.getStatus())).count());
        
        return report;
    }

    @Override
    public List<AdminRevenueReportDTO> getMonthlyRevenue(int year) {
        return List.of(); // Implementation for monthly reports if needed
    }

    // Helper methods
    private AdminUserManagementDTO convertToUserManagementDTO(UserAccountEntity user) {
        AdminUserManagementDTO dto = new AdminUserManagementDTO();
        dto.setId(user.getId());
        dto.setUserName(user.getUserName());
        dto.setRole(user.getRole());
        dto.setStatus(user.getStatus());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setLastLogin(user.getLastLogin());
        
        CustomerEntity customer = getCustomerByUser(user);
        if (customer != null) {
            dto.setName(customer.getName());
            dto.setEmail(customer.getEmail());
            dto.setPhoneNumber(customer.getPhoneNumber());
            dto.setAddress(customer.getAddress());
            
            // Calculate user statistics
            List<OrdersEntity> userOrders = ordersRepository.findByCustomer(customer);
            dto.setTotalOrders(userOrders.size());
            
            Double totalSpent = userOrders.stream()
                    .filter(order -> !"CANCELLED".equals(order.getStatus()))
                    .mapToDouble(order -> order.getTotal().doubleValue())
                    .sum();
            dto.setTotalSpent(totalSpent);
        }
        
        return dto;
    }

    private CustomerEntity getCustomerByUser(UserAccountEntity user) {
        Optional<CustomerEntity> customer = customerRepository.findByUserAccount(user);
        return customer.orElse(null);
    }

    private OrderDetailResponseDTO convertToOrderDetailResponse(OrdersEntity order) {
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
    }

    private BigDecimal calculateRevenueByStatus(List<OrdersEntity> orders, String status) {
        return orders.stream()
                .filter(order -> status.equals(order.getStatus()))
                .map(OrdersEntity::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
