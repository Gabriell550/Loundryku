import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';

import { colors } from '../../constants/theme';
import { customerService } from '../services/customerService';
import type { Customer } from '../types';

export default function CustomersScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadCustomers();
    }, [])
  );

  async function loadCustomers() {
    try {
      const res = await customerService.getAll();
      if (res.success) setCustomers(res.data);
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
      loadCustomers();
      return;
    }
    try {
      const res = await customerService.search(text);
      if (res.success) setCustomers(res.data);
    } catch {
      loadCustomers();
    }
  }

  const onRefresh = () => {
    setRefreshing(true);
    loadCustomers();
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Hapus Pelanggan', `Yakin ingin menghapus ${name}?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          try {
            await customerService.delete(id);
            setCustomers((prev) => prev.filter((c) => c.id !== id));
          } catch {
            Alert.alert('Gagal', 'Gagal menghapus pelanggan.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pelanggan</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/customers/add')}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color="#727786" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama atau nomor telepon..."
          placeholderTextColor="#727786"
          value={search}
          onChangeText={onSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => { setSearch(''); loadCustomers(); }}>
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
          {customers.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color="#c1c6d7" />
              <Text style={styles.emptyText}>Belum ada pelanggan</Text>
              <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/customers/add')}>
                <Text style={styles.emptyBtnText}>Tambah Pelanggan</Text>
              </TouchableOpacity>
            </View>
          ) : (
            customers.map((customer) => (
              <BlurView key={customer.id} intensity={30} tint="light" style={styles.customerCard}>
                <TouchableOpacity
                  style={styles.customerInfo}
                  onPress={() => router.push(`/customers/${customer.id}`)}
                >
                  <View style={styles.avatarCircle}>
                    <Ionicons name="person" size={20} color={colors.primary} />
                  </View>
                  <View style={styles.customerDetails}>
                    <Text style={styles.customerName}>{customer.name}</Text>
                    <Text style={styles.customerPhone}>{customer.phone}</Text>
                    {customer.type && (
                      <View style={styles.typeBadge}>
                        <Text style={styles.typeText}>{customer.type}</Text>
                      </View>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#c1c6d7" />
                </TouchableOpacity>
              </BlurView>
            ))
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
  customerCard: {
    borderRadius: 24, marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', overflow: 'hidden',
  },
  customerInfo: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatarCircle: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#e6f0fa',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  customerDetails: { flex: 1 },
  customerName: { fontFamily: 'Montserrat_700Bold', fontSize: 14, color: '#191c1e', marginBottom: 2 },
  customerPhone: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#727786' },
  typeBadge: {
    alignSelf: 'flex-start', backgroundColor: '#e6f0fa', paddingHorizontal: 8, paddingVertical: 2,
    borderRadius: 8, marginTop: 4,
  },
  typeText: { fontFamily: 'Inter_500Medium', fontSize: 10, color: colors.primary },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 16, color: '#727786', marginTop: 12, marginBottom: 20 },
  emptyBtn: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
  emptyBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#ffffff' },
});