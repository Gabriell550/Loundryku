package com.example.Backend.service;

import com.example.Backend.dto.response.ReportResponse;

public interface ReportService {
    ReportResponse getDailyReport();
    ReportResponse getWeeklyReport();
    ReportResponse getMonthlyReport();
}
