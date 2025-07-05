package com.beelifeventures.BeeLifeVentures.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderUpdateDTO {
    private Long orderId;
    private String customerAddress;
    private String note;
    private List<OrderItemUpdateDTO> orderItems;
}
