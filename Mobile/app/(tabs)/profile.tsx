import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { colors } from '../../constants/theme';

export default function ProfileScreen() {
  const [user, setUser] = useState({ fullName: '', username: '', role: '' });

  useEffect(() => {
    async function load() {
      const fullName = await SecureStore.getItemAsync('userFullName') || 'Kasir';
      const username = await SecureStore.getItemAsync('userUsername') || '';
      const role = await SecureStore.getItemAsync('userRole') || 'KASIR';
      setUser({ fullName, username, role });
    }
    load();
  }, []);

  const handleLogout = () => {
    Alert.alert('Logout', 'Yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await SecureStore.deleteItemAsync('userToken');
          await SecureStore.deleteItemAsync('userUsername');
          await SecureStore.deleteItemAsync('userFullName');
          await SecureStore.deleteItemAsync('userRole');
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <BlurView intensity={30} tint="light" style={styles.profileCard}>
        <View style={styles.avatarLarge}>
          <Ionicons name="person" size={36} color={colors.primary} />
        </View>
        <Text style={styles.fullName}>{user.fullName}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user.role === 'ADMIN' ? 'Administrator' : 'Kasir'}</Text>
        </View>
      </BlurView>

      <BlurView intensity={30} tint="light" style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={20} color={colors.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Username</Text>
            <Text style={styles.infoValue}>{user.username}</Text>
          </View>
        </View>
      </BlurView>

      <View style={styles.menuSection}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/userManagement')}
        >
          <Ionicons name="people-outline" size={22} color={colors.primary} />
          <Text style={styles.menuText}>Kelola Pengguna</Text>
          <Ionicons name="chevron-forward" size={18} color="#c1c6d7" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={colors.error} />
          <Text style={[styles.menuText, { color: colors.error }]}>Logout</Text>
          <Ionicons name="chevron-forward" size={18} color="#c1c6d7" />
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>LaundriFlow v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fb', paddingHorizontal: 20, paddingTop: 50 },
  header: { marginBottom: 24 },
  headerTitle: { fontFamily: 'Montserrat_700Bold', fontSize: 24, color: '#191c1e' },
  profileCard: {
    alignItems: 'center', padding: 24, borderRadius: 24, marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', overflow: 'hidden',
  },
  avatarLarge: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: '#e6f0fa',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  fullName: { fontFamily: 'Montserrat_700Bold', fontSize: 20, color: '#191c1e', marginBottom: 8 },
  roleBadge: { backgroundColor: '#e6f0fa', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16 },
  roleText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: colors.primary },
  infoCard: {
    padding: 16, borderRadius: 24, marginBottom: 24,
    backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)', overflow: 'hidden',
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoContent: { flex: 1 },
  infoLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#727786' },
  infoValue: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#191c1e' },
  menuSection: { gap: 10, marginBottom: 32 },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 16, borderRadius: 16, gap: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.9)',
  },
  menuText: { flex: 1, fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#191c1e' },
  version: { textAlign: 'center', fontFamily: 'Inter_400Regular', fontSize: 12, color: '#c1c6d7', marginBottom: 40 },
});