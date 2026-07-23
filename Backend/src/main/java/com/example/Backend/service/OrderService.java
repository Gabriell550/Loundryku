package com.example.Backend.service;

import java.util.List;

import com.example.Backend.dto.request.OrderRequest;
import com.example.Backend.model.Order;
import com.example.Backend.model.OrderStatus;

public interface OrderService {
    Order createOrder(OrderRequest request);
    List<Order> getAllOrders();
    Order getOrderById(String id);
    Order getOrderByInvoiceNumber(String invoiceNumber);
    List<Order> searchOrders(String query);
    Order updateStatus(String id, OrderStatus status);
    void deleteOrder(String id);
}
