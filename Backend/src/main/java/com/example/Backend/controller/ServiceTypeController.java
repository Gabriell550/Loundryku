package com.example.Backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.Backend.dto.request.ServiceTypeRequest;
import com.example.Backend.dto.response.ApiResponse;
import com.example.Backend.model.ServiceType;
import com.example.Backend.service.ServiceTypeService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Endpoint:
 * POST   /api/service-types
 * GET    /api/service-types
 * GET    /api/service-types/{id}
 * PUT    /api/service-types/{id}
 * DELETE /api/service-types/{id}
 */
@RestController
@RequestMapping("/api/service-types")
@RequiredArgsConstructor
public class ServiceTypeController {

    private final ServiceTypeService serviceTypeService;

    @PostMapping
    public ResponseEntity<ApiResponse<ServiceType>> createServiceType(@Valid @RequestBody ServiceTypeRequest request) {
        ServiceType serviceType = serviceTypeService.createServiceType(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Service type berhasil dibuat", serviceType));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceType>>> getAllServiceTypes() {
        List<ServiceType> serviceTypes = serviceTypeService.getAllServiceTypes();
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil data service type", serviceTypes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceType>> getServiceTypeById(@PathVariable String id) {
        ServiceType serviceType = serviceTypeService.getServiceTypeById(id);
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil data service type", serviceType));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ServiceType>> updateServiceType(
            @PathVariable String id,
            @Valid @RequestBody ServiceTypeRequest request) {
        ServiceType serviceType = serviceTypeService.updateServiceType(id, request);
        return ResponseEntity.ok(ApiResponse.success("Service type berhasil diupdate", serviceType));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteServiceType(@PathVariable String id) {
        serviceTypeService.deleteServiceType(id);
        return ResponseEntity.ok(ApiResponse.success("Service type berhasil dihapus", null));
    }
}
