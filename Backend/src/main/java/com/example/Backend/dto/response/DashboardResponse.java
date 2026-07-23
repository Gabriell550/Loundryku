package com.example.Backend.dto.response;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponse {
    private long totalOrderToday;
    private double revenueToday;
    private long totalCustomers;
    private List<OrderResponse> recentOrders;
}
