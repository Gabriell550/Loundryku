import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert, // ✅ Tambahkan Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store'; // ✅ Import SecureStore

import GlassCard from '../components/ui/GlassCard';
import GlassInput from '../components/ui/GlassInput';
import PillButton from '../components/ui/PillButton';
import { colors, gradients, spacing, typography } from '../constants/theme';
import { loginSchema, LoginFormData } from '../schemas/AuthSchema';

// ✅ Ganti URL ini dengan URL IP lokal komputer Anda atau domain server Spring Boot
// Contoh jika pakai emulator Android: http://10.0.2.2:8080
// Contoh jika pakai device fisik (Wi-Fi sama): http://192.168.1.xxx:8080
const API_BASE_URL = 'http://192.168.100.179:8080'; 

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

  // ✅ Fungsi onSubmit yang sudah diintegrasikan dengan API
  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);

    try {
      // Hit endpoint POST /api/auth/login sesuai PRD
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          username: data.username, // Gunakan username atau email sesuai kebutuhan backend
          password: data.password,
        }),
      });

      const result = await response.json();
      console.log('Response dari backend:', result);

      if (response.ok && result.success) {
        const { token, username, fullName, role } = result.data;

        await SecureStore.setItemAsync('userToken', token);
        await SecureStore.setItemAsync('userUsername', username);
        await SecureStore.setItemAsync('userFullName', fullName);
        await SecureStore.setItemAsync('userRole', role);

        router.replace("/(tabs)");
      } else {
        // Jika login gagal (Status 401/400)
        Alert.alert("Login Gagal", result.message || "Email atau password salah.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error Jaringan", "Gagal terhubung ke server. Pastikan backend sudah berjalan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (Sisa kode return dan styles tetap sama seperti yang Anda miliki)

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
                Masukan Username dan Password.
              </Text>

              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, onBlur, value } }) => (
                  <GlassInput
                    label="Username"
                    icon="person-outline"
                    placeholder="kasir"
                    keyboardType="default"
                    autoCapitalize="none"
                    autoCorrect={false}
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