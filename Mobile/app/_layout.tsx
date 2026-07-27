import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';

// 1. TAMBAHKAN IMPORT REACT QUERY DI SINI
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 

import {
  Montserrat_700Bold,
  Montserrat_600SemiBold,
} from '@expo-google-fonts/montserrat';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';
import { ToastProvider } from '../contexts/ToastContext';

// 2. INISIALISASI QUERY CLIENT DI LUAR KOMPONEN
const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      await Font.loadAsync({
        Montserrat_700Bold,
        Montserrat_600SemiBold,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
      });
      setFontsLoaded(true);
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    // 3. BUNGKUS APLIKASI DENGAN QUERYCLIENTPROVIDER
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="customers/add" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="customers/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="orders/add" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="orders/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="orders/search" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="payments/[orderId]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="reports/index" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="reports/[period]" options={{ animation: 'slide_from_right' }} />
        </Stack>
      </ToastProvider>
    </QueryClientProvider>
    <ToastProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="customers/add" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="customers/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="orders/add" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="orders/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="orders/search" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="payments/index" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="payments/[orderId]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="reports/index" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="reports/[period]" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#001a3a',
  },
});