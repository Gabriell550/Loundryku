package com.example.Backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Wrapper generic supaya SEMUA response API mempunyai format konsisten:
 * {
 *   "success": true,
 *   "message": "Order berhasil dibuat",
 *   "data": { ... }
 * }
 * <T> artinya class ini generic, "data" bisa diisi tipe apa saja
 * (Order, List<Order>, Customer, dll) tergantung kebutuhan.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
}
