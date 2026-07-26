import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { toast } from '../../contexts/ToastContext';
import GlassCard from '../../components/ui/GlassCard';
import GlassInput from '../../components/ui/GlassInput';
import PillButton from '../../components/ui/PillButton';
import { colors, gradients, spacing, typography } from '../../constants/theme';
import { orderService, serviceTypeService } from '../services/orderService';
import { customerService } from '../services/customerService';
import type { Customer, ServiceType } from '../types';

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

type CategoryType = 'Reguler' | 'Kilat' | 'Express';
type ServiceCode = 'CS' | 'CK' | 'S' | 'CB';

const CATEGORIES: CategoryType[] = ['Reguler', 'Kilat', 'Express'];

const SERVICE_NAMES: Record<ServiceCode, string> = {
  CS: 'Cuci Setrika',
  CK: 'Cuci Kering',
  S: 'Setrika',
  CB: 'Cuci Basah',
};

// Matriks Harga Resmi Tiara Laundry
const PRICING_TABLE: Record<CategoryType, Partial<Record<ServiceCode, number>>> = {
  Reguler: { CS: 6500, CK: 5500, S: 5500 },
  Kilat: { CS: 10000, CK: 7000, S: 8000 },
  Express: { CS: 13500, CK: 10000, S: 10000, CB: 5000 },
};

// Preset Tombol Cepat Berat (kg)
const PRESET_WEIGHTS = ['1', '2', '3', '4', '5', '10'];

interface OrderItemState {
  category: CategoryType | '';
  serviceCode: ServiceCode | '';
  qty: string; // dalam kg
}

