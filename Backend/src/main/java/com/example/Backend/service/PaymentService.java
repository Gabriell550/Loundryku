package com.example.Backend.service;

import com.example.Backend.dto.request.PaymentRequest;
import com.example.Backend.model.Order;

public interface PaymentService {
    Order processPayment(PaymentRequest request);
}
