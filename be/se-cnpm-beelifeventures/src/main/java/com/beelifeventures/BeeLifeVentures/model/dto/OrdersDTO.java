package com.beelifeventures.BeeLifeVentures.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrdersDTO {
    private Long id;
    private Long customerId;
    private String customerName; // Thêm trường này
    private LocalDateTime orderDate;
    private String status;
    private BigDecimal total;
    private String note;
    private List<OrderItemDTO> orderItems;
}
