import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { z } from 'zod';

import GlassCard from '../../components/ui/GlassCard';
import GlassInput from '../../components/ui/GlassInput';
import PillButton from '../../components/ui/PillButton';
import { colors, gradients, spacing, typography } from '../../constants/theme';
import { customerService } from '../services/customerService';

const customerSchema = z.object({
  name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit').regex(/^[0-9]+$/, 'Hanya boleh angka'),
  address: z.string().min(5, 'Alamat minimal 5 karakter'),
  type: z.enum(['Reguler', 'Prioritas', 'Bisnis']),
});

type CustomerFormData = z.infer<typeof customerSchema>;

const CUSTOMER_TYPES = ['Reguler', 'Prioritas', 'Bisnis'] as const;

export default function AddCustomerScreen() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: '', phone: '', address: '', type: 'Reguler' },
  });

  const selectedType = watch('type');

  const onSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true);
    try {
      const res = await customerService.create(data);
      if (res.success) {
        Alert.alert('Berhasil', 'Pelanggan baru berhasil ditambahkan!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Gagal', res.message || 'Gagal menambahkan pelanggan.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Gagal terhubung ke server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={gradients.loginBackground} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tambah Pelanggan</Text>
          <View style={styles.iconButton} />
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <GlassCard style={styles.card}>
              <View style={styles.iconCircleContainer}>
                <View style={styles.iconCircle}>
                  <Ionicons name="person-add" size={30} color={colors.primary} />
                </View>
                <Text style={styles.cardSubtitle}>Masukkan detail informasi pelanggan baru.</Text>
              </View>

              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <GlassInput
                    label="Nama Lengkap"
                    icon="person-outline"
                    placeholder="Contoh: Budi Santoso"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.name?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <GlassInput
                    label="Nomor Telepon"
                    icon="call-outline"
                    placeholder="812 3456 7890"
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.phone?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="address"
                render={({ field: { onChange, onBlur, value } }) => (
                  <GlassInput
                    label="Alamat Lengkap"
                    icon="location-outline"
                    placeholder="Jl. Merdeka No. 123, Jakarta Selatan..."
                    multiline
                    numberOfLines={3}
                    style={{ height: 90, textAlignVertical: 'top' }}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.address?.message}
                  />
                )}
              />

              <View style={styles.typeContainer}>
                <Text style={styles.typeLabel}>Tipe Pelanggan</Text>
                <View style={styles.pillsRow}>
                  {CUSTOMER_TYPES.map((type) => {
                    const isSelected = selectedType === type;
                    return (
                      <TouchableOpacity
                        key={type}
                        style={[styles.pillItem, isSelected && styles.pillItemSelected]}
                        onPress={() => setValue('type', type)}
                      >
                        <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                {errors.type && <Text style={styles.errorText}>{errors.type.message}</Text>}
              </View>

              <View style={styles.buttonSpacing}>
                <PillButton title="Simpan Pelanggan" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />
              </View>
            </GlassCard>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.containerPadding, paddingVertical: spacing.stackSm,
  },
  headerTitle: { ...typography.headlineMd, color: colors.primary, fontWeight: '700' },
  iconButton: { padding: 8 },
  scrollContent: { paddingHorizontal: spacing.containerPadding, paddingVertical: spacing.stackMd },
  card: { width: '100%', padding: spacing.stackLg },
  iconCircleContainer: { alignItems: 'center', marginBottom: spacing.stackLg },
  iconCircle: {
    width: 68, height: 68, borderRadius: 34, backgroundColor: '#E1F5FE',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.stackSm,
  },
  cardSubtitle: { ...typography.bodyMd, color: colors.onSurfaceVariant, textAlign: 'center', lineHeight: 20 },
  typeContainer: { marginVertical: spacing.stackSm },
  typeLabel: { ...typography.labelMd, color: colors.onSurface, fontWeight: '600', marginBottom: 8 },
  pillsRow: { flexDirection: 'row', gap: 10 },
  pillItem: {
    flex: 1, paddingVertical: 10, borderRadius: 24, borderWidth: 1.5,
    borderColor: '#E0E0E0', backgroundColor: '#FFFFFF', alignItems: 'center',
  },
  pillItemSelected: { borderColor: colors.primary, backgroundColor: '#E3F2FD' },
  pillText: { ...typography.labelMd, color: '#757575', fontWeight: '600' },
  pillTextSelected: { color: colors.primary, fontWeight: '700' },
  errorText: { ...typography.labelSm, color: colors.error, marginTop: 4 },
  buttonSpacing: { marginTop: spacing.stackLg },
});