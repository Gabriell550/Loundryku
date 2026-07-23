package com.example.Backend.service.impl;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.Backend.dto.response.OrderResponse;
import com.example.Backend.dto.response.ReportResponse;
import com.example.Backend.model.Order;
import com.example.Backend.model.PaymentStatus;
import com.example.Backend.repository.OrderRepository;
import com.example.Backend.service.ReportService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final OrderRepository orderRepository;

    @Override
    public ReportResponse getDailyReport() {
        LocalDate today = LocalDate.now();
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(LocalTime.MAX);

        return buildReport("HARIAN", today, today, start, end);
    }

    @Override
    public ReportResponse getWeeklyReport() {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endDate = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);

        return buildReport("MINGGUAN", startDate, endDate, start, end);
    }

    @Override
    public ReportResponse getMonthlyReport() {
        LocalDate today = LocalDate.now();
        LocalDate startDate = today.withDayOfMonth(1);
        LocalDate endDate = today.withDayOfMonth(today.lengthOfMonth());

        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);

        return buildReport("BULANAN", startDate, endDate, start, end);
    }

    private ReportResponse buildReport(String period, LocalDate startDate, LocalDate endDate,
                                        LocalDateTime startDateTime, LocalDateTime endDateTime) {
        List<Order> orders = orderRepository.findByCreatedAtBetween(startDateTime, endDateTime);

        double totalRevenue = orders.stream()
                .filter(o -> o.getPaymentStatus() == PaymentStatus.LUNAS)
                .mapToDouble(Order::getTotalPrice)
                .sum();

        List<OrderResponse> orderResponses = orders.stream()
                .map(OrderResponse::fromOrder)
                .collect(Collectors.toList());

        return ReportResponse.builder()
                .period(period)
                .startDate(startDate)
                .endDate(endDate)
                .totalOrders(orders.size())
                .totalRevenue(totalRevenue)
                .orders(orderResponses)
                .build();
    }
}
