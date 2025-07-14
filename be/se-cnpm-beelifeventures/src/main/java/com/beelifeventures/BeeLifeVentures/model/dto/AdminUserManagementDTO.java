package com.beelifeventures.BeeLifeVentures.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AdminUserManagementDTO 
{
    private Long id;
    private String userName;
    private String role;
    private String status; // ACTIVE, INACTIVE, BANNED
    private String name;
    private String email;
    private String phoneNumber;
    private String address;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    private Integer totalOrders;
    private Double totalSpent;
}
