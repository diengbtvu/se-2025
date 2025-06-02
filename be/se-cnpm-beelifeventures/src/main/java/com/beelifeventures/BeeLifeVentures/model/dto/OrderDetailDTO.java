package com.beelifeventures.BeeLifeVentures.model.dto;

import lombok.Data;

@Data
public class OrderDetailDTO {
    private Long productId;
    private Integer quantity;
}