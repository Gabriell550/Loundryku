package com.example.Backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Akun untuk login ke sistem (admin atau kasir), BEDA dengan Customer
 * (Customer = pelanggan laundry, User = pegawai yang pakai aplikasi ini).
 */
@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    private String username;

    private String password;

    private String fullName;

    @Builder.Default
    private Role role = Role.KASIR;

    public enum Role {
        ADMIN,
        KASIR
    }
}
