package com.beelifeventures.BeeLifeVentures.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartToOrderDTO {
    private String status = "PENDING";
    private String note;
    private List<Long> selectedCartItemIds;
}
