package com.example.Backend.dto.response;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportResponse {
    private String period;
    private LocalDate startDate;
    private LocalDate endDate;
    private long totalOrders;
    private double totalRevenue;
    private List<OrderResponse> orders;
}
