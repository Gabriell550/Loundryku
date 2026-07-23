package com.example.Backend.service.impl;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.Backend.dto.response.DashboardResponse;
import com.example.Backend.dto.response.OrderResponse;
import com.example.Backend.model.Order;
import com.example.Backend.model.PaymentStatus;
import com.example.Backend.repository.CustomerRepository;
import com.example.Backend.repository.OrderRepository;
import com.example.Backend.service.DashboardService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;

    @Override
    public DashboardResponse getDashboard() {
        LocalDateTime startOfDay = LocalDateTime.now().with(LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.now().with(LocalTime.MAX);

        List<Order> todayOrders = orderRepository.findByCreatedAtBetween(startOfDay, endOfDay);

        double revenueToday = todayOrders.stream()
                .filter(o -> o.getPaymentStatus() == PaymentStatus.LUNAS)
                .mapToDouble(Order::getTotalPrice)
                .sum();

        long totalCustomers = customerRepository.count();

        List<OrderResponse> recentOrders = orderRepository.findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(OrderResponse::fromOrder)
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .totalOrderToday(todayOrders.size())
                .revenueToday(revenueToday)
                .totalCustomers(totalCustomers)
                .recentOrders(recentOrders)
                .build();
    }
}
