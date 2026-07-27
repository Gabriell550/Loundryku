import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/ui/GlassCard'
import PillButton from '../../components/ui/PillButton' // Assuming PillButton is in the same directory or adjust path
import { colors, spacing, typography, radius } from '../../constants/theme';

interface EmptyReportProps {
  onRefresh: () => void;
}

export default function EmptyReport({ onRefresh }: EmptyReportProps) {
  return (
    <GlassCard style={styles.container}>
      <Ionicons name="clipboard-outline" size={64} color={colors.outline} style={styles.icon} />
      <Text style={styles.text}>Tidak ada laporan</Text>
      <PillButton
        title="Refresh"
        onPress={onRefresh}
        containerStyle={styles.button}
        textStyle={styles.buttonText}
      />
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.containerPadding,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: spacing.stackMd,
  },
  text: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.stackLg,
    textAlign: 'center',
  },
  button: {
    width: 'auto', // Allow button to size to content plus padding
    minWidth: 120,
    height: 40,
    paddingHorizontal: spacing.stackMd,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    ...typography.labelMd,
    color: colors.onPrimary,
  },
});
