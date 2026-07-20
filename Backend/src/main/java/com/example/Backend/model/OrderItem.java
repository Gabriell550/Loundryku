package com.example.Backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Satu baris item dalam order, contoh: "Cuci Reguler - 3kg - Rp15.000".
 * Class ini TIDAK punya @Document karena bukan collection sendiri,
 * dia akan "menempel"/embedded di dalam dokumen Order (khas MongoDB,
 * beda dengan SQL yang biasanya butuh tabel terpisah + foreign key).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    private String serviceTypeId;   // referensi ke ServiceType
    private String serviceTypeName; // disalin/denormalisasi biar tidak perlu join saat tampilkan struk
    private Double qty;             // jumlah (kg atau pcs)
    private Double price;           // harga satuan saat transaksi (disalin, jaga-jaga kalau harga master berubah)
    private Double subtotal;        // qty * price
}
