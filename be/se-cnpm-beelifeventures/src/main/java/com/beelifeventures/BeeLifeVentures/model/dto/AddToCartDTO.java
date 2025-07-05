package com.beelifeventures.BeeLifeVentures.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddToCartDTO {
    @NotNull(message = "Product ID không được null")
    private Long productId;
    
    @NotNull(message = "Quantity không được null")
    @Min(value = 1, message = "Quantity phải lớn hơn 0")
    private Integer quantity;
}
