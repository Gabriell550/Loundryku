import React, { useEffect, useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import GlassCard from '../../components/ui/GlassCard';
import PillButton from '../../components/ui/PillButton';
import { colors, gradients, spacing, typography } from '../../constants/theme';
import { orderService } from '../services/orderService';
import type { Order } from '../types';

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function statusBadge(status: string, bg: string, color: string) {
  return { label: status, bg, color };
}

function getStatusBadge(order: Order) {
  if (order.paymentStatus === 'BELUM_LUNAS') {
    return statusBadge('BELUM BAYAR', '#ffe6e6', '#cc0000');
  }
  switch (order.status) {
    case 'DITERIMA': return statusBadge('TERIMA', '#e6f0fa', '#0077FF');
    case 'DIPROSES': return statusBadge('PROSES', '#ffebd6', '#cc7a00');
    case 'SELESAI': return statusBadge('SELESAI', '#d8f8f2', '#009977');
    case 'DIAMBIL': return statusBadge('DIAMBIL', '#eefae6', '#34C759');
    case 'DIBATALKAN': return statusBadge('BATAL', '#ffe6e6', '#cc0000');
    default: return statusBadge(order.status, '#e6f0fa', '#0077FF');
  }
}

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  async function loadOrder() {
    try {
      const res = await orderService.getById(id);
      if (res.success) setOrder(res.data);
    } catch {
      Alert.alert('Error', 'Gagal memuat detail order');
      router.back();
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = (newStatus: string) => {
    Alert.alert('Ubah Status', `Ubah status ke ${newStatus}?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Ya',
        onPress: async () => {
          try {
            const res = await orderService.updateStatus(id, newStatus);
            if (res.success) setOrder(res.data);
          } catch {
            Alert.alert('Gagal', 'Gagal mengubah status.');
          }
        },
      },
    ]);
  };

  const handlePayment = () => {
    router.push({ pathname: `/payments/${id}` } as any);
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

  const badge = getStatusBadge(order);
  const isPaid = order.paymentStatus === 'LUNAS';

  return (
    <LinearGradient colors={gradients.loginBackground} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail Order</Text>
          <View style={styles.iconButton} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <GlassCard style={styles.card}>
            <View style={styles.invoiceRow}>
              <Text style={styles.invoiceNumber}>{order.invoiceNumber}</Text>
              <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
              </View>
            </View>

            <View style={styles.infoSection}>
              <Ionicons name="person-outline" size={18} color={colors.primary} />
              <Text style={styles.infoText}>{order.customerName}</Text>
            </View>
            <View style={styles.infoSection}>
              <Ionicons name="calendar-outline" size={18} color={colors.primary} />
              <Text style={styles.infoText}>
                {new Date(order.createdAt).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
            {order.paymentMethod && (
              <View style={styles.infoSection}>
                <Ionicons name="wallet-outline" size={18} color={colors.primary} />
                <Text style={styles.infoText}>{order.paymentMethod === 'CASH' ? 'Tunai' : 'Transfer'}</Text>
              </View>
            )}

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>ITEM LAYANAN</Text>
            {order.items.map((item, idx) => (
              <View key={idx} style={styles.itemRow}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.serviceTypeName}</Text>
                  <Text style={styles.itemDetail}>
                    {item.qty} {item.weight || 'kg'} x {formatRupiah(item.price)}
                  </Text>
                </View>
                <Text style={styles.itemSubtotal}>{formatRupiah(item.subtotal)}</Text>
              </View>
            ))}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{formatRupiah(order.totalPrice)}</Text>
            </View>

            <View style={styles.paymentStatusRow}>
              <Text style={styles.paymentLabel}>Status Pembayaran</Text>
              <View style={[styles.paymentBadge, { backgroundColor: isPaid ? '#d8f8f2' : '#ffe6e6', borderLeftColor: isPaid ? '#34C759' : '#FF9500', borderLeftWidth: 4 }]}>
                <Text style={[styles.paymentText, { color: isPaid ? '#009977' : '#cc0000' }]}>
                  {isPaid ? 'LUNAS' : 'BELUM LUNAS'}
                </Text>
              </View>
            </View>
          </GlassCard>

          {!isPaid && (
            <View style={styles.actionButtons}>
              <PillButton title="Bayar Sekarang" onPress={handlePayment} />
            </View>
          )}

          <GlassCard style={[styles.card, { marginTop: 16 }]}>
            <Text style={styles.sectionLabel}>UBAH STATUS</Text>
            <View style={styles.statusButtons}>
              {['DITERIMA', 'DIPROSES', 'SELESAI', 'DIAMBIL', 'DIBATALKAN'].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={[styles.statusBtn, order.status === s && styles.statusBtnActive]}
                  onPress={() => handleUpdateStatus(s)}
                >
                  <Text style={[styles.statusBtnText, order.status === s && styles.statusBtnTextActive]}>
                    {s === 'DITERIMA' ? 'TERIMA' : s === 'DIPROSES' ? 'PROSES' : s === 'SELESAI' ? 'SELESAI' : s === 'DIAMBIL' ? 'AMBIL' : 'BATAL'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </GlassCard>

          <View style={{ height: 40 }} />
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
  invoiceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  invoiceNumber: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: colors.primary },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  infoSection: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  infoText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#414755', flex: 1 },
  divider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 16 },
  sectionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#727786', letterSpacing: 1, marginBottom: 12 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  itemInfo: { flex: 1 },
  itemName: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#191c1e' },
  itemDetail: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#727786', marginTop: 2 },
  itemSubtotal: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: '#191c1e' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 18, color: '#191c1e' },
  totalValue: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: colors.primary },
  paymentStatusRow: { marginTop: 16 },
  paymentLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#727786', letterSpacing: 1, marginBottom: 8 },
  paymentBadge: { padding: 12, borderRadius: 16 },
  paymentText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  actionButtons: { marginTop: 16 },
  statusButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statusBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#f0f0f0', borderWidth: 1, borderColor: '#e0e0e0',
  },
  statusBtnActive: { backgroundColor: '#E3F2FD', borderColor: colors.primary },
  statusBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#414755' },
  statusBtnTextActive: { color: colors.primary },
});