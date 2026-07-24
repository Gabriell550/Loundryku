import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

export default function Index() {
  const [status, setStatus] = useState<'loading' | 'auth' | 'no-auth'>('loading');

  useEffect(() => {
    async function check() {
      const token = await SecureStore.getItemAsync('userToken');
      setStatus(token ? 'auth' : 'no-auth');
    }
    check();
  }, []);

  if (status === 'loading') {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <Redirect href={status === 'auth' ? '/(tabs)' : '/(auth)/login'} />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});