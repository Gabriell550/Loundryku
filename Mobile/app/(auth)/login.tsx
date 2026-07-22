import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';

import GlassCard from '../components/ui/GlassCard';
import GlassInput from '../components/ui/GlassInput';
import PillButton from '../components/ui/PillButton';
import { colors, gradients, spacing, typography } from '../constants/theme';
import { loginSchema, LoginFormData } from '../schemas/AuthSchema';

export default function LoginScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);

    // TODO: Ganti bagian ini dengan pemanggilan API asli setelah backend siap.
    // Endpoint sesuai PRD: POST /api/auth/login { email, password }
    // Response yang diharapkan berisi JWT token untuk disimpan (mis. via expo-secure-store)
    console.log('Login payload (dummy):', data);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    setIsSubmitting(false);
    router.replace('/(tabs)'); // arahkan ke Dashboard setelah login berhasil
  };

  return (
    <LinearGradient colors={gradients.loginBackground} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Brand / Logo */}
            <View style={styles.brandBlock}>
              <View style={styles.logoCircle}>
                {/* Ganti ikon ini dengan logo asli LaundriFlow kalau sudah ada,
                    mis. <Image source={require('../../assets/images/logo.png')} style={styles.logo} /> */}
                <Ionicons name="shirt-outline" size={32} color={colors.primary} />
              </View>
              <Text style={styles.brandName}>LaundriFlow</Text>
              <Text style={styles.brandTagline}>Digital Laundry Kasir</Text>
            </View>

            {/* Login Card */}
            <GlassCard style={styles.card}>
              <Text style={styles.title}>Masuk sebagai Kasir</Text>
              <Text style={styles.subtitle}>
                Masukan Email dan Password.
              </Text>

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <GlassInput
                    label="Email"
                    icon="mail-outline"
                    placeholder="kasir@laundriflow.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
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
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                  />
                )}
              />

              <Text style={styles.forgotPassword}>Lupa password?</Text>

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
  brandBlock: {
    alignItems: 'center',
    marginBottom: spacing.stackLg,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.stackSm,
    shadowColor: colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
  },
  logo: { width: 40, height: 40 },
  brandName: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
  },
  brandTagline: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  card: {
    width: '100%',
  },
  title: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: 4,
    textAlign : 'center'
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.stackMd,
    textAlign:'center'
  },
  forgotPassword: {
    ...typography.labelMd,
    color: colors.primary,
    textAlign: 'right',
    textTransform: 'none',
    marginBottom: spacing.stackMd,
  },
  buttonSpacing: {
    marginTop: 4,
  },
  footerNote: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.stackLg,
    textTransform: 'none',
  },
});