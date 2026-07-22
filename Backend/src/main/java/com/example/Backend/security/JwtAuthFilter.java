package com.example.Backend.security;

import java.io.IOException;
import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * Filter ini "satpam" yang berdiri di depan SEMUA request, dijalankan
 * SEBELUM request sampai ke Controller. Tugasnya:
 * 1. Cek apakah request bawa header "Authorization: Bearer <token>"
 * 2. Kalau ada, validasi tokennya pakai JwtUtil
 * 3. Kalau valid, "tandai" request ini sebagai sudah login (lewat SecurityContext)
 * 4. Kalau tidak ada/tidak valid, request tetap diteruskan tapi TANPA status login
 *    (nanti endpoint yang butuh login otomatis akan menolak di SecurityConfig)
 *
 * OncePerRequestFilter memastikan filter ini cuma jalan 1x per request
 * (bukan berkali-kali kalau ada internal forward).
 */
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // Kalau tidak ada header "Bearer ...", lewati saja, teruskan ke filter berikutnya
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7); // buang kata "Bearer " (7 karakter)

        if (jwtUtil.isTokenValid(token)) {
            String username = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractRole(token);

            // "role" di sini WAJIB diberi prefix "ROLE_" karena itu konvensi Spring Security
            var authToken = new UsernamePasswordAuthenticationToken(
                    username,
                    null, // credentials tidak perlu diisi lagi, sudah terbukti valid dari token
                    List.of(new SimpleGrantedAuthority("ROLE_" + role))
            );

            // Simpan status "sudah login" ini supaya bisa diakses di controller/service manapun
            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response); // lanjut ke filter/controller berikutnya
    }
}
