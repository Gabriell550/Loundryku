package com.example.Backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.Backend.security.JwtAuthFilter;

import lombok.RequiredArgsConstructor;

/**
 * Ini "pusat aturan" siapa boleh akses apa. Dua hal utama yang diatur di sini:
 * 1. Endpoint mana yang PUBLIK (boleh diakses tanpa login) vs PRIVATE (wajib login)
 * 2. Cara password di-enkripsi (lewat PasswordEncoder/BCrypt)
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Aktifkan CORS di level Spring Security. Tanpa baris ini, Spring Security
            // akan tetap MENOLAK request cross-origin dari frontend walau WebConfig.java
            // sudah mengizinkannya — sebab Spring Security jalan lebih dulu dan
            // punya aturan CORS sendiri yang terpisah dari WebMvcConfigurer.
            .cors(cors -> {})

            // CSRF protection untuk aplikasi berbasis session/cookie & form HTML.
            // Kita pakai JWT (bukan cookie session), jadi ini di-nonaktifkan.
            .csrf(csrf -> csrf.disable())

            // STATELESS artinya server TIDAK menyimpan status login di memori/session.
            // Setiap request harus membuktikan diri sendiri lewat token JWT-nya masing-masing.
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth
                    // Endpoint publik, boleh diakses TANPA login/token
                    .requestMatchers("/api/auth/**").permitAll()

                    // Manajemen akun staff (bikin/lihat/hapus user) KHUSUS admin.
                    // Kasir yang punya token valid pun akan ditolak (403) kalau coba akses ini.
                    .requestMatchers("/api/users/**").hasRole("ADMIN")

                    // Sisanya (order, customer, service-type) WAJIB sudah login,
                    // ADMIN maupun KASIR boleh akses (belum dibedakan lebih detail)
                    .anyRequest().authenticated()
            )

            // Selipkan JwtAuthFilter kita SEBELUM filter bawaan Spring Security,
            // supaya token dicek duluan sebelum proses otentikasi standar berjalan
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Bean ini dipakai untuk hash & verifikasi password (dijelaskan di bawah)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
