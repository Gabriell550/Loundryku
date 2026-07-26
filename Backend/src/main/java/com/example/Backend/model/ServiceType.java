package com.example.Backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Master data jenis layanan laundry.
 * Contoh isi data: "Cuci Reguler" - Rp5.000/kg, "Setrika Saja" - Rp3.000/kg,
 * "Cuci Express" - Rp10.000/kg.
 */
@Document(collection = "service_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceType {

    @Id
    private String id;

    private String name;   // nama layanan, misal "Cuci Reguler"
    private String processing; // jenis proses, misal "Reguler", "Kilat", "Express"
    private String weight;   // satuan, misal "kg" atau "pcs"
    private String estimation; // estimasi waktu selesai, misal "2 hari" atau "3 jam"
    private Double price;  // harga per satuan
}
