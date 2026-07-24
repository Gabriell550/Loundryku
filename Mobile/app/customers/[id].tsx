import React, { useEffect, useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import GlassCard from '../../components/ui/GlassCard';
import GlassInput from '../../components/ui/GlassInput';
import PillButton from '../../components/ui/PillButton';
import { colors, gradients, spacing, typography } from '../../constants/theme';
import { customerService } from '../services/customerService';
import type { Customer } from '../types';

const customerSchema = z.object({
  name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit').regex(/^[0-9]+$/, 'Hanya boleh angka'),
  address: z.string().min(5, 'Alamat minimal 5 karakter'),
  type: z.enum(['Reguler', 'Prioritas', 'Bisnis']),
});

type CustomerFormData = z.infer<typeof customerSchema>;

const CUSTOMER_TYPES = ['Reguler', 'Prioritas', 'Bisnis'] as const;

export default function EditCustomerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);

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

  useEffect(() => {
    async function load() {
      try {
        const res = await customerService.getById(id);
        if (res.success) {
          setCustomer(res.data);
          setValue('name', res.data.name);
          setValue('phone', res.data.phone);
          setValue('address', res.data.address || '');
          setValue('type', (res.data.type as any) || 'Reguler');
        }
      } catch {
        Alert.alert('Error', 'Gagal memuat data pelanggan');
        router.back();
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const onSubmit = async (data: CustomerFormData) => {
    setIsSubmitting(true);
    try {
      const res = await customerService.update(id, data);
      if (res.success) {
        Alert.alert('Berhasil', 'Data pelanggan berhasil diperbarui!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Gagal', res.message);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Hapus Pelanggan', 'Yakin ingin menghapus pelanggan ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus', style: 'destructive',
        onPress: async () => {
          try {
            await customerService.delete(id);
            Alert.alert('Berhasil', 'Pelanggan berhasil dihapus.', [
              { text: 'OK', onPress: () => router.back() },
            ]);
          } catch {
            Alert.alert('Gagal', 'Gagal menghapus pelanggan.');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <LinearGradient colors={gradients.loginBackground} style={styles.flex}>
        <SafeAreaView style={[styles.flex, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={gradients.loginBackground} style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Pelanggan</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
            <Ionicons name="trash-outline" size={22} color={colors.error} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <GlassCard style={styles.card}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <GlassInput label="Nama Lengkap" icon="person-outline" placeholder="Nama" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.name?.message} />
              )}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value } }) => (
                <GlassInput label="Nomor Telepon" icon="call-outline" placeholder="Telepon" keyboardType="phone-pad" value={value} onChangeText={onChange} onBlur={onBlur} error={errors.phone?.message} />
              )}
            />
            <Controller
              control={control}
              name="address"
              render={({ field: { onChange, onBlur, value } }) => (
                <GlassInput label="Alamat" icon="location-outline" placeholder="Alamat" multiline numberOfLines={3} style={{ height: 90, textAlignVertical: 'top' }} value={value} onChangeText={onChange} onBlur={onBlur} error={errors.address?.message} />
              )}
            />

            <View style={styles.typeContainer}>
              <Text style={styles.typeLabel}>Tipe Pelanggan</Text>
              <View style={styles.pillsRow}>
                {CUSTOMER_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.pillItem, selectedType === type && styles.pillItemSelected]}
                    onPress={() => setValue('type', type)}
                  >
                    <Text style={[styles.pillText, selectedType === type && styles.pillTextSelected]}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.buttonSpacing}>
              <PillButton title="Simpan Perubahan" onPress={handleSubmit(onSubmit)} loading={isSubmitting} />
            </View>
          </GlassCard>
        </ScrollView>
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
  typeContainer: { marginVertical: spacing.stackSm },
  typeLabel: { ...typography.labelMd, color: colors.onSurface, fontWeight: '600', marginBottom: 8 },
  pillsRow: { flexDirection: 'row', gap: 10 },
  pillItem: { flex: 1, paddingVertical: 10, borderRadius: 24, borderWidth: 1.5, borderColor: '#E0E0E0', backgroundColor: '#FFFFFF', alignItems: 'center' },
  pillItemSelected: { borderColor: colors.primary, backgroundColor: '#E3F2FD' },
  pillText: { ...typography.labelMd, color: '#757575', fontWeight: '600' },
  pillTextSelected: { color: colors.primary, fontWeight: '700' },
  buttonSpacing: { marginTop: spacing.stackLg },
});