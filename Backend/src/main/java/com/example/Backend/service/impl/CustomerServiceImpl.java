package com.example.Backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.Backend.dto.request.CustomerRequest;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.model.Customer;
import com.example.Backend.repository.CustomerRepository;
import com.example.Backend.service.CustomerService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    @Override
    public Customer createCustomer(CustomerRequest request) {
        Customer customer = Customer.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .address(request.getAddress())
                .build();
        return customerRepository.save(customer);
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public Customer getCustomerById(String id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer dengan id " + id + " tidak ditemukan"));
    }

    @Override
    public Customer updateCustomer(String id, CustomerRequest request) {
        Customer customer = getCustomerById(id); // sekalian validasi ada/tidaknya
        customer.setName(request.getName());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());
        return customerRepository.save(customer); // karena id sudah ada, ini otomatis jadi UPDATE bukan INSERT
    }

    @Override
    public List<Customer> searchCustomers(String query) {
        if (query == null || query.trim().isEmpty()) {
            return customerRepository.findAll();
        }
        return customerRepository.searchByNameOrPhone(query.trim());
    }

    @Override
    public void deleteCustomer(String id) {
        Customer customer = getCustomerById(id);
        customerRepository.delete(customer);
    }
}
