import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { colors, typography } from '../../constants/theme';
import { dashboardService } from '../services/dashboardService';
import type { DashboardData } from '../types';

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

function statusBadge(order: { status: string; paymentStatus: string }) {
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

export default function DashboardScreen() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('Admin');
  const [userRole, setUserRole] = useState('Admin');

  async function loadDashboard() {
    try {
      const storedName = await SecureStore.getItemAsync('userFullName');
      const storedRole = await SecureStore.getItemAsync('userRole');
      if (storedName) setUserName(storedName);
      if (storedRole) setUserRole(storedRole === 'ADMIN' ? 'Administrator' : 'Kasir');

      const res = await dashboardService.get();
      if (res.success) setData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadDashboard();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const recentOrders = data?.recentOrders ?? [];

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=11' }} style={styles.avatar} />
          <View>
            <Text style={styles.profileName}>Digital Kasir</Text>
            <Text style={styles.profileRole}>{userRole}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.greetingSection}>
        <Text style={styles.greetingTitle}>Halo, {userName}!</Text>
        <Text style={styles.greetingSubtitle}>Layanan laundry hari ini berjalan lancar.</Text>
      </View>

      <View style={styles.summaryContainer}>
        <BlurView intensity={30} tint="light" style={styles.glassCardRow}>
          <View style={[styles.iconBox, { backgroundColor: '#e6f0fa' }]}>
            <MaterialCommunityIcons name="view-grid-outline" size={28} color="#0077FF" />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryLabel}>Total Order</Text>
            <Text style={styles.summaryValue}>{data?.totalOrderToday ?? 0}</Text>
          </View>
        </BlurView>

        <BlurView intensity={30} tint="light" style={styles.glassCardRow}>
          <View style={[styles.iconBox, { backgroundColor: '#e6faf5' }]}>
            <MaterialCommunityIcons name="cash-multiple" size={28} color="#009977" />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryLabel}>Pendapatan</Text>
            <Text style={styles.summaryValue}>{formatRupiah(data?.revenueToday ?? 0)}</Text>
          </View>
        </BlurView>

        <BlurView intensity={30} tint="light" style={styles.glassCardRow}>
          <View style={[styles.iconBox, { backgroundColor: '#eefae6' }]}>
            <Ionicons name="people-outline" size={28} color="#34C759" />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryLabel}>Pelanggan</Text>
            <Text style={styles.summaryValue}>{data?.totalCustomers ?? 0}</Text>
          </View>
        </BlurView>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>AKSES CEPAT</Text>
      </View>
      <View style={styles.quickAccessContainer}>
        <TouchableOpacity style={styles.quickAccessCard} onPress={() => router.push('/orders/add')}>
          <LinearGradient
            colors={['#0077FF', '#00F5FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientCard}
          >
            <Ionicons name="add-square-outline" size={28} color="#ffffff" />
            <Text style={styles.quickAccessTextLight}>Tambah Order</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickAccessCard} onPress={() => router.push('/customers/add')}>
          <BlurView intensity={30} tint="light" style={styles.glassCardSquare}>
            <Ionicons name="person-add-outline" size={28} color="#191c1e" />
            <Text style={styles.quickAccessTextDark}>Pelanggan</Text>
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickAccessCard} onPress={() => router.push({ pathname: '/orders/search', params: { mode: 'payment' } })}>
          <BlurView intensity={30} tint="light" style={styles.glassCardSquare}>
            <Ionicons name="wallet-outline" size={28} color="#191c1e" />
            <Text style={styles.quickAccessTextDark}>Pembayaran</Text>
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickAccessCard} onPress={() => router.push('/reports/index')}>
          <BlurView intensity={30} tint="light" style={styles.glassCardSquare}>
            <Ionicons name="receipt-outline" size={28} color="#191c1e" />
            <Text style={styles.quickAccessTextDark}>Laporan</Text>
          </BlurView>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>TRANSAKSI TERBARU</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/orders')}>
          <Text style={styles.linkText}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recentTransactionsContainer}>
        {recentOrders.length === 0 ? (
          <BlurView intensity={30} tint="light" style={styles.transactionCard}>
            <View style={styles.transactionDetails}>
              <Text style={styles.noTransactionText}>Belum ada transaksi hari ini</Text>
            </View>
          </BlurView>
        ) : (
          recentOrders.map((order) => {
            const badge = statusBadge(order);
            const itemDesc =
              order.items?.map((i: { serviceTypeName: string }) => i.serviceTypeName).join(', ') ||
              `Invoice ${order.invoiceNumber}`;
            return (
              <TouchableOpacity
                key={order.id}
                onPress={() => router.push(`/orders/${order.id}`)}
              >
                <BlurView intensity={30} tint="light" style={styles.transactionCard}>
                  <View style={styles.transactionAvatarPlaceholder}>
                    <Ionicons name="receipt-outline" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionName}>{order.customerName}</Text>
                    <Text style={styles.transactionService}>{itemDesc}</Text>
                  </View>
                  <View style={styles.transactionStatus}>
                    <Text style={styles.transactionPrice}>{formatRupiah(order.totalPrice)}</Text>
                    <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.badgeText, { color: badge.color }]}>{badge.label}</Text>
                    </View>
                  </View>
                </BlurView>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fb', paddingHorizontal: 20, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  profileSection: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  profileName: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: '#0058bf' },
  profileRole: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#414755' },
  notificationBtn: {
    padding: 8, backgroundColor: '#ffffff', borderRadius: 999,
    shadowColor: '#005ac4', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 2,
  },
  greetingSection: { marginBottom: 24 },
  greetingTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 24, color: '#191c1e', marginBottom: 8 },
  greetingSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#414755' },
  summaryContainer: { gap: 12, marginBottom: 32 },
  glassCardRow: {
    flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', overflow: 'hidden',
  },
  iconBox: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  summaryTextContainer: { flex: 1 },
  summaryLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#414755', marginBottom: 4 },
  summaryValue: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: '#191c1e' },
  sectionHeader: { marginBottom: 16 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#414755', letterSpacing: 1 },
  linkText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#0058bf' },
  quickAccessContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32 },
  quickAccessCard: { width: '48%', aspectRatio: 1.2 },
  gradientCard: {
    flex: 1, borderRadius: 24, padding: 16, justifyContent: 'center', alignItems: 'center',
    shadowColor: '#0077FF', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 4,
  },
  glassCardSquare: {
    flex: 1, borderRadius: 24, padding: 16, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', overflow: 'hidden',
  },
  quickAccessTextLight: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#ffffff', marginTop: 12 },
  quickAccessTextDark: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#191c1e', marginTop: 12 },
  recentTransactionsContainer: { gap: 12 },
  transactionCard: {
    flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', overflow: 'hidden',
  },
  transactionAvatarPlaceholder: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#e6f0fa',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  transactionDetails: { flex: 1 },
  transactionName: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: '#191c1e', marginBottom: 4 },
  transactionService: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#727786' },
  noTransactionText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#727786' },
  transactionStatus: { alignItems: 'flex-end' },
  transactionPrice: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: '#0058bf', marginBottom: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontFamily: 'Inter_700Bold', fontSize: 10 },
});