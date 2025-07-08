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
public class CartDTO {
    private Long id;
    private Long customerId;
    private String customerName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CartItemDTO> cartItems;
    private BigDecimal totalAmount; // Tổng tiền của giỏ hàng
    private Integer totalItems; // Tổng số lượng sản phẩm
}
