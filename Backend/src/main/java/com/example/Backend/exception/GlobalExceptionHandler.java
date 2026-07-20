package com.example.Backend.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.Backend.dto.response.ApiResponse;

/**
 * @RestControllerAdvice = "penjaga gerbang" untuk semua Controller.
 * Kalau di controller manapun terjadi exception, request akan otomatis
 * dilempar ke sini, jadi kita tidak perlu try-catch berulang di tiap method.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Ditangkap ketika kita sengaja throw ResourceNotFoundException, misal customer tidak ketemu
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND) // otomatis balikin HTTP 404
                .body(ApiResponse.error(ex.getMessage()));
    }

    // Ditangkap otomatis ketika validasi @NotBlank/@NotNull/dll di DTO gagal
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST) // HTTP 400
                .body(ApiResponse.error("Validasi gagal: " + errors));
    }

    // Jaring pengaman terakhir untuk error tak terduga lainnya
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneral(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR) // HTTP 500
                .body(ApiResponse.error("Terjadi kesalahan: " + ex.getMessage()));
    }
}
