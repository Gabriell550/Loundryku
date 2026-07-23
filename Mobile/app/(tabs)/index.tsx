import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function DashboardScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Profile */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
            style={styles.avatar} 
          />
          <View>
            <Text style={styles.profileName}>Digital Kasir</Text>
            <Text style={styles.profileRole}>Admin Dashboard</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={24} color="#0058bf" />
        </TouchableOpacity>
      </View>

      {/* Greeting */}
      <View style={styles.greetingSection}>
        <Text style={styles.greetingTitle}>Halo, Admin!</Text>
        <Text style={styles.greetingSubtitle}>Layanan laundry hari ini berjalan lancar.</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <BlurView intensity={30} tint="light" style={styles.glassCardRow}>
          <View style={[styles.iconBox, { backgroundColor: '#e6f0fa' }]}>
            <MaterialCommunityIcons name="view-grid-outline" size={28} color="#0077FF" />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryLabel}>Total Order</Text>
            <Text style={styles.summaryValue}>148</Text>
          </View>
        </BlurView>

        <BlurView intensity={30} tint="light" style={styles.glassCardRow}>
          <View style={[styles.iconBox, { backgroundColor: '#e6faf5' }]}>
            <MaterialCommunityIcons name="cash-multiple" size={28} color="#009977" />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryLabel}>Pendapatan</Text>
            <Text style={styles.summaryValue}>Rp 4.2M</Text>
          </View>
        </BlurView>

        <BlurView intensity={30} tint="light" style={styles.glassCardRow}>
          <View style={[styles.iconBox, { backgroundColor: '#eefae6' }]}>
            <Ionicons name="people-outline" size={28} color="#34C759" />
          </View>
          <View style={styles.summaryTextContainer}>
            <Text style={styles.summaryLabel}>Pelanggan</Text>
            <Text style={styles.summaryValue}>82</Text>
          </View>
        </BlurView>
      </View>

      {/* Akses Cepat */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>AKSES CEPAT</Text>
      </View>
      <View style={styles.quickAccessContainer}>
        {/* Primary Action Gradient Card */}
        <TouchableOpacity style={styles.quickAccessCard}>
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

        {/* Glass Action Cards */}
        <TouchableOpacity style={styles.quickAccessCard}>
          <BlurView intensity={30} tint="light" style={styles.glassCardSquare}>
            <Ionicons name="person-add-outline" size={28} color="#191c1e" />
            <Text style={styles.quickAccessTextDark}>Pelanggan</Text>
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickAccessCard}>
          <BlurView intensity={30} tint="light" style={styles.glassCardSquare}>
            <Ionicons name="wallet-outline" size={28} color="#191c1e" />
            <Text style={styles.quickAccessTextDark}>Pembayaran</Text>
          </BlurView>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickAccessCard}>
          <BlurView intensity={30} tint="light" style={styles.glassCardSquare}>
            <Ionicons name="receipt-outline" size={28} color="#191c1e" />
            <Text style={styles.quickAccessTextDark}>Laporan</Text>
          </BlurView>
        </TouchableOpacity>
      </View>

      {/* Transaksi Terbaru */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>TRANSAKSI TERBARU</Text>
        <TouchableOpacity>
          <Text style={styles.linkText}>Lihat Semua</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.recentTransactionsContainer}>
        {/* Transaction Item 1 */}
        <BlurView intensity={30} tint="light" style={styles.transactionCard}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.transactionAvatar} />
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionName}>Budi Santoso</Text>
            <Text style={styles.transactionService}>Layanan Cuci Kering • 2.5kg</Text>
          </View>
          <View style={styles.transactionStatus}>
            <Text style={styles.transactionPrice}>Rp 45.000</Text>
            <View style={[styles.badge, { backgroundColor: '#d8f8f2' }]}>
              <Text style={[styles.badgeText, { color: '#009977' }]}>SELESAI</Text>
            </View>
          </View>
        </BlurView>

        {/* Transaction Item 2 */}
        <BlurView intensity={30} tint="light" style={styles.transactionCard}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=5' }} style={styles.transactionAvatar} />
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionName}>Siska Amelia</Text>
            <Text style={styles.transactionService}>Setrika Saja • 4kg</Text>
          </View>
          <View style={styles.transactionStatus}>
            <Text style={styles.transactionPrice}>Rp 32.000</Text>
            <View style={[styles.badge, { backgroundColor: '#ffebd6' }]}>
              <Text style={[styles.badgeText, { color: '#cc7a00' }]}>PROSES</Text>
            </View>
          </View>
        </BlurView>

        {/* Transaction Item 3 */}
        <BlurView intensity={30} tint="light" style={styles.transactionCard}>
          <Image source={{ uri: 'https://i.pravatar.cc/150?img=8' }} style={styles.transactionAvatar} />
          <View style={styles.transactionDetails}>
            <Text style={styles.transactionName}>Doni Pratama</Text>
            <Text style={styles.transactionService}>Cuci Selimut • 1 unit</Text>
          </View>
          <View style={styles.transactionStatus}>
            <Text style={styles.transactionPrice}>Rp 50.000</Text>
            <View style={[styles.badge, { backgroundColor: '#ffe6e6' }]}>
              <Text style={[styles.badgeText, { color: '#cc0000' }]}>BELUM BAYAR</Text>
            </View>
          </View>
        </BlurView>
      </View>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fb', // Surface bright
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  profileName: {
    fontFamily: 'Montserrat', // Sesuai design.md
    fontSize: 16,
    fontWeight: '700',
    color: '#0058bf', // Primary
  },
  profileRole: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#414755', // On-surface-variant[cite: 5]
  },
  notificationBtn: {
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 999,
    shadowColor: '#005ac4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 2,
  },
  greetingSection: {
    marginBottom: 24,
  },
  greetingTitle: {
    fontFamily: 'Montserrat',
    fontSize: 24,
    fontWeight: '700',
    color: '#191c1e',
    marginBottom: 8,
  },
  greetingSubtitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#414755',
  },
  summaryContainer: {
    gap: 12,
    marginBottom: 32,
  },
  glassCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24, // 24px border radius for glassmorphism[cite: 5]
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent white[cite: 5]
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryLabel: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#414755',
    marginBottom: 4,
  },
  summaryValue: {
    fontFamily: 'Montserrat',
    fontSize: 20,
    fontWeight: '700',
    color: '#191c1e',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: '#414755',
    letterSpacing: 1,
  },
  linkText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: '#0058bf',
  },
  quickAccessContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  quickAccessCard: {
    width: '48%',
    aspectRatio: 1.2,
  },
  gradientCard: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0077FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  glassCardSquare: {
    flex: 1,
    borderRadius: 24,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
  },
  quickAccessTextLight: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 12,
  },
  quickAccessTextDark: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: '#191c1e',
    marginTop: 12,
  },
  recentTransactionsContainer: {
    gap: 12,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    overflow: 'hidden',
  },
  transactionAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '700',
    color: '#191c1e',
    marginBottom: 4,
  },
  transactionService: {
    fontFamily: 'Inter',
    fontSize: 12,
    color: '#727786', // Outline color[cite: 5]
  },
  transactionStatus: {
    alignItems: 'flex-end',
  },
  transactionPrice: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '700',
    color: '#0058bf',
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontFamily: 'Inter',
    fontSize: 10,
    fontWeight: '700',
  }
});