import React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native'; // Tambahkan StyleProp
import { BlurView } from 'expo-blur';
import { colors, radius } from '../../constants/theme';

type GlassCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>; // Ubah agar menerima array styles tanpa error
  intensity?: number;
  noPadding?: boolean; // Prop baru untuk mencegah bentrok padding
};

/**
 * GlassCard
 * Container dengan efek "Level 1 Glassmorphic"
 */
export default function GlassCard({ children, style, intensity = 40, noPadding = false }: GlassCardProps) {
  return (
    <View style={[styles.shadowWrapper, style]}>
      <BlurView intensity={intensity} tint="light" style={styles.blur}>
        <View style={[
          styles.overlay, 
          // Jika noPadding true, hilangkan padding dan background overlay bawaan
          noPadding && { padding: 0, backgroundColor: 'transparent' }
        ]}>
          {children}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: radius.md,
    shadowColor: colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  blur: {
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 24,
  },
});