package com.example.Backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.example.Backend.model.Order;
import com.example.Backend.model.OrderStatus;

public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByStatus(OrderStatus status);

    Order findByInvoiceNumber(String invoiceNumber);

    List<Order> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    List<Order> findTop5ByOrderByCreatedAtDesc();

    @Query("{ 'customerName': { '$regex': ?0, '$options': 'i' } }")
    List<Order> searchByCustomerName(String name);
}
