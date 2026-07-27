import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from '../../components/ui/GlassCard'

import { colors, spacing, typography, radius } from '../../constants/theme';

interface RevenueChartProps {
  data: { day: string; value: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  // Find max value for scaling bar heights
  const maxValue = Math.max(...data.map((item) => item.value));
  const chartHeight = 150; // Fixed height for the chart area

  return (
    <GlassCard style={styles.card}>
      <Text style={styles.title}>Pendapatan</Text>
      <View style={styles.chartContainer}>
        {data.map((item, index) => (
          <View key={item.day} style={styles.barWrapper}>
            <View
              style={[
                styles.bar,
                {
                  height: maxValue > 0 ? (item.value / maxValue) * chartHeight : 0,
                  backgroundColor: colors.primary, // Use primary color for bars
                },
              ]}
            />
            <Text style={styles.barLabel}>{item.day}</Text>
          </View>
        ))}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: spacing.containerPadding,
  },
  title: {
    ...typography.labelMd,
    color: colors.onSurface,
    marginBottom: spacing.stackMd,
    fontWeight: 'bold',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150, // Must match chartHeight in component for correct scaling
    paddingHorizontal: spacing.stackSm,
    paddingBottom: spacing.stackSm,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  barWrapper: {
    alignItems: 'center',
  },
  bar: {
    width: 20, // Fixed width for each bar
    borderRadius: radius.sm, // Rounded tops for bars
    marginBottom: spacing.stackSm / 2,
  },
  barLabel: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
  },
});
