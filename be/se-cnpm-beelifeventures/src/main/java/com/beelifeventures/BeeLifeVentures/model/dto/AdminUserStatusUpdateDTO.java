package com.beelifeventures.BeeLifeVentures.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminUserStatusUpdateDTO {
    @NotBlank(message = "Status is required")
    private String status; // ACTIVE, INACTIVE, BANNED
    
    private String reason; // Lý do thay đổi status
}
