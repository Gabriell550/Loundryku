package com.example.Backend.service;

import java.util.List;

import com.example.Backend.dto.request.OrderRequest;
import com.example.Backend.model.Order;
import com.example.Backend.model.OrderStatus;

/**
 * Interface = "kontrak". Controller nanti hanya bergantung pada interface ini,
 * bukan implementasinya langsung. Manfaatnya: gampang di-testing (bisa dibuat
 * mock/palsu) dan gampang diganti implementasinya tanpa ubah controller.
 */
public interface OrderService {
    Order createOrder(OrderRequest request);
    List<Order> getAllOrders();
    Order getOrderById(String id);
    Order updateStatus(String id, OrderStatus status);
    void deleteOrder(String id);
}
