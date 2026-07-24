import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';

import { colors, typography } from '../../constants/theme';
import { orderService } from '../services/orderService';
import type { Order } from '../types';

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function statusBadge(order: Order) {
  if (order.paymentStatus === 'BELUM_LUNAS') {
    return { label: 'BELUM BAYAR', bg: '#ffe6e6', color: '#cc0000' };
  }
  switch (order.status) {
    case 'DITERIMA': return { label: 'TERIMA', bg: '#e6f0fa', color: '#0077FF' };
    case 'DIPROSES': return { label: 'PROSES', bg: '#ffebd6', color: '#cc7a00' };
    case 'SELESAI': return { label: 'SELESAI', bg: '#d8f8f2', color: '#009977' };
    case 'DIAMBIL': return { label: 'DIAMBIL', bg: '#eefae6', color: '#34C759' };
    case 'DIBATALKAN': return { label: 'BATAL', bg: '#ffe6e6', color: '#cc0000' };
    default: return { label: order.status, bg: '#e6f0fa', color: '#0077FF' };
  }
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

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

  async function onSearch(text: string) {
    setSearch(text);
    if (text.trim().length < 2) {
      loadOrders();
      return;
    }
    try {
      const res = await orderService.search(text);
      if (res.success) setOrders(res.data);
    } catch {
      loadOrders();
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daftar Order</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/orders/add')}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#727786" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari invoice atau nama pelanggan..."
          placeholderTextColor="#727786"
          value={search}
          onChangeText={onSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => { setSearch(''); loadOrders(); }}>
            <Ionicons name="close-circle" size={18} color="#727786" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {orders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={48} color="#c1c6d7" />
              <Text style={styles.emptyText}>Belum ada order</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/orders/add')}>
                <Text style={styles.emptyBtnText}>Buat Order Baru</Text>
              </TouchableOpacity>
            </View>
          ) : (
            orders.map((order) => {
              const badge = statusBadge(order);
              return (
                <TouchableOpacity key={order.id} onPress={() => router.push(`/orders/${order.id}`)}>
                  <BlurView intensity={30} tint="light" style={styles.orderCard}>
                    <View style={styles.orderHeader}>
                      <Text style={styles.invoiceText}>{order.invoiceNumber}</Text>
                      <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                        <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
                      </View>
                    </View>
                    <View style={styles.orderBody}>
                      <Ionicons name="person-outline" size={16} color="#414755" />
                      <Text style={styles.customerText}>{order.customerName}</Text>
                    </View>
                    <View style={styles.orderFooter}>
                      <Text style={styles.priceText}>{formatRupiah(order.totalPrice)}</Text>
                      <Text style={styles.dateText}>
                        {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>
                  </BlurView>
                </TouchableOpacity>
              );
            })
          )}
          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fb', paddingHorizontal: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 24, color: '#191c1e' },
  addBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16, paddingHorizontal: 16, height: 48, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)',
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: '#191c1e' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  orderCard: {
    padding: 16, borderRadius: 24, marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', overflow: 'hidden',
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  invoiceText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: '#0058bf' },
  orderBody: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  customerText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#191c1e' },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceText: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: '#191c1e' },
  dateText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#727786' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 16, color: '#727786', marginTop: 12, marginBottom: 20 },
  emptyBtn: {
    backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24,
  },
  emptyBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#ffffff' },
});