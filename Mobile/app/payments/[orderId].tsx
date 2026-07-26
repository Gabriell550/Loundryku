import React, { useEffect, useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { toast } from '../../contexts/ToastContext';
import GlassCard from '../../components/ui/GlassCard';
import GlassInput from '../../components/ui/GlassInput';
import PillButton from '../../components/ui/PillButton';
import { colors, gradients, spacing, typography } from '../../constants/theme';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import type { Order } from '../types';
import { generateReceiptHtml } from '../components/ReceiptHtml';

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
        toast({ type: 'error', message: 'Gagal memuat data order' });
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
      toast({ type: 'warning', message: 'Jumlah pembayaran tidak valid' });
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
        toast({ type: 'success', title: 'Berhasil', message: 'Pembayaran berhasil!' });
        router.replace(`/orders/${orderId}`);
      } else {
        toast({ type: 'error', title: 'Gagal', message: res.message });
      }
    } catch (error: any) {
      toast({ type: 'error', title: 'Error', message: error.message });
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

  const handlePrint = async () => {
    try {
      const html = generateReceiptHtml(order);
      await Print.printAsync({ html });
    } catch (err: any) {
      toast({ type: 'error', message: err.message || 'Gagal mencetak' });
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const html = generateReceiptHtml(order);
      const { uri } = await Print.printToFileAsync({ html });
      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (isSharingAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Struk ${order.invoiceNumber}`,
          UTI: 'com.adobe.pdf',
        });
      } else {
        toast({ type: 'warning', message: 'Sharing tidak tersedia di perangkat ini' });
      }
    } catch (err: any) {
      toast({ type: 'error', message: err.message || 'Gagal download PDF' });
    }
  };

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
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <GlassCard style={styles.card}>
              <View style={styles.paidHeader}>
                <Ionicons name="checkmark-circle" size={48} color="#34C759" />
                <Text style={styles.paidTitle}>Pembayaran Berhasil</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>No. Invoice</Text>
                <Text style={styles.receiptValue}>{order.invoiceNumber}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Pelanggan</Text>
                <Text style={styles.receiptValue}>{order.customerName}</Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Tanggal</Text>
                <Text style={styles.receiptValue}>
                  {new Date(order.updatedAt || order.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </Text>
              </View>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Pembayaran</Text>
                <Text style={styles.receiptValue}>{order.paymentMethod === 'CASH' ? 'Tunai' : 'Transfer'}</Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.sectionLabel}>ITEM LAYANAN</Text>
              {order.items.map((item, idx) => (
                <View key={idx} style={styles.receiptItemRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.receiptItemName}>{item.serviceTypeName}</Text>
                    <Text style={styles.receiptItemDetail}>
                      {item.qty} kg x {formatRupiah(item.price)}
                    </Text>
                  </View>
                  <Text style={styles.receiptItemSubtotal}>{formatRupiah(item.subtotal)}</Text>
                </View>
              ))}

              <View style={styles.divider} />

              <View style={styles.receiptTotalRow}>
                <Text style={styles.receiptTotalLabel}>Total Dibayar</Text>
                <Text style={styles.receiptTotalValue}>{formatRupiah(order.totalPrice)}</Text>
              </View>
            </GlassCard>

            <View style={styles.receiptActions}>
              <TouchableOpacity style={styles.actionBtn} onPress={handlePrint}>
                <Ionicons name="print-outline" size={20} color="#ffffff" />
                <Text style={styles.actionBtnText}>Cetak Struk</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]} onPress={handleDownloadPdf}>
                <Ionicons name="download-outline" size={20} color={colors.primary} />
                <Text style={[styles.actionBtnText, { color: colors.primary }]}>Download PDF</Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>
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

  paidHeader: { alignItems: 'center', gap: 8, marginBottom: 8 },
  paidTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: '#34C759' },
  divider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 16 },
  receiptRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
  },
  receiptLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#727786' },
  receiptValue: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#191c1e', textAlign: 'right', flex: 1, marginLeft: 16 },
  receiptItemRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10,
  },
  receiptItemName: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#191c1e' },
  receiptItemDetail: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#727786', marginTop: 2 },
  receiptItemSubtotal: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: '#191c1e' },
  receiptTotalRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  receiptTotalLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: '#191c1e' },
  receiptTotalValue: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: colors.primary },
  receiptActions: { flexDirection: 'row', gap: 12, marginTop: 8 },
  actionBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 24,
  },
  actionBtnSecondary: {
    backgroundColor: '#ffffff', borderWidth: 2, borderColor: colors.primary,
  },
  actionBtnText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#ffffff' },
});