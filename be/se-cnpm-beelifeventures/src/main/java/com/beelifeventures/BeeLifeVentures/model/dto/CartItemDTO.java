package com.beelifeventures.BeeLifeVentures.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItemDTO {
    private Long id;
    private Long cartId;
    private Long productId;
    private String productName;
    private String productDescription;
    private String productImageUrl;
    private String productType;
    private Integer quantity;
    private BigDecimal priceAtTime; // Giá tại thời điểm thêm vào giỏ
    private BigDecimal currentPrice; // Giá hiện tại của sản phẩm
    private BigDecimal totalPrice; // quantity * priceAtTime
    private Integer stockQuantity; // Số lượng tồn kho hiện tại
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
