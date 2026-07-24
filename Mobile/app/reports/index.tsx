import React from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import GlassCard from '../../components/ui/GlassCard';
import { colors, gradients, spacing, typography } from '../../constants/theme';

const REPORT_TYPES = [
  { key: 'daily', label: 'Harian', icon: 'today-outline', desc: 'Laporan transaksi hari ini', color: '#0077FF' },
  { key: 'weekly', label: 'Mingguan', icon: 'calendar-outline', desc: 'Laporan transaksi minggu ini', color: '#009977' },
  { key: 'monthly', label: 'Bulanan', icon: 'calendar-number-outline', desc: 'Laporan transaksi bulan ini', color: '#FF9500' },
];

export default function ReportListScreen() {
  return (
    <LinearGradient colors={gradients.loginBackground} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Laporan</Text>
          <View style={styles.iconButton} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {REPORT_TYPES.map((report) => (
            <TouchableOpacity
              key={report.key}
              onPress={() => router.push({ pathname: `/reports/${report.key}` } as any)}
            >
              <GlassCard style={styles.reportCard}>
                <View style={[styles.iconCircle, { backgroundColor: report.color + '20' }]}>
                  <Ionicons name={report.icon as any} size={28} color={report.color} />
                </View>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportLabel}>{report.label}</Text>
                  <Text style={styles.reportDesc}>{report.desc}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#c1c6d7" />
              </GlassCard>
            </TouchableOpacity>
          ))}
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
  reportCard: { flexDirection: 'row', alignItems: 'center', padding: 16, marginBottom: 12 },
  iconCircle: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  reportInfo: { flex: 1 },
  reportLabel: { fontFamily: 'Montserrat_700Bold', fontSize: 16, color: '#191c1e', marginBottom: 4 },
  reportDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#727786' },
});