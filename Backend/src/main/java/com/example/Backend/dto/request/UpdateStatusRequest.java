package com.example.Backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import com.example.Backend.model.OrderStatus;

@Data
public class UpdateStatusRequest {

    @NotNull(message = "status wajib diisi")
    private OrderStatus status;
}
