package com.example.Backend.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import com.example.Backend.model.Order;
import com.example.Backend.model.OrderItem;
import com.example.Backend.model.OrderStatus;
import com.example.Backend.model.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private String id;
    private String invoiceNumber;
    private String customerId;
    private String customerName;
    private List<OrderItem> items;
    private Double totalPrice;
    private OrderStatus status;
    private PaymentStatus paymentStatus;
    private String paymentMethod;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static OrderResponse fromOrder(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .invoiceNumber(order.getInvoiceNumber())
                .customerId(order.getCustomerId())
                .customerName(order.getCustomerName())
                .items(order.getItems())
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .paymentStatus(order.getPaymentStatus())
                .paymentMethod(order.getPaymentMethod())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}