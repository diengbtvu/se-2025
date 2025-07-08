package com.beelifeventures.BeeLifeVentures.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminRevenueReportDTO {
    private LocalDate fromDate;
    private LocalDate toDate;
    private BigDecimal totalRevenue;
    private Integer totalOrders;
    private Integer totalProducts;
    private Integer totalCustomers;
    private BigDecimal averageOrderValue;
    
    // Revenue by status
    private BigDecimal pendingRevenue;
    private BigDecimal confirmedRevenue;
    private BigDecimal shippingRevenue;
    private BigDecimal deliveredRevenue;
    private BigDecimal cancelledRevenue;
    
    // Order counts by status
    private Integer pendingOrders;
    private Integer confirmedOrders;
    private Integer shippingOrders;
    private Integer deliveredOrders;
    private Integer cancelledOrders;
}