export default function AddOrderScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Pelanggan
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [serviceTypeMap, setServiceTypeMap] = useState<Map<string, ServiceType>>(new Map());

  // State Item Layanan
  const [orderItems, setOrderItems] = useState<OrderItemState[]>([
    { category: 'Reguler', serviceCode: 'CS', qty: '' },
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const [custRes, stRes] = await Promise.all([
          customerService.getAll(),
          serviceTypeService.getAll(),
        ]);
        if (custRes.success) setCustomers(custRes.data);
        if (stRes.success) {
          const map = new Map<string, ServiceType>();
          stRes.data.forEach((st) => {
            map.set(`${st.processing}|${st.name}`, st);
          });
          setServiceTypeMap(map);
        }
      } catch (err) {
        console.error('Gagal memuat data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch)
  );

  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerPicker(false);
    setCustomerSearch('');
  };

  const getPricePerKg = (category: CategoryType | '', code: ServiceCode | ''): number => {
    if (!category || !code) return 0;
    return PRICING_TABLE[category]?.[code] || 0;
  };

  const calculateSubtotal = (item: OrderItemState): number => {
    const price = getPricePerKg(item.category, item.serviceCode);
    const weight = parseFloat(item.qty) || 0;
    return price * weight;
  };

  const totalPrice = orderItems.reduce((sum, item) => sum + calculateSubtotal(item), 0);

  const addItem = () => {
    setOrderItems([...orderItems, { category: 'Reguler', serviceCode: 'CS', qty: '' }]);
  };

  const updateCategory = (index: number, category: CategoryType) => {
    const updated = [...orderItems];
    const validCodes: ServiceCode[] = category === 'Express'
      ? ['CS', 'CK', 'S', 'CB']
      : ['CS', 'CK', 'S'];
    const currentCode = updated[index].serviceCode as ServiceCode;
    const defaultCode = validCodes.includes(currentCode) ? currentCode : 'CS';

    updated[index] = { ...updated[index], category, serviceCode: defaultCode };
    setOrderItems(updated);
  };

  const updateServiceCode = (index: number, serviceCode: ServiceCode) => {
    const updated = [...orderItems];
    updated[index] = { ...updated[index], serviceCode };
    setOrderItems(updated);
  };

  // ✅ Fungsi Input Berat (Otomatis ganti koma menjadi titik)
  const updateQty = (index: number, text: string) => {
    const formattedText = text.replace(',', '.');
    const updated = [...orderItems];
    updated[index].qty = formattedText;
    setOrderItems(updated);
  };

  // ✅ Fungsi Stepper (+ / - Berat)
  const adjustQty = (index: number, delta: number) => {
    const updated = [...orderItems];
    const current = parseFloat(updated[index].qty.replace(',', '.')) || 0;
    // Math.round untuk menghindari bug desimal JS (misal 2.5000000000000003)
    const newQty = Math.max(0, Math.round((current + delta) * 10) / 10);
    updated[index].qty = newQty > 0 ? String(newQty) : '';
    setOrderItems(updated);
  };

  // ✅ Fungsi Preset Berat Cepat
  const setQuickQty = (index: number, val: string) => {
    const updated = [...orderItems];
    updated[index].qty = val;
    setOrderItems(updated);
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const onSubmit = async () => {
      if (!selectedCustomer) {
      toast({ type: 'warning', title: 'Peringatan', message: 'Silakan pilih pelanggan terlebih dahulu.' });
      return;
    }

    const hasInvalidItem = orderItems.some(
      (item) => !item.category || !item.serviceCode || !(parseFloat(item.qty) > 0)
    );

    if (orderItems.length === 0 || hasInvalidItem) {
      toast({ type: 'warning', title: 'Peringatan', message: 'Pastikan semua kategori, layanan, dan berat (kg) terisi dengan benar.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedItems = orderItems.map((i) => {
        const serviceName = SERVICE_NAMES[i.serviceCode as ServiceCode];
        const key = `${i.category}|${serviceName}`;
        const st = serviceTypeMap.get(key);
        if (!st) {
          throw new Error(`Layanan ${i.category} - ${serviceName} tidak ditemukan di database. Hubungi admin.`);
        }
        return {
          serviceTypeId: st.id,
          qty: parseFloat(i.qty),
        };
      });

      const res = await orderService.create({
        customerId: selectedCustomer.id,
        items: formattedItems,
      });

      if (res.success) {
        toast({ type: 'success', title: 'Berhasil', message: `Order ${res.data.invoiceNumber || ''} berhasil dibuat!` });
        router.replace('/(tabs)/orders');
      } else {
        toast({ type: 'error', title: 'Gagal', message: res.message || 'Gagal menyimpan order.' });
      }
    } catch (error: any) {
      toast({ type: 'error', title: 'Error', message: error.message || 'Terjadi kesalahan koneksi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={gradients.loginBackground} style={styles.flex}>
        <SafeAreaView style={[styles.flex, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradients.loginBackground} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        {/* Header Navigation */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tambah Order</Text>
          <View style={styles.iconButton} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <GlassCard style={styles.card}>
            {/* 📍 LANGKAH 1: CARI & PILIH PELANGGAN */}
            <Text style={styles.sectionLabel}>1. PILIH PELANGGAN</Text>

            {selectedCustomer ? (
              <View style={styles.selectedCustomer}>
                <View style={styles.customerInfo}>
                  <Ionicons name="person-circle" size={38} color={colors.primary} />
                  <View>
                    <Text style={styles.customerName}>{selectedCustomer.name}</Text>
                    <Text style={styles.customerPhone}>{selectedCustomer.phone}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setSelectedCustomer(null)}>
                  <Ionicons name="close-circle" size={24} color={colors.error} />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <GlassInput
                  label="Cari Pelanggan"
                  icon="search-outline"
                  placeholder="Ketik nama atau nomor telepon..."
                  value={customerSearch}
                  onChangeText={(text) => {
                    setCustomerSearch(text);
                    setShowCustomerPicker(true);
                  }}
                />
                {showCustomerPicker && customerSearch.length > 0 && (
                  <View style={styles.customerList}>
                    {filteredCustomers.length === 0 ? (
                      <TouchableOpacity
                        style={styles.addNewCustomer}
                        onPress={() => router.push('/customers/add')}
                      >
                        <Ionicons name="person-add" size={18} color={colors.primary} />
                        <Text style={styles.addNewText}>Tambah Pelanggan Baru</Text>
                      </TouchableOpacity>
                    ) : (
                      filteredCustomers.map((c) => (
                        <TouchableOpacity
                          key={c.id}
                          style={styles.customerItem}
                          onPress={() => selectCustomer(c)}
                        >
                          <Ionicons name="person-outline" size={18} color="#414755" />
                          <Text style={styles.customerItemText}>{c.name} - {c.phone}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                )}
              </>
            )}

            {/* 💡 LANGKAH 2: KETERANGAN SINGKATAN */}
            <View style={styles.legendContainer}>
              <Text style={styles.legendTitle}>Keterangan Kode Layanan:</Text>
              <View style={styles.legendGrid}>
                <View style={styles.legendBadge}>
                  <Text style={styles.legendCode}>CS</Text>
                  <Text style={styles.legendDesc}>Cuci Setrika</Text>
                </View>
                <View style={styles.legendBadge}>
                  <Text style={styles.legendCode}>CK</Text>
                  <Text style={styles.legendDesc}>Cuci Kering</Text>
                </View>
                <View style={styles.legendBadge}>
                  <Text style={styles.legendCode}>S</Text>
                  <Text style={styles.legendDesc}>Setrika</Text>
                </View>
                <View style={styles.legendBadge}>
                  <Text style={styles.legendCode}>CB</Text>
                  <Text style={styles.legendDesc}>Cuci Basah</Text>
                </View>
              </View>
            </View>

            {/* LANGKAH 3: RINCIAN ORDER */}
            <Text style={[styles.sectionLabel, { marginTop: 18 }]}>2. RINCIAN LAYANAN & BERAT</Text>

            {orderItems.map((item, index) => {
              const currentPrice = getPricePerKg(item.category, item.serviceCode);
              const subtotal = calculateSubtotal(item);
              const availableCodes: ServiceCode[] = item.category === 'Express' ? ['CS', 'CK', 'S', 'CB'] : ['CS', 'CK', 'S'];

              return (
                <View key={index} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>Item #{index + 1}</Text>
                    {orderItems.length > 1 && (
                      <TouchableOpacity onPress={() => removeItem(index)}>
                        <Ionicons name="trash-outline" size={20} color={colors.error} />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* 3a. Kategori */}
                  <Text style={styles.subLabel}>a. Pilih Kategori Layanan:</Text>
                  <View style={styles.chipRow}>
                    {CATEGORIES.map((cat) => {
                      const isSelected = item.category === cat;
                      return (
                        <TouchableOpacity
                          key={cat}
                          style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                          onPress={() => updateCategory(index, cat)}
                        >
                          <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* 3b. Jenis Layanan */}
                  <Text style={styles.subLabel}>b. Pilih Jenis Layanan:</Text>
                  <View style={styles.chipRow}>
                    {availableCodes.map((code) => {
                      const isSelected = item.serviceCode === code;
                      const price = PRICING_TABLE[item.category as CategoryType]?.[code] || 0;
                      return (
                        <TouchableOpacity
                          key={code}
                          style={[styles.serviceChip, isSelected && styles.serviceChipSelected]}
                          onPress={() => updateServiceCode(index, code)}
                        >
                          <Text style={[styles.serviceChipTitle, isSelected && styles.serviceChipTextSelected]}>
                            {code} ({SERVICE_NAMES[code]})
                          </Text>
                          <Text style={[styles.serviceChipPrice, isSelected && styles.serviceChipTextSelected]}>
                            {formatRupiah(price)}/kg
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* 3c. INPUT BERAT INTERAKTIF (KASIR FRIENDLY) */}
                  <Text style={styles.subLabel}>c. Input Berat (kg):</Text>

                  
                  {/* Control Stepper (- / +) dan Custom Input */}
                  <View style={styles.weightControlRow}>
                    {/* Tombol Kurangi 0.5kg */}
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => adjustQty(index, -0.5)}
                    >
                      <Ionicons name="remove-circle" size={32} color={colors.primary} />
                    </TouchableOpacity>

                    {/* Input Angka / Keyboard */}
                    <View style={styles.weightInputWrapper}>
                      <TextInput
                        style={styles.weightInput}
                        placeholder="0.0"
                        placeholderTextColor="#9E9E9E"
                        keyboardType="decimal-pad"
                        value={item.qty}
                        onChangeText={(text) => updateQty(index, text)}
                      />
                      <Text style={styles.weightUnit}>kg</Text>
                    </View>

                    {/* Tombol Tambah 0.5kg */}
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => adjustQty(index, 0.5)}
                    >
                      <Ionicons name="add-circle" size={32} color={colors.primary} />
                    </TouchableOpacity>
                  </View>

                  {/* Subtotal Box */}
                  <View style={styles.subtotalBox}>
                    <Text style={styles.subtotalLabel}>Subtotal Item:</Text>
                    <Text style={styles.subtotalValue}>{formatRupiah(subtotal)}</Text>
                    <Text style={styles.calcDetail}>
                      ({formatRupiah(currentPrice)} × {parseFloat(item.qty) || 0} kg)
                    </Text>
                  </View>
                </View>
              );
            })}

            {/* Tombol Tambah Item */}
            <TouchableOpacity style={styles.addItemBtn} onPress={addItem}>
              <Ionicons name="add-circle-outline" size={22} color={colors.primary} />
              <Text style={styles.addItemText}>Tambah Layanan Lain</Text>
            </TouchableOpacity>

            {/* Total Akhir */}
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Bayar:</Text>
              <Text style={styles.totalValue}>{formatRupiah(totalPrice)}</Text>
            </View>

            {/* Tombol Buat Order */}
            <View style={{ marginTop: 16 }}>
              <PillButton title="Buat Order" onPress={onSubmit} loading={isSubmitting} />
            </View>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.containerPadding,
    paddingVertical: spacing.stackSm,
  },
  headerTitle: { ...typography.headlineMd, color: colors.primary, fontWeight: '700' },
  iconButton: { padding: 8 },
  scrollContent: { paddingHorizontal: spacing.containerPadding, paddingVertical: spacing.stackMd },
  card: { width: '100%', padding: spacing.stackLg },
  sectionLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: colors.primary,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  subLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: '#424242',
    marginTop: 10,
    marginBottom: 6,
  },

  // Pelanggan
  selectedCustomer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BBDEFB',
  },
  customerInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  customerName: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: '#191c1e' },
  customerPhone: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#727786' },
  customerList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginTop: 4,
    maxHeight: 180,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 3,
  },
  customerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  customerItemText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#191c1e' },
  addNewCustomer: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  addNewText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.primary },

  // Legend Box
  legendContainer: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  legendTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#495057', marginBottom: 8 },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  legendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DEE2E6',
  },
  legendCode: { fontFamily: 'Montserrat_700Bold', fontSize: 11, color: colors.primary },
  legendDesc: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#6C757D' },

  // Card Item Order
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 1,
  },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  itemTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: '#212121' },

  // Chip Selector Kategori & Layanan
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  categoryChipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#616161' },
  categoryTextSelected: { color: '#FFFFFF' },

  serviceChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#CED4DA',
  },
  serviceChipSelected: { backgroundColor: '#E3F2FD', borderColor: colors.primary },
  serviceChipTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#343A40' },
  serviceChipPrice: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#6C757D', marginTop: 2 },
  serviceChipTextSelected: { color: colors.primary, fontWeight: '700' },

  // --- STYLES KHUSUS INPUT BERAT KASIR ---
  presetContainer: { marginBottom: 8 },
  presetHint: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#757575', marginBottom: 4 },
  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  presetChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F3F5',
    borderWidth: 1,
    borderColor: '#CED4DA',
  },
  presetChipSelected: { backgroundColor: '#E3F2FD', borderColor: colors.primary },
  presetText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#495057' },
  presetTextSelected: { color: colors.primary, fontWeight: '700' },

  weightControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    padding: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginVertical: 6,
  },
  stepperBtn: { padding: 4 },
  weightInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 4,
    minWidth: 120,
  },
  weightInput: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
    color: '#212121',
    textAlign: 'center',
    minWidth: 50,
  },
  weightUnit: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
  },

  // Subtotal Box
  subtotalBox: {
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 12,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: '#C8E6C9',
    marginTop: 8,
  },
  subtotalLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: '#2E7D32' },
  subtotalValue: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: '#1B5E20', marginTop: 2 },
  calcDetail: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#388E3C', marginTop: 2 },

  addItemBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8 },
  addItemText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.primary },

  // Total
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    marginTop: 10,
    borderTopWidth: 1.5,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: '#212121' },
  totalValue: { fontFamily: 'Montserrat_700Bold', fontSize: 22, color: colors.primary },
});