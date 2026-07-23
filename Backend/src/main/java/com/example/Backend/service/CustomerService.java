package com.example.Backend.service;

import java.util.List;

import com.example.Backend.dto.request.CustomerRequest;
import com.example.Backend.model.Customer;

public interface CustomerService {
    Customer createCustomer(CustomerRequest request);
    List<Customer> getAllCustomers();
    Customer getCustomerById(String id);
    Customer updateCustomer(String id, CustomerRequest request);
    void deleteCustomer(String id);
    List<Customer> searchCustomers(String query);
}
