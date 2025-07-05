package com.beelifeventures.BeeLifeVentures.service;

import com.beelifeventures.BeeLifeVentures.model.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface AdminService {
    
    // User Management
    List<AdminUserManagementDTO> getAllUsers(); // Lấy tất cả users không phân trang
    Page<AdminUserManagementDTO> getAllUsersWithPagination(Pageable pageable); // Lấy users có phân trang
    AdminUserManagementDTO getUserById(Long userId);
    void deleteUser(Long userId);
    List<AdminUserManagementDTO> searchUsers(String keyword);
    
    // Website Analytics
    Long getCurrentActiveUsers(); // Lấy số lượng người dùng đang truy cập
    
    // Product Management (Admin có full quyền)
    ProductDTO createProduct(ProductDTO productDTO);
    ProductDTO updateProduct(Long productId, ProductDTO productDTO);
    void deleteProduct(Long productId);
    List<ProductDTO> getAllProductsForAdmin();
    Page<ProductDTO> getProductsWithPagination(Pageable pageable);
    
    // Order Management
    Page<OrderDetailResponseDTO> getAllOrders(Pageable pageable);
    OrderDetailResponseDTO getOrderById(Long orderId);
    void updateOrderStatus(Long orderId, AdminOrderStatusUpdateDTO statusUpdate);
    void deleteOrder(Long orderId);
    List<OrderDetailResponseDTO> getOrdersByStatus(String status);
    
    // Revenue & Analytics
    AdminDashboardDTO getDashboardData();
    AdminRevenueReportDTO getRevenueReport(LocalDate fromDate, LocalDate toDate);
    List<AdminRevenueReportDTO> getMonthlyRevenue(int year);
    
    // System
    void initializeAdminAccount();
    boolean isAdmin(String userName);
}
