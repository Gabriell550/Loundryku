import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable } from 'react-native';
import { colors, gradients, radius, typography } from '../../constants/theme';

type PillButtonProps = {
  title: string;
  onPress: (e: GestureResponderEvent) => void;
  loading?: boolean;
  disabled?: boolean;
};

/**
 * PillButton
 * Tombol utama "Pill" dengan gradient Ocean Blue -> Fluid Aqua (sesuai design.md)
 */
export default function PillButton({ title, onPress, loading, disabled }: PillButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable onPress={onPress} disabled={isDisabled} style={({ pressed }) => [pressed && styles.pressed]}>
      <LinearGradient
        colors={gradients.oceanToAqua}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.button, isDisabled && styles.buttonDisabled]}
      >
        {loading ? (
          <ActivityIndicator color={colors.onPrimary} />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  text: {
    ...typography.labelMd,
    color: colors.onPrimary,
    fontSize: 16,
    letterSpacing: 0.3,
    textTransform: 'none',
  },
});