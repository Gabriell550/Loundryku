import React, { useEffect, useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

import GlassCard from '../../components/ui/GlassCard';
import { colors, gradients, spacing, typography } from '../../constants/theme';
import { reportService } from '../services/reportService';
import type { ReportData } from '../types';

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

const PERIOD_LABELS: Record<string, string> = {
  daily: 'Harian',
  weekly: 'Mingguan',
  monthly: 'Bulanan',
};

export default function ReportDetailScreen() {
  const { period = 'daily' } = useLocalSearchParams<{ period: string }>();
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [period]);

  async function loadReport() {
    setLoading(true);
    try {
      const serviceMap: Record<string, () => Promise<any>> = {
        daily: reportService.daily,
        weekly: reportService.weekly,
        monthly: reportService.monthly,
      };
      const fn = serviceMap[period];
      if (fn) {
        const res = await fn();
        if (res.success) setData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LinearGradient colors={gradients.loginBackground} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Laporan {PERIOD_LABELS[period]}</Text>
          <TouchableOpacity onPress={loadReport} style={styles.iconButton}>
            <Ionicons name="refresh" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : data ? (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <GlassCard style={styles.card}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Total Order</Text>
                  <Text style={styles.summaryValue}>{data.totalOrders}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryLabel}>Pendapatan</Text>
                  <Text style={styles.summaryValue}>{formatRupiah(data.totalRevenue)}</Text>
                </View>
              </View>
              <Text style={styles.dateRange}>
                {new Date(data.startDate).toLocaleDateString('id-ID')} - {new Date(data.endDate).toLocaleDateString('id-ID')}
              </Text>
            </GlassCard>

            <Text style={styles.sectionTitle}>DAFTAR TRANSAKSI</Text>
            {data.orders.length === 0 ? (
              <Text style={styles.emptyText}>Tidak ada transaksi</Text>
            ) : (
              data.orders.map((order) => (
                <TouchableOpacity
                  key={order.id}
                  onPress={() => router.push({ pathname: `/orders/${order.id}` } as any)}
                >
                  <GlassCard style={styles.orderCard}>
                    <View style={styles.orderHeader}>
                      <Text style={styles.invoiceText}>{order.invoiceNumber}</Text>
                      <Text style={styles.orderPrice}>{formatRupiah(order.totalPrice)}</Text>
                    </View>
                    <Text style={styles.orderCustomer}>{order.customerName}</Text>
                    <Text style={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </GlassCard>
                </TouchableOpacity>
              ))
            )}
            <View style={{ height: 40 }} />
          </ScrollView>
        ) : null}
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: spacing.containerPadding, paddingVertical: spacing.stackMd },
  card: { width: '100%', padding: spacing.stackLg, marginBottom: 16 },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#727786', letterSpacing: 1, marginBottom: 8 },
  summaryValue: { fontFamily: 'Montserrat_700Bold', fontSize: 24, color: '#191c1e' },
  divider: { width: 1, height: 50, backgroundColor: '#e0e0e0', marginHorizontal: 16 },
  dateRange: { textAlign: 'center', fontFamily: 'Inter_400Regular', fontSize: 12, color: '#727786', marginTop: 12 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#727786', letterSpacing: 1, marginBottom: 12 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#727786', textAlign: 'center', marginTop: 20 },
  orderCard: { padding: 16, marginBottom: 10 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  invoiceText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: colors.primary },
  orderPrice: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: '#191c1e' },
  orderCustomer: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#191c1e', marginBottom: 4 },
  orderDate: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#727786' },
});