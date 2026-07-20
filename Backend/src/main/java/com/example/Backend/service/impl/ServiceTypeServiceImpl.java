package com.example.Backend.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.Backend.dto.request.ServiceTypeRequest;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.model.ServiceType;
import com.example.Backend.repository.ServiceTypeRepository;
import com.example.Backend.service.ServiceTypeService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ServiceTypeServiceImpl implements ServiceTypeService {

    private final ServiceTypeRepository serviceTypeRepository;

    @Override
    public ServiceType createServiceType(ServiceTypeRequest request) {
        ServiceType serviceType = ServiceType.builder()
                .name(request.getName())
                .unit(request.getUnit())
                .price(request.getPrice())
                .build();
        return serviceTypeRepository.save(serviceType);
    }

    @Override
    public List<ServiceType> getAllServiceTypes() {
        return serviceTypeRepository.findAll();
    }

    @Override
    public ServiceType getServiceTypeById(String id) {
        return serviceTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ServiceType dengan id " + id + " tidak ditemukan"));
    }

    @Override
    public ServiceType updateServiceType(String id, ServiceTypeRequest request) {
        ServiceType serviceType = getServiceTypeById(id);
        serviceType.setName(request.getName());
        serviceType.setUnit(request.getUnit());
        serviceType.setPrice(request.getPrice());
        return serviceTypeRepository.save(serviceType);
    }

    @Override
    public void deleteServiceType(String id) {
        ServiceType serviceType = getServiceTypeById(id);
        serviceTypeRepository.delete(serviceType);
    }
}
