package com.example.Backend.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.Backend.dto.response.RegisterResponse;
import com.example.Backend.exception.ResourceNotFoundException;
import com.example.Backend.model.User;
import com.example.Backend.repository.UserRepository;
import com.example.Backend.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public List<RegisterResponse> getAllUsers() {
        return userRepository.findAll().stream()
                // Sengaja di-map ke RegisterResponse (bukan balikin User langsung),
                // supaya field "password" (walau sudah ter-hash) TIDAK PERNAH
                // ikut terkirim ke client
                .map(user -> RegisterResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .role(user.getRole())
                        .build())
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUser(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User dengan id " + id + " tidak ditemukan"));
        userRepository.delete(user);
    }
}
