import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';

import { colors, gradients, spacing, typography } from '../../constants/theme';
import { orderService } from '../services/orderService';
import type { Order } from '../types';

function formatRupiah(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export default function SearchOrderScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearched(true);
    try {
      const res = await orderService.search(query);
      if (res.success) setResults(res.data);
    } catch {
      Alert.alert('Error', 'Gagal mencari order.');
    }
  };

  const handleSelect = (order: Order) => {
    if (mode === 'payment') {
      router.push({ pathname: `/payments/${order.id}` } as any);
    } else {
      router.push({ pathname: `/orders/${order.id}` } as any);
    }
  };

  return (
    <LinearGradient colors={gradients.loginBackground} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cari Transaksi</Text>
          <View style={styles.iconButton} />
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputRow}>
            <Ionicons name="search-outline" size={20} color="#727786" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari invoice, nama, atau telepon..."
              placeholderTextColor="#727786"
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity onPress={handleSearch}>
              <Ionicons name="arrow-forward-circle" size={28} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {searched && results.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color="#c1c6d7" />
              <Text style={styles.emptyText}>Tidak ditemukan</Text>
            </View>
          ) : (
            results.map((order) => (
              <TouchableOpacity key={order.id} onPress={() => handleSelect(order)}>
                <BlurView intensity={30} tint="light" style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.invoiceText}>{order.invoiceNumber}</Text>
                    <Text style={styles.priceText}>{formatRupiah(order.totalPrice)}</Text>
                  </View>
                  <View style={styles.orderBody}>
                    <Ionicons name="person-outline" size={16} color="#414755" />
                    <Text style={styles.customerText}>{order.customerName}</Text>
                  </View>
                  <View style={styles.badgesRow}>
                    <View style={[styles.badge, { backgroundColor: order.paymentStatus === 'LUNAS' ? '#d8f8f2' : '#ffe6e6' }]}>
                      <Text style={[styles.badgeText, { color: order.paymentStatus === 'LUNAS' ? '#009977' : '#cc0000' }]}>
                        {order.paymentStatus === 'LUNAS' ? 'LUNAS' : 'BELUM BAYAR'}
                      </Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: '#e6f0fa' }]}>
                      <Text style={[styles.badgeText, { color: '#0077FF' }]}>{order.status}</Text>
                    </View>
                  </View>
                </BlurView>
              </TouchableOpacity>
            ))
          )}
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
  searchContainer: { paddingHorizontal: spacing.containerPadding, marginBottom: spacing.stackMd },
  searchInputRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16, paddingHorizontal: 16, height: 52, gap: 8,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)',
  },
  searchInput: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: '#191c1e' },
  scrollContent: { paddingHorizontal: spacing.containerPadding },
  orderCard: {
    padding: 16, borderRadius: 24, marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', overflow: 'hidden',
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  invoiceText: { fontFamily: 'Montserrat_700Bold', fontSize: 13, color: colors.primary },
  priceText: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: '#191c1e' },
  orderBody: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  customerText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#191c1e' },
  badgesRow: { flexDirection: 'row', gap: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 16, color: '#727786', marginTop: 12 },
});