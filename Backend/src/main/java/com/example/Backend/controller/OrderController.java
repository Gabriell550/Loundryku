package com.example.Backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Backend.dto.request.OrderRequest;
import com.example.Backend.dto.request.UpdateStatusRequest;
import com.example.Backend.dto.response.ApiResponse;
import com.example.Backend.model.Order;
import com.example.Backend.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * @RestController = gabungan @Controller + @ResponseBody, artinya
 * setiap method di sini otomatis mengembalikan JSON (bukan HTML).
 *
 * @RequestMapping("/api/orders") = semua endpoint di class ini
 * awalannya "/api/orders", contoh lengkapnya jadi:
 * POST   /api/orders
 * GET    /api/orders
 * GET    /api/orders/{id}
 * PATCH  /api/orders/{id}/status
 * DELETE /api/orders/{id}
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService; // di-inject otomatis oleh Spring

    // Buat order baru
    // @Valid memicu validasi field di OrderRequest (@NotBlank, @NotEmpty, dll)
    @PostMapping
    public ResponseEntity<ApiResponse<Order>> createOrder(@Valid @RequestBody OrderRequest request) {
        Order order = orderService.createOrder(request);
        return ResponseEntity
                .status(HttpStatus.CREATED) // HTTP 201
                .body(ApiResponse.success("Order berhasil dibuat", order));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Order>>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil data order", orders));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Order>>> searchOrders(@RequestParam String q) {
        List<Order> orders = orderService.searchOrders(q);
        return ResponseEntity.ok(ApiResponse.success("Berhasil mencari order", orders));
    }

    @GetMapping("/by-invoice/{invoiceNumber}")
    public ResponseEntity<ApiResponse<Order>> getOrderByInvoice(@PathVariable String invoiceNumber) {
        Order order = orderService.getOrderByInvoiceNumber(invoiceNumber);
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil data order", order));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Order>> getOrderById(@PathVariable String id) {
        Order order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success("Berhasil mengambil data order", order));
    }

    // Update status order, misal dari DITERIMA -> DIPROSES
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Order>> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateStatusRequest request) {
        Order order = orderService.updateStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Status order berhasil diupdate", order));
    }

    // Hapus order
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id);
        return ResponseEntity.ok(ApiResponse.success("Order berhasil dihapus", null));
    }
}
