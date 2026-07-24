import React, { useEffect, useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';

import GlassCard from '../../components/ui/GlassCard';
import GlassInput from '../../components/ui/GlassInput';
import PillButton from '../../components/ui/PillButton';
import { colors, gradients, spacing, typography } from '../../constants/theme';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import type { Order } from '../types';

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

const paymentSchema = z.object({
  amount: z.string().min(1, 'Jumlah wajib diisi'),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

const PAYMENT_METHODS = [
  { key: 'CASH', label: 'Tunai', icon: 'cash-outline' as const },
  { key: 'TRANSFER', label: 'QRIS GoPay', icon: 'qr-code-outline' as const },
];

export default function PaymentScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('CASH');

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<PaymentFormData>({
    defaultValues: { amount: '' },
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await orderService.getById(orderId);
        if (res.success) {
          setOrder(res.data);
          setValue('amount', res.data.totalPrice.toString());
        }
      } catch {
        Alert.alert('Error', 'Gagal memuat data order');
        router.back();
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [orderId]);

  const onSubmit = async (data: PaymentFormData) => {
    const amount = parseFloat(data.amount);
    if (!amount || amount <= 0) {
      Alert.alert('Error', 'Jumlah pembayaran tidak valid');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await paymentService.process({
        orderId,
        amount,
        method: selectedMethod,
      });
      if (res.success) {
        Alert.alert('Berhasil', 'Pembayaran berhasil!', [
          { text: 'OK', onPress: () => router.replace(`/orders/${orderId}`) },
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

  if (loading || !order) {
    return (
      <LinearGradient colors={gradients.loginBackground} style={styles.flex}>
        <SafeAreaView style={[styles.flex, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (order.paymentStatus === 'LUNAS') {
    return (
      <LinearGradient colors={gradients.loginBackground} style={styles.flex}>
        <SafeAreaView style={styles.flex}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Pembayaran</Text>
            <View style={styles.iconButton} />
          </View>
          <View style={styles.centerContent}>
            <Ionicons name="checkmark-circle" size={64} color="#34C759" />
            <Text style={styles.paidText}>Order sudah LUNAS</Text>
          </View>
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
          <Text style={styles.headerTitle}>Pembayaran</Text>
          <View style={styles.iconButton} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <GlassCard style={styles.card}>
            <Text style={styles.invoiceNumber}>{order.invoiceNumber}</Text>
            <Text style={styles.customerName}>{order.customerName}</Text>

            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total Tagihan</Text>
              <Text style={styles.totalValue}>{formatRupiah(order.totalPrice)}</Text>
            </View>
          </GlassCard>

          <GlassCard style={styles.card}>
            <Text style={styles.sectionLabel}>METODE PEMBAYARAN</Text>
            <View style={styles.methodsRow}>
              {PAYMENT_METHODS.map((method) => (
                <TouchableOpacity
                  key={method.key}
                  style={[styles.methodCard, selectedMethod === method.key && styles.methodCardSelected]}
                  onPress={() => setSelectedMethod(method.key)}
                >
                  <Ionicons
                    name={method.icon}
                    size={28}
                    color={selectedMethod === method.key ? colors.primary : '#727786'}
                  />
                  <Text style={[styles.methodLabel, selectedMethod === method.key && styles.methodLabelSelected]}>
                    {method.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionLabel, { marginTop: 20 }]}>JUMLAH DIBAYAR</Text>
            <Controller
              control={control}
              name="amount"
              render={({ field: { onChange, onBlur, value } }) => (
                <GlassInput
                  label=""
                  icon="cash-outline"
                  placeholder="0"
                  keyboardType="decimal-pad"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.amount?.message}
                />
              )}
            />

            <View style={styles.buttonSpacing}>
              <PillButton title="Konfirmasi Pembayaran" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />
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
  card: { width: '100%', padding: spacing.stackLg, marginBottom: 16 },
  invoiceNumber: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: colors.primary, marginBottom: 4 },
  customerName: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#191c1e', marginBottom: 16 },
  totalSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#727786' },
  totalValue: { fontFamily: 'Montserrat_700Bold', fontSize: 24, color: colors.primary },
  sectionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#727786', letterSpacing: 1, marginBottom: 12 },
  methodsRow: { flexDirection: 'row', gap: 12 },
  methodCard: {
    flex: 1, padding: 16, borderRadius: 16, alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.5)', borderWidth: 2, borderColor: '#e0e0e0',
  },
  methodCardSelected: { borderColor: colors.primary, backgroundColor: '#E3F2FD' },
  methodLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#727786' },
  methodLabelSelected: { color: colors.primary },
  buttonSpacing: { marginTop: spacing.stackLg },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  paidText: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: '#34C759' },
});