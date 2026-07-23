package com.example.Backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetail {

    private String serviceTypeId;
    private String serviceTypeName;
    private Double qty;
    private Double price;
    private Double subtotal;

    public static OrderDetail fromOrderItem(OrderItem item) {
        return OrderDetail.builder()
                .serviceTypeId(item.getServiceTypeId())
                .serviceTypeName(item.getServiceTypeName())
                .qty(item.getQty())
                .price(item.getPrice())
                .subtotal(item.getSubtotal())
                .build();
    }
}