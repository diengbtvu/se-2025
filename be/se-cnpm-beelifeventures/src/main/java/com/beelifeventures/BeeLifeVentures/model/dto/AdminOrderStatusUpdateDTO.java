package com.beelifeventures.BeeLifeVentures.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminOrderStatusUpdateDTO {
    @NotBlank(message = "Status is required")
    private String status; // PENDING, CONFIRMED, SHIPPING, DELIVERED, CANCELLED
    
    private String note; // Ghi chú về việc cập nhật
}
