package com.example.Backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Backend.dto.response.ApiResponse;
import com.example.Backend.dto.response.ReportResponse;
import com.example.Backend.service.ReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/daily")
    public ResponseEntity<ApiResponse<ReportResponse>> getDailyReport() {
        return ResponseEntity.ok(
                ApiResponse.success("Berhasil mengambil laporan harian", reportService.getDailyReport()));
    }

    @GetMapping("/weekly")
    public ResponseEntity<ApiResponse<ReportResponse>> getWeeklyReport() {
        return ResponseEntity.ok(
                ApiResponse.success("Berhasil mengambil laporan mingguan", reportService.getWeeklyReport()));
    }

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<ReportResponse>> getMonthlyReport() {
        return ResponseEntity.ok(
                ApiResponse.success("Berhasil mengambil laporan bulanan", reportService.getMonthlyReport()));
    }
}
