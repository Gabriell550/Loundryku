import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../../components/ui/GlassCard'
import PillButton from '../../components/ui/PillButton'
import { colors, spacing, typography, radius } from '../../constants/theme';

interface ErrorReportProps {
  onRetry: () => void;
  message?: string;
}

export default function ErrorReport({ onRetry, message }: ErrorReportProps) {
  return (
    <GlassCard style={styles.container}>
      <Ionicons name="warning-outline" size={64} color={colors.error} style={styles.icon} />
      <Text style={styles.text}>Gagal mengambil laporan</Text>
      {message && <Text style={styles.errorMessage}>{message}</Text>}
      <PillButton
        title="Coba Lagi"
        onPress={onRetry}
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
    marginBottom: spacing.stackSm,
    textAlign: 'center',
  },
  errorMessage: {
    ...typography.labelSm,
    color: colors.error,
    marginBottom: spacing.stackLg,
    textAlign: 'center',
  },
  button: {
    width: 'auto',
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
