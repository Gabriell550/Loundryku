package com.example.Backend.model;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Dokumen utama transaksi laundry.
 * Disimpan di collection "orders".
 *
 * Perhatikan: field `items` berisi List<OrderItem> yang langsung
 * "menempel" di dalam dokumen Order (embedded document), bukan
 * disimpan di collection terpisah. Ini pola umum di MongoDB untuk
 * data yang selalu diakses bersamaan induknya (mirip struk belanja).
 */
@Document(collection = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    private String id;

    private String invoiceNumber; // contoh: INV-20260711-0001

    private String customerId;
    private String customerName; // denormalisasi, biar tidak perlu query Customer tiap tampilkan list order

    private List<OrderItem> items;

    private Double totalPrice;


    @Builder.Default
    private OrderStatus status = OrderStatus.DITERIMA;

    @Builder.Default
    private PaymentStatus paymentStatus = PaymentStatus.BELUM_LUNAS;

    private String paymentMethod; // "CASH" atau "TRANSFER", diisi saat pelunasan

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
