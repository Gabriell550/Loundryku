import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { z } from 'zod';

import GlassCard from '../../components/ui/GlassCard';
import GlassInput from '../../components/ui/GlassInput';
import PillButton from '../../components/ui/PillButton';
import { colors, gradients, spacing, typography } from '../../constants/theme';
import API_BASE_URL from '../../constants/api';

const loginSchema = z.object({
  username: z.string().min(1, 'Username wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const { token, username, fullName, role } = result.data;
        await SecureStore.setItemAsync('userToken', token);
        await SecureStore.setItemAsync('userUsername', username);
        await SecureStore.setItemAsync('userFullName', fullName);
        await SecureStore.setItemAsync('userRole', role);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login Gagal', result.message || 'Username atau password salah.');
      }
    } catch {
      Alert.alert('Error', 'Gagal terhubung ke server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={gradients.loginBackground} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <View style={styles.brandBlock}>
              <View style={styles.logoCircle}>
                <Ionicons name="shirt-outline" size={32} color={colors.primary} />
              </View>
              <Text style={styles.brandName}>LaundriFlow</Text>
              <Text style={styles.brandTagline}>Digital Laundry Kasir</Text>
            </View>

            <GlassCard style={styles.card}>
              <Text style={styles.title}>Masuk sebagai Kasir</Text>
              <Text style={styles.subtitle}>Masukan Username dan Password.</Text>

              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <GlassInput
                    label="Username"
                    icon="person-outline"
                    placeholder="kasir"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.username?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <GlassInput
                    label="Password"
                    icon="lock-closed-outline"
                    placeholder="Minimal 6 karakter"
                    isPassword
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                  />
                )}
              />

              <View style={styles.buttonSpacing}>
                <PillButton
                  title="Masuk"
                  onPress={handleSubmit(onSubmit)}
                  loading={isSubmitting}
                />
              </View>
            </GlassCard>

            <Text style={styles.footerNote}>
              Hubungi admin jika Anda belum memiliki akun kasir.
            </Text>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.containerPadding,
    paddingVertical: spacing.stackLg,
  },
  brandBlock: { alignItems: 'center', marginBottom: spacing.stackLg },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.stackSm,
  },
  brandName: { ...typography.headlineLgMobile, color: colors.onSurface },
  brandTagline: { ...typography.bodyMd, color: colors.onSurfaceVariant, marginTop: 4 },
  card: { width: '100%' },
  title: { ...typography.headlineMd, color: colors.onSurface, marginBottom: 4, textAlign: 'center' },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.stackMd,
    textAlign: 'center',
  },
  buttonSpacing: { marginTop: 4 },
  footerNote: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.stackLg,
  },
});