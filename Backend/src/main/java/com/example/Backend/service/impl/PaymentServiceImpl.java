package com.example.Backend.service.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.example.Backend.dto.request.PaymentRequest;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.model.Order;
import com.example.Backend.model.Payment;
import com.example.Backend.model.PaymentStatus;
import com.example.Backend.repository.OrderRepository;
import com.example.Backend.repository.PaymentRepository;
import com.example.Backend.service.PaymentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public Order processPayment(PaymentRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order dengan id " + request.getOrderId() + " tidak ditemukan"));

        if (order.getPaymentStatus() == PaymentStatus.LUNAS) {
            throw new IllegalArgumentException("Order sudah lunas");
        }

        double amount = request.getAmount() != null ? request.getAmount() : order.getTotalPrice();

        order.setPaymentStatus(PaymentStatus.LUNAS);
        order.setPaymentMethod(request.getMethod());
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);

        Payment payment = Payment.builder()
                .orderId(order.getId())
                .amount(amount)
                .status(PaymentStatus.LUNAS)
                .method(request.getMethod())
                .paidAt(LocalDateTime.now())
                .build();
        paymentRepository.save(payment);

        return order;
    }
}
