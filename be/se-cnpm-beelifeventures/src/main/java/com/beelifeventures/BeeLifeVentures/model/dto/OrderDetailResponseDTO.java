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
public class OrderDetailResponseDTO {
    private Long orderId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String customerAddress;
    private LocalDateTime orderDate;
    private String status;
    private BigDecimal total;
    private String note;
    private List<OrderItemDetailDTO> orderItems;
}
