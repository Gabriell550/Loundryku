package com.example.Backend.security;


import java.util.Date;
import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

/**
 * Class ini "pabrik" JWT token: yang bertugas MEMBUAT token saat login berhasil,
 * dan MEMBACA/VALIDASI token saat ada request masuk yang bawa token.
 *
 * Bayangkan JWT seperti tiket konser yang di-tandatangani panitia:
 * - Isinya (payload) bisa dibaca semua orang (bukan rahasia)
 * - Tapi tanda tangannya (signature) cuma bisa dibuat oleh panitia yang punya kunci rahasia
 * - Jadi orang lain BISA baca isinya, tapi TIDAK BISA memalsukan tiket baru
 *   karena tidak punya kunci rahasianya (SECRET_KEY di bawah)
 */
@Component
public class JwtUtil {

    // ⚠️ Di project nyata, taruh secret key ini di application.properties atau
    // environment variable, JANGAN hardcode seperti ini. Ini demi contoh belajar saja.
    // Generate key acak yang aman, minimal 256-bit untuk algoritma HS256.
    private static final String SECRET_KEY_STRING = "ganti-dengan-secret-key-yang-panjang-dan-acak-minimal-32-karakter-ya";

    private static final long EXPIRATION_MS = 1000 * 60 * 60 * 8; // token berlaku 8 jam

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(
                java.util.Base64.getEncoder().encodeToString(SECRET_KEY_STRING.getBytes()));
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Dipanggil saat login berhasil, untuk membuat token baru
    public String generateToken(String username, String role) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + EXPIRATION_MS);

        return Jwts.builder()
                .subject(username)           // "pemilik" token
                .claim("role", role)            // data tambahan yang kita sisipkan (bebas, sesuai kebutuhan)
                .issuedAt(now)                // kapan token dibuat
                .expiration(expiry)           // kapan token kadaluarsa
                .signWith(getSigningKey()) // tanda tangan pakai secret key
                .compact();
    }

    // Dipanggil tiap ada request masuk yang bawa token, untuk ambil username-nya
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    // Cek apakah token masih valid (tanda tangan cocok & belum kadaluarsa)
    public boolean isTokenValid(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.getExpiration().after(new Date());
        } catch (Exception e) {
            // Token rusak, tanda tangan tidak cocok, atau format salah
            return false;
        }
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
