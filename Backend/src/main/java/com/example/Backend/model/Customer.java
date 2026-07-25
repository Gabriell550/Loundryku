package com.example.Backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Merepresentasikan satu pelanggan laundry.
 * Disimpan di collection "customers" pada MongoDB Atlas.
 */
@Document(collection = "customers")
@Data // otomatis generate getter, setter, toString, equals, hashCode (dari Lombok)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    private String id; // MongoDB otomatis generate ObjectId sebagai String

    private String name;
    private String phone;
    private String address;
}
