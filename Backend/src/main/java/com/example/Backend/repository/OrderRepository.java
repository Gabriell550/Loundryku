package com.example.Backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.Backend.model.Order;
import com.example.Backend.model.OrderStatus;

/**
 * Interface ini TIDAK perlu diimplementasikan manual.
 * Spring Data MongoDB otomatis membuatkan implementasinya saat runtime,
 * cukup dengan extends MongoRepository<TipeDokumen, TipeId>.
 *
 * Otomatis tersedia method seperti: save(), findById(), findAll(), deleteById(), dll.
 * Kita hanya perlu mendeklarasikan method tambahan yang kita butuhkan,
 * dan Spring akan otomatis membuat query-nya berdasarkan NAMA method
 * (disebut "query derivation" / "query method").
 */
public interface OrderRepository extends MongoRepository<Order, String> {

    // Otomatis diterjemahkan jadi query: cari semua order dengan status tertentu
    List<Order> findByStatus(OrderStatus status);

    // Otomatis: cari order berdasarkan invoiceNumber
    Order findByInvoiceNumber(String invoiceNumber);
}
