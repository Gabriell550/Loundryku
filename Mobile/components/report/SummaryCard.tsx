import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native'; // Tambahkan StyleProp dan ViewStyle
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import GlassCard from '../../components/ui/GlassCard';
import { colors, spacing, typography, radius } from '../../constants/theme';

interface SummaryCardProps {
  title: string;
  value: string | number;
  iconName: keyof typeof Ionicons.glyphMap;
  accentColor?: string;
  gradient?: readonly [string, string, ...string[]];
  style?: StyleProp<ViewStyle>; // 1. Tambahkan deklarasi style di sini
}

export default function SummaryCard({
  title,
  value,
  iconName,
  accentColor,
  gradient,
  style, // 2. Destructure style dari props
}: SummaryCardProps) {
  const cardContent = (
    <>
      <View style={styles.iconContainer}>
        <Ionicons name={iconName} size={24} color={accentColor || colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color: accentColor || colors.onSurface }]}>{value}</Text>
    </>
  );

  return (
    // 3. Gabungkan styles.card bawaan dengan style yang dikirim dari ReportScreen
    <GlassCard style={[styles.card, style]} noPadding>
      {gradient ? (
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          {cardContent}
        </LinearGradient>
      ) : (
        <View style={styles.plainBackground}>
          {cardContent}
        </View>
      )}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: spacing.stackSm, 
  },
  gradientBackground: {
    flex: 1,
    padding: spacing.containerPadding,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plainBackground: {
    flex: 1,
    padding: spacing.containerPadding,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)', 
  },
  iconContainer: {
    marginBottom: spacing.stackSm,
  },
  title: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  value: {
    ...typography.headlineMd,
    textAlign: 'center',
    marginTop: spacing.stackSm / 2, 
  },
});