import React, { useEffect, useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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

const orderSchema = z.object({
  customerId: z.string().min(1, 'Pilih pelanggan'),
});

type OrderFormData = z.infer<typeof orderSchema>;

export default function AddOrderScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [orderItems, setOrderItems] = useState<{ serviceTypeId: string; qty: string }[]>([]);

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: { customerId: '' },
  });

  useEffect(() => {
    async function load() {
      try {
        const [custRes, svcRes] = await Promise.all([
          customerService.getAll(),
          serviceTypeService.getAll(),
        ]);
        if (custRes.success) setCustomers(custRes.data);
        if (svcRes.success) setServiceTypes(svcRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.phone.includes(customerSearch)
  );

  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setValue('customerId', customer.id);
    setShowCustomerPicker(false);
    setCustomerSearch('');
  };

  const addItem = () => {
    setOrderItems([...orderItems, { serviceTypeId: '', qty: '' }]);
  };

  const updateItem = (index: number, field: 'serviceTypeId' | 'qty', value: string) => {
    const updated = [...orderItems];
    updated[index] = { ...updated[index], [field]: value };
    setOrderItems(updated);
  };

  const removeItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const totalPrice = orderItems.reduce((sum, item) => {
    const svc = serviceTypes.find((s) => s.id === item.serviceTypeId);
    const qty = parseFloat(item.qty) || 0;
    return sum + (svc ? svc.price * qty : 0);
  }, 0);

  const onSubmit = async () => {
    if (!selectedCustomer) {
      Alert.alert('Peringatan', 'Silakan pilih pelanggan terlebih dahulu.');
      return;
    }
    if (orderItems.length === 0 || orderItems.some((i) => !i.serviceTypeId || !i.qty)) {
      Alert.alert('Peringatan', 'Isi semua layanan dan berat.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await orderService.create({
        customerId: selectedCustomer.id,
        items: orderItems.map((i) => ({
          serviceTypeId: i.serviceTypeId,
          qty: parseFloat(i.qty),
        })),
      });
      if (res.success) {
        Alert.alert('Berhasil', `Order ${res.data.invoiceNumber} berhasil dibuat!`, [
          { text: 'OK', onPress: () => router.replace(`/orders/${res.data.id}`) },
        ]);
      } else {
        Alert.alert('Gagal', res.message);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
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
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tambah Order</Text>
          <View style={styles.iconButton} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <GlassCard style={styles.card}>
            <Text style={styles.sectionLabel}>PILIH PELANGGAN</Text>

            {selectedCustomer ? (
              <View style={styles.selectedCustomer}>
                <View style={styles.customerInfo}>
                  <Ionicons name="person-circle" size={36} color={colors.primary} />
                  <View>
                    <Text style={styles.customerName}>{selectedCustomer.name}</Text>
                    <Text style={styles.customerPhone}>{selectedCustomer.phone}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => { setSelectedCustomer(null); setValue('customerId', ''); }}>
                  <Ionicons name="close-circle" size={22} color={colors.error} />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                <GlassInput
                  label="Cari Pelanggan"
                  icon="search-outline"
                  placeholder="Nama atau nomor telepon..."
                  value={customerSearch}
                  onChangeText={(text) => { setCustomerSearch(text); setShowCustomerPicker(true); }}
                />
                {showCustomerPicker && customerSearch.length > 0 && (
                  <View style={styles.customerList}>
                    {filteredCustomers.length === 0 ? (
                      <TouchableOpacity style={styles.addNewCustomer} onPress={() => router.push('/customers/add')}>
                        <Ionicons name="person-add" size={18} color={colors.primary} />
                        <Text style={styles.addNewText}>Tambah Pelanggan Baru</Text>
                      </TouchableOpacity>
                    ) : (
                      filteredCustomers.map((c) => (
                        <TouchableOpacity key={c.id} style={styles.customerItem} onPress={() => selectCustomer(c)}>
                          <Ionicons name="person-outline" size={18} color="#414755" />
                          <Text style={styles.customerItemText}>{c.name} - {c.phone}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                )}
              </>
            )}

            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>LAYANAN LAUNDRY</Text>

            {orderItems.map((item, index) => {
              const selectedService = serviceTypes.find((s) => s.id === item.serviceTypeId);
              return (
                <View key={index} style={styles.itemRow}>
                  <View style={styles.itemRowHeader}>
                    <Text style={styles.itemNumber}>Item #{index + 1}</Text>
                    <TouchableOpacity onPress={() => removeItem(index)}>
                      <Ionicons name="trash-outline" size={18} color={colors.error} />
                    </TouchableOpacity>
                  </View>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.serviceChips}>
                    {serviceTypes.map((svc) => (
                      <TouchableOpacity
                        key={svc.id}
                        style={[styles.chip, item.serviceTypeId === svc.id && styles.chipSelected]}
                        onPress={() => updateItem(index, 'serviceTypeId', svc.id)}
                      >
                        <Text style={[styles.chipText, item.serviceTypeId === svc.id && styles.chipTextSelected]}>
                          {svc.name}
                        </Text>
                        <Text style={[styles.chipPrice, item.serviceTypeId === svc.id && styles.chipTextSelected]}>
                          {formatRupiah(svc.price)}/{svc.weight}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <View style={styles.qtyRow}>
                    <Text style={styles.qtyLabel}>Berat (kg/pcs):</Text>
                    <GlassInput
                      label=""
                      icon="scale-outline"
                      placeholder="0"
                      keyboardType="decimal-pad"
                      value={item.qty}
                      onChangeText={(text) => updateItem(index, 'qty', text)}
                      style={{ flex: 1 }}
                    />
                    {selectedService && item.qty && (
                      <Text style={styles.subtotal}>
                        = {formatRupiah(selectedService.price * (parseFloat(item.qty) || 0))}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}

            <TouchableOpacity style={styles.addItemBtn} onPress={addItem}>
              <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
              <Text style={styles.addItemText}>Tambah Layanan</Text>
            </TouchableOpacity>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatRupiah(totalPrice)}</Text>
            </View>

            <View style={styles.buttonSpacing}>
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
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.containerPadding, paddingVertical: spacing.stackSm,
  },
  headerTitle: { ...typography.headlineMd, color: colors.primary, fontWeight: '700' },
  iconButton: { padding: 8 },
  scrollContent: { paddingHorizontal: spacing.containerPadding, paddingVertical: spacing.stackMd },
  card: { width: '100%', padding: spacing.stackLg },
  sectionLabel: { ...typography.labelMd, color: colors.onSurfaceVariant, marginBottom: 12, letterSpacing: 1 },
  selectedCustomer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#E3F2FD', padding: 12, borderRadius: 16,
  },
  customerInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  customerName: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: '#191c1e' },
  customerPhone: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#727786' },
  customerList: {
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 16, marginTop: 4,
    maxHeight: 200, borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)',
  },
  customerItem: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  customerItemText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#191c1e' },
  addNewCustomer: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  addNewText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.primary },
  itemRow: {
    backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 16, padding: 12, marginBottom: 12,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.8)',
  },
  itemRowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  itemNumber: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: '#414755' },
  serviceChips: { marginBottom: 8 },
  chip: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8,
    backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#e0e0e0',
  },
  chipSelected: { backgroundColor: '#E3F2FD', borderColor: colors.primary },
  chipText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#414755' },
  chipPrice: { fontFamily: 'Inter_400Regular', fontSize: 10, color: '#727786' },
  chipTextSelected: { color: colors.primary },
  qtyRow: { gap: 8 },
  qtyLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, color: '#727786' },
  subtotal: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: colors.primary, textAlign: 'right' },
  addItemBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12 },
  addItemText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.primary },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#e0e0e0' },
  totalLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: '#191c1e' },
  totalValue: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: colors.primary },
  buttonSpacing: { marginTop: spacing.stackMd },
});