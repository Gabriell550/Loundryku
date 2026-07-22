package com.example.Backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.Backend.model.User;
import com.example.Backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * CommandLineRunner = kode di dalam run() ini otomatis dijalankan SEKALI
 * setiap kali aplikasi Spring Boot selesai start up.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Diambil dari application.properties, biar gampang diganti tanpa ubah kode
    @Value("${app.admin.username:admin}")
    private String defaultAdminUsername;

    @Value("${app.admin.password:admin123}")
    private String defaultAdminPassword;

    @Override
    public void run(String... args) {
        boolean adminAlreadyExists = userRepository.findByUsername(defaultAdminUsername).isPresent();

        if (adminAlreadyExists) {
            return; // sudah ada, tidak perlu bikin lagi
        }

        User admin = User.builder()
                .username(defaultAdminUsername)
                .password(passwordEncoder.encode(defaultAdminPassword))
                .fullName("Administrator")
                .role(User.Role.ADMIN)
                .build();

        userRepository.save(admin);

        // Ini SENGAJA di-log biar kelihatan di console saat run pertama kali,
        log.info("========================================");
        log.info("Akun admin default berhasil dibuat");
        log.info("Username: {}", defaultAdminUsername);
        log.info("Password: {}", defaultAdminPassword);
        log.info("SEGERA ganti password ini setelah login pertama!");
        log.info("========================================");
    }
}
