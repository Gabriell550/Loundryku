import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ColorValue } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

import { colors, spacing, typography, gradients } from '../../constants/theme';
import { useReport } from '../../services/report.service';
import { ReportPeriod, Transaction } from '../../types/report'; // Import Transaction type

// Import all sub-components
import SegmentControl from '../../components/report/SegmentControl';
import SummaryCard from '../../components/report/SummaryCard';
import RevenueChart from '../../components/report/RevenueChart';
import TransactionCard from '../../components/report/TransactionCard';
import EmptyReport from '../../components/report/EmptyReport';
import LoadingReport from '../../components/report/LoadingReport';
import ErrorReport from '../../components/report/ErrorReport';
import GlassCard from '../../components/ui/GlassCard';

const { width } = Dimensions.get('window');

export default function ReportScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('daily');

  const { data, isLoading, isError, refetch } = useReport(selectedPeriod);

  const handleCalendarPress = () => {
    console.log('Calendar icon pressed');
    // Placeholder for date picker logic
    // This would typically open a modal date picker
  };

  const handleRetry = () => {
    refetch();
  };

  if (isLoading) {
    return <LoadingReport />;
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.title}>Laporan Penjualan</Text>
            <Text style={styles.subtitle}>Lihat performa penjualan laundry.</Text>
          </View>
          <TouchableOpacity onPress={handleCalendarPress} style={styles.calendarIcon}>
            <Ionicons name="calendar-outline" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>
        <ErrorReport onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  if (!data || data.transactions.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.title}>Laporan Penjualan</Text>
            <Text style={styles.subtitle}>Lihat performa penjualan laundry.</Text>
          </View>
          <TouchableOpacity onPress={handleCalendarPress} style={styles.calendarIcon}>
            <Ionicons name="calendar-outline" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>
        <EmptyReport onRefresh={handleRetry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerShown: false, // Custom header handled within the screen
        }}
      />
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.title}>Laporan Penjualan</Text>
          <Text style={styles.subtitle}>Lihat performa penjualan laundry.</Text>
        </View>
        <TouchableOpacity onPress={handleCalendarPress} style={styles.calendarIcon}>
          <Ionicons name="calendar-outline" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Date Filter */}
        <View style={styles.sectionContainer}>
          <SegmentControl
            segments={['daily', 'weekly', 'monthly']}
            selectedSegment={selectedPeriod}
            onSelect={setSelectedPeriod}
          />
        </View>

        {/* Summary Cards */}
        <View style={styles.sectionContainer}>
          <View style={styles.summaryCardsGrid}>
            <SummaryCard
              title="Total Pendapatan"
              value={`Rp ${data.totalRevenue.toLocaleString('id-ID')}`}
              iconName="wallet-outline"
              // Temporary cast for gradient prop due to persistent type errors
              gradient={gradients.oceanToAqua as readonly [string, string, ...string[]]}
              style={styles.summaryCard}
            />
            <SummaryCard
              title="Total Transaksi"
              value={data.totalTransaction}
              iconName="receipt-outline"
              style={styles.summaryCard}
            />
            <SummaryCard
              title="Lunas"
              value={data.paidOrder}
              iconName="checkmark-circle-outline"
              accentColor={colors.success}
              style={styles.summaryCard}
            />
            <SummaryCard
              title="Belum Lunas"
              value={data.unpaidOrder}
              iconName="time-outline"
              accentColor={colors.tertiary}
              style={styles.summaryCard}
            />
          </View>
        </View>

        {/* Revenue Chart */}
        <View style={styles.sectionContainer}>
          <RevenueChart data={data.dailyRevenue || []} />
        </View>

        {/* Transaction List */}
        <View style={styles.sectionContainer}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.sectionTitle}>Transaksi</Text>
            <TouchableOpacity onPress={() => console.log('Lihat Semua Transaksi')}>
              <Text style={styles.viewAllText}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          <GlassCard style={styles.transactionListCard}>
            {data.transactions.map((transaction: Transaction, index: number) => (
              <TransactionCard key={transaction.invoiceNumber} transaction={transaction} />
            ))}
          </GlassCard>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.containerPadding,
    paddingVertical: spacing.stackMd,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  title: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  calendarIcon: {
    padding: spacing.unit,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: spacing.stackMd,
    // Horizontal padding handled by children components or specific sections
  },
  sectionContainer: {
    marginBottom: spacing.stackLg,
    paddingHorizontal: spacing.containerPadding, // Apply here for consistent section spacing
  },
  sectionTitle: {
    ...typography.labelMd,
    color: colors.onSurface,
    marginBottom: spacing.stackSm,
    fontWeight: 'bold', // Added bold as per common practice for section titles
  },
  viewAllText: {
    ...typography.labelMd,
    color: colors.primary,
  },
  summaryCardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -spacing.stackSm, // Counteract card's marginHorizontal
  },
  summaryCard: {
    width: (width - (spacing.containerPadding * 2) - spacing.stackSm * 2) / 2, // Calculate responsive width
    marginBottom: spacing.stackMd,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.stackSm,
  },
  transactionListCard: {
    padding: 0, // TransactionCard has its own padding, no padding needed here
  },
  bottomSpacing: {
    height: spacing.stackLg,
  },
});
