import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { BlurView } from 'expo-blur';

import { colors, gradients, spacing, typography } from '../../constants/theme';
import { orderService } from '../services/orderService';
import type { Order } from '../types';

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

type FilterTab = 'ALL' | 'BELUM_LUNAS' | 'LUNAS';

const FILTERS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: 'Semua' },
  { key: 'BELUM_LUNAS', label: 'Belum Bayar' },
  { key: 'LUNAS', label: 'Lunas' },
];

export default function PaymentListScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL');

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  async function loadOrders() {
    try {
      const res = await orderService.getAll();
      if (res.success) setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const filteredOrders = activeFilter === 'ALL'
    ? orders
    : orders.filter((o) => o.paymentStatus === activeFilter);

  const handleOrderPress = (order: Order) => {
    router.push({ pathname: `/orders/${order.id}` } as any);
  };

  const handlePayPress = (order: Order) => {
    router.push({ pathname: `/payments/${order.id}` } as any);
  };

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

        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, activeFilter === f.key && styles.filterChipActive]}
              onPress={() => setActiveFilter(f.key)}
            >
              <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsRow}>
          <Text style={styles.statsText}>
            {filteredOrders.length} transaksi
            {activeFilter !== 'ALL' && ` (${activeFilter === 'LUNAS' ? 'Lunas' : 'Belum Bayar'})`}
          </Text>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          >
            {filteredOrders.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="wallet-outline" size={48} color="#c1c6d7" />
                <Text style={styles.emptyText}>
                  {activeFilter === 'LUNAS'
                    ? 'Belum ada transaksi lunas'
                    : activeFilter === 'BELUM_LUNAS'
                    ? 'Semua transaksi sudah lunas'
                    : 'Belum ada transaksi'}
                </Text>
              </View>
            ) : (
              filteredOrders.map((order) => {
                const isPaid = order.paymentStatus === 'LUNAS';
                return (
                  <TouchableOpacity key={order.id} onPress={() => handleOrderPress(order)}>
                    <BlurView intensity={30} tint="light" style={styles.orderCard}>
                      <View style={styles.orderTop}>
                        <View>
                          <Text style={styles.invoiceText}>{order.invoiceNumber}</Text>
                          <View style={styles.customerRow}>
                            <Ionicons name="person-outline" size={14} color="#414755" />
                            <Text style={styles.customerText}>{order.customerName}</Text>
                          </View>
                        </View>
                        <View style={[styles.paymentBadge, {
                          backgroundColor: isPaid ? '#d8f8f2' : '#ffe6e6',
                          borderLeftColor: isPaid ? '#34C759' : '#FF9500',
                          borderLeftWidth: 4,
                        }]}>
                          <Text style={[styles.paymentBadgeText, {
                            color: isPaid ? '#009977' : '#cc0000',
                          }]}>
                            {isPaid ? 'LUNAS' : 'BELUM BAYAR'}
                          </Text>
                          <Text style={styles.priceText}>{formatRupiah(order.totalPrice)}</Text>
                        </View>
                      </View>
                      <View style={styles.orderBottom}>
                        <Text style={styles.dateText}>
                          {new Date(order.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                          })}
                        </Text>
                        {!isPaid && (
                          <TouchableOpacity style={styles.payBtn} onPress={() => handlePayPress(order)}>
                            <Ionicons name="cash-outline" size={16} color="#ffffff" />
                            <Text style={styles.payBtnText}>Bayar</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </BlurView>
                  </TouchableOpacity>
                );
              })
            )}
            <View style={{ height: 20 }} />
          </ScrollView>
        )}
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
  filterRow: {
    flexDirection: 'row', gap: 8, paddingHorizontal: spacing.containerPadding, marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)', borderWidth: 1, borderColor: '#e0e0e0',
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#616161' },
  filterTextActive: { color: '#ffffff' },
  statsRow: { paddingHorizontal: spacing.containerPadding, marginBottom: 12 },
  statsText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#727786' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  orderCard: {
    marginHorizontal: spacing.containerPadding,
    padding: 16, borderRadius: 24, marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', overflow: 'hidden',
  },
  orderTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  invoiceText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: colors.primary, marginBottom: 6 },
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  customerText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#414755' },
  paymentBadge: {
    padding: 10, borderRadius: 12, minWidth: 100, alignItems: 'flex-end',
  },
  paymentBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 11, marginBottom: 4 },
  priceText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: '#191c1e' },
  orderBottom: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 10,
  },
  dateText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#727786' },
  payBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 6,
    borderRadius: 20,
  },
  payBtnText: { fontFamily: 'Inter_700Bold', fontSize: 12, color: '#ffffff' },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 16, color: '#727786', marginTop: 12 },
});
