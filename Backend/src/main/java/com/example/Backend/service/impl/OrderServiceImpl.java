package com.example.Backend.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.Backend.dto.request.OrderRequest;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.model.Customer;
import com.example.Backend.model.Order;
import com.example.Backend.model.OrderItem;
import com.example.Backend.model.OrderStatus;
import com.example.Backend.model.ServiceType;
import com.example.Backend.repository.CustomerRepository;
import com.example.Backend.repository.OrderRepository;
import com.example.Backend.repository.ServiceTypeRepository;
import com.example.Backend.service.OrderService;

import lombok.RequiredArgsConstructor;

/**
 * Implementasi nyata dari OrderService.
 *
 * @Service menandai class ini sebagai "bean" yang dikelola Spring,
 * jadi bisa langsung di-inject (disuntik) ke class lain (misal Controller)
 * tanpa perlu bikin object manual pakai `new`.
 *
 * @RequiredArgsConstructor (dari Lombok) otomatis membuat constructor
 * untuk semua field yang bertipe `final` di bawah ini. Ini yang disebut
 * "constructor injection", cara yang direkomendasikan Spring untuk
 * dependency injection (dibanding @Autowired di field langsung).
 */
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ServiceTypeRepository serviceTypeRepository;

    @Override
    public Order createOrder(OrderRequest request) {
        // 1. Pastikan customer-nya ada
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Customer dengan id " + request.getCustomerId() + " tidak ditemukan"));

        // 2. Ubah tiap OrderItemRequest jadi OrderItem, sambil ambil harga dari master ServiceType
        List<OrderItem> items = request.getItems().stream()
                .map(itemReq -> {
                    ServiceType serviceType = serviceTypeRepository.findById(itemReq.getServiceTypeId())
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "ServiceType dengan id " + itemReq.getServiceTypeId() + " tidak ditemukan"));

                    double subtotal = serviceType.getPrice() * itemReq.getQty();

                    return OrderItem.builder()
                            .serviceTypeId(serviceType.getId())
                            .serviceTypeName(serviceType.getName())
                            .qty(itemReq.getQty())
                            .price(serviceType.getPrice())
                            .subtotal(subtotal)
                            .build();
                })
                .collect(Collectors.toList());

        // 3. Hitung total keseluruhan
        double total = items.stream().mapToDouble(OrderItem::getSubtotal).sum();

        // 4. Susun dokumen Order dan simpan
        Order order = Order.builder()
                .invoiceNumber(generateInvoiceNumber())
                .customerId(customer.getId())
                .customerName(customer.getName())
                .items(items)
                .totalPrice(total)
                .status(OrderStatus.DITERIMA)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return orderRepository.save(order); // .save() otomatis INSERT (kalau id kosong) atau UPDATE (kalau id sudah ada)
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Order getOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order dengan id " + id + " tidak ditemukan"));
    }

    @Override
    public Order updateStatus(String id, OrderStatus status) {
        Order order = getOrderById(id); // reuse method di atas, sekalian validasi order ada atau tidak
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    @Override
    public void deleteOrder(String id) {
        Order order = getOrderById(id);
        orderRepository.delete(order);
    }

    // Contoh sederhana generate nomor invoice: INV-20260711-<4 digit acak>
    private String generateInvoiceNumber() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int random = (int) (Math.random() * 9000) + 1000;
        return "INV-" + datePart + "-" + random;
    }
}
