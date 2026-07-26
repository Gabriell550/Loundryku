import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { colors } from '../constants/theme';

export default function Index() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function clearSession() {
      try {
        if (Platform.OS === 'web') {
          // Fallback for Web
          localStorage.removeItem('userToken');
          localStorage.removeItem('userUsername');
          localStorage.removeItem('userFullName');
          localStorage.removeItem('userRole');
        } else {
          // SecureStore for iOS and Android
          await SecureStore.deleteItemAsync('userToken');
          await SecureStore.deleteItemAsync('userUsername');
          await SecureStore.deleteItemAsync('userFullName');
          await SecureStore.deleteItemAsync('userRole');
        }
      } catch (error) {
        console.error("Error clearing session:", error);
      } finally {
        setReady(true);
      }
    }
    
    clearSession();
  }, []);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});