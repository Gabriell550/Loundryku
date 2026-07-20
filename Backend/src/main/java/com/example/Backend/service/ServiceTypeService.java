package com.example.Backend.service;

import java.util.List;

import com.example.Backend.dto.request.ServiceTypeRequest;
import com.example.Backend.model.ServiceType;

public interface ServiceTypeService {
    ServiceType createServiceType(ServiceTypeRequest request);
    List<ServiceType> getAllServiceTypes();
    ServiceType getServiceTypeById(String id);
    ServiceType updateServiceType(String id, ServiceTypeRequest request);
    void deleteServiceType(String id);
}
