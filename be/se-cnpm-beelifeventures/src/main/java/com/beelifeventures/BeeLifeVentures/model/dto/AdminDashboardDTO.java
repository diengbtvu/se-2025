package com.beelifeventures.BeeLifeVentures.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardDTO {
    // Overview stats
    private Integer totalUsers;
    private Integer totalProducts;
    private Integer totalOrders;
    private BigDecimal totalRevenue;
    
    // Today stats
    private Integer todayOrders;
    private BigDecimal todayRevenue;
    private Integer newUsersToday;
    
    // This month stats
    private Integer monthOrders;
    private BigDecimal monthRevenue;
    private Integer newUsersThisMonth;
    
    // Product stats
    private Integer lowStockProducts; // Sản phẩm sắp hết hàng
    private Integer outOfStockProducts; // Sản phẩm hết hàng
    
    // Order status counts
    private Integer pendingOrders;
    private Integer confirmedOrders;
    private Integer shippingOrders;
    private Integer deliveredOrders;
    private Integer cancelledOrders;
    
    // Recent activity
    private String lastOrderTime;
    private String lastUserRegistration;
}
