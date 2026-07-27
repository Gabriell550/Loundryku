import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Assuming for potential icons inside badges or elsewhere

import { colors, spacing, typography, radius } from '../../constants/theme';
import { Transaction } from '../../types/report'; // Assuming path to types

interface TransactionCardProps {
  transaction: Transaction;
}

const getOrderStatusColors = (status: Transaction['orderStatus']) => {
  switch (status) {
    case 'DITERIMA':
      return { background: colors.secondary, text: colors.onSecondary };
    case 'DIPROSES':
      return { background: colors.primary, text: colors.onPrimary };
    case 'SELESAI':
      return { background: colors.success, text: colors.onPrimary };
    case 'DIAMBIL':
      return { background: colors.primaryContainer, text: colors.onPrimaryContainer };
    case 'DIBATALKAN':
      return { background: colors.error, text: colors.onError };
    default:
      return { background: colors.outline, text: colors.onSurface };
  }
};

const getPaymentStatusColors = (status: Transaction['paymentStatus']) => {
  switch (status) {
    case 'BELUM_LUNAS':
      return { background: colors.tertiary, text: colors.onTertiary }; // Orange accent
    case 'LUNAS':
      return { background: colors.success, text: colors.onPrimary }; // Green accent
    default:
      return { background: colors.outline, text: colors.onSurface };
  }
};

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const orderStatusColors = getOrderStatusColors(transaction.orderStatus);
  const paymentStatusColors = getPaymentStatusColors(transaction.paymentStatus);

  // Format date (simple example, could use a date-fns or similar library)
  const formattedDate = new Date(transaction.transactionDate).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // Format price (simple example, could use a currency formatting library)
  const formattedPrice = `Rp ${transaction.totalPrice.toLocaleString('id-ID')}`;

  return (
    <View style={styles.container}>
      {/* Left Section */}
      <View style={styles.leftContent}>
        <Text style={styles.invoiceNumber}>{transaction.invoiceNumber}</Text>
        <Text style={styles.customerName}>{transaction.customerName}</Text>
        <Text style={styles.transactionDate}>{formattedDate}</Text>
      </View>

      {/* Right Section */}
      <View style={styles.rightContent}>
        <Text style={styles.totalPrice}>{formattedPrice}</Text>
        <View style={[styles.badge, { backgroundColor: orderStatusColors.background }]}>
          <Text style={[styles.badgeText, { color: orderStatusColors.text }]}>
            {transaction.orderStatus}
          </Text>
        </View>
        <View style={[styles.badge, { backgroundColor: paymentStatusColors.background }]}>
          <Text style={[styles.badgeText, { color: paymentStatusColors.text }]}>
            {transaction.paymentStatus}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.stackMd,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
    // No horizontal padding here, handled by parent GlassCard
  },
  leftContent: {
    flex: 2,
  },
  invoiceNumber: {
    ...typography.labelMd,
    color: colors.onSurface,
    fontWeight: 'bold',
  },
  customerName: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.stackSm / 2,
  },
  transactionDate: {
    ...typography.labelSm,
    color: colors.outline,
    marginTop: spacing.stackSm / 2,
  },
  rightContent: {
    flex: 1.5,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  totalPrice: {
    ...typography.headlineMd,
    color: colors.onSurface,
    fontWeight: 'bold',
    marginBottom: spacing.stackSm,
  },
  badge: {
    paddingHorizontal: spacing.stackSm,
    paddingVertical: spacing.unit / 2,
    borderRadius: radius.sm,
    marginTop: spacing.unit,
    minWidth: 80, // Ensure minimum width for badges
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    ...typography.labelSm,
    fontWeight: 'bold',
  },
});
