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

import com.example.Backend.dto.request.CustomerRequest;
import com.example.Backend.dto.response.ApiResponse;
import com.example.Backend.model.Customer;
import com.example.Backend.service.CustomerService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Endpoint:
 * POST   /api/customers
 * GET    /api/customers
 * GET    /api/customers/{id}
 * PUT    /api/customers/{id}
 * DELETE /api/customers/{id}
 */
@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<ApiResponse<Customer>> createCustomer(@Valid @RequestBody CustomerRequest request) {
        Customer customer = customerService.createCustomer(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Customer berhasil dibuat", customer));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Customer>>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil data customer", customers));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> getCustomerById(@PathVariable String id) {
        Customer customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil data customer", customer));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Customer>> updateCustomer(
            @PathVariable String id,
            @Valid @RequestBody CustomerRequest request) {
        Customer customer = customerService.updateCustomer(id, request);
        return ResponseEntity.ok(ApiResponse.success("Customer berhasil diupdate", customer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteCustomer(@PathVariable String id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.ok(ApiResponse.success("Customer berhasil dihapus", null));
    }
}
