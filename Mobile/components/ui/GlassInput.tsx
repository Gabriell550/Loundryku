import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, typography } from '../../constants/theme';

type GlassInputProps = TextInputProps & {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  error?: string;
  isPassword?: boolean;
};

/**
 * GlassInput
 * Input field frosted, border 1px, radius min 16px (sesuai design.md)
 * Mendukung mode password dengan toggle show/hide.
 */
export default function GlassInput({
  label,
  icon,
  error,
  isPassword = false,
  ...textInputProps
}: GlassInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [secure, setSecure] = useState(isPassword);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          !!error && styles.inputWrapperError,
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={isFocused ? colors.primary : colors.onSurfaceVariant}
          style={styles.icon}
        />
        <TextInput
          {...textInputProps}
          secureTextEntry={secure}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          placeholderTextColor={colors.outline}
          style={styles.input}
        />
        {isPassword && (
          <Ionicons
            name={secure ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color={colors.onSurfaceVariant}
            onPress={() => setSecure((prev) => !prev)}
            style={styles.icon}
          />
        )}
      </View>
      {!!error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={13} color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    borderRadius: radius.DEFAULT,
    paddingHorizontal: 16,
    height: 52,
  },
  inputWrapperFocused: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  inputWrapperError: {
    borderColor: colors.error,
  },
  icon: {
    marginHorizontal: 6,
  },
  input: {
    flex: 1,
    ...typography.bodyMd,
    color: colors.onSurface,
    paddingVertical: 0,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
  },
  errorText: {
    ...typography.labelSm,
    color: colors.error,
  },
});