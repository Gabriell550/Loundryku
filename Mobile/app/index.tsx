import React, { useEffect, useState, useRef } from 'react';
import { View, Image, Text, StyleSheet, Animated } from 'react-native';
import { WebView } from 'react-native-webview';
import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { colors } from '../constants/theme';
import { loadingHtml } from '../assets/html/loadingHtml';
import { spacing, typography } from '../constants/theme';

export default function LoadingScreen() {
  const [ready, setReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const startTime = useRef(Date.now()).current;

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
    async function prepare() {
      await SecureStore.deleteItemAsync('userToken');
      await SecureStore.deleteItemAsync('userUsername');
      await SecureStore.deleteItemAsync('userFullName');
      await SecureStore.deleteItemAsync('userRole');

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 3000 - elapsed);

      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          setReady(true);
        });
      }, remaining);
    }
    prepare();
  }, []);

  if (ready) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ html: loadingHtml }}
        style={StyleSheet.absoluteFill}
        scrollEnabled={false}
        bounces={false}
        javaScriptEnabled={true}
        domStorageEnabled={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        pointerEvents="none"
        androidLayerType="hardware"
      />
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Image
          source={require('../assets/images/Logo.png')}
          style={styles.logo}
        />
        <Text style={styles.brandName}>Laundri-Ku</Text>
        <Text style={styles.brandTagline}>Digital Laundry Kasir</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { width: 120, height: 120, marginBottom: spacing.stackSm },
  brandName: { ...typography.headlineLgMobile, color: '#FFFFFF', textAlign: 'center' },
  brandTagline: { ...typography.bodyMd, color: 'rgba(255,255,255,0.7)', marginTop: 4, textAlign: 'center' },
});
