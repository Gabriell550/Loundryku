import { useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

type AuthMode = 'signup' | 'login';

export default function RegisterScreen() {
  const [mode, setMode] = useState<AuthMode>('signup');

  const [nama, setNama] = useState('');
  const [noHp, setNoHp] = useState('');
  const [alamat, setAlamat] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isSignUp = mode === 'signup';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ThemedView style={styles.headerSection}>
            <ThemedText type="title" style={styles.appTitle}>
              LoundryKu
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              {isSignUp
                ? 'Daftar akun baru untuk mulai menggunakan'
                : 'Masuk ke akun Anda'}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleTab, isSignUp && styles.toggleTabActive]}
              onPress={() => setMode('signup')}
              activeOpacity={0.7}
            >
              <ThemedText
                style={[styles.toggleText, isSignUp && styles.toggleTextActive]}
              >
                Sign Up
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleTab, !isSignUp && styles.toggleTabActive]}
              onPress={() => setMode('login')}
              activeOpacity={0.7}
            >
              <ThemedText
                style={[
                  styles.toggleText,
                  !isSignUp && styles.toggleTextActive,
                ]}
              >
                Login
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.formContainer}>
            {isSignUp && (
              <>
                <ThemedView style={styles.inputGlass}>
                  <TextInput
                    style={styles.input}
                    placeholder="Nama Lengkap"
                    placeholderTextColor="#94a3b8"
                    value={nama}
                    onChangeText={setNama}
                    autoCapitalize="words"
                  />
                </ThemedView>
                <ThemedView style={styles.inputGlass}>
                  <TextInput
                    style={styles.input}
                    placeholder="No. HP"
                    placeholderTextColor="#94a3b8"
                    value={noHp}
                    onChangeText={setNoHp}
                    keyboardType="phone-pad"
                  />
                </ThemedView>
                <ThemedView style={styles.inputGlass}>
                  <TextInput
                    style={styles.input}
                    placeholder="Alamat"
                    placeholderTextColor="#94a3b8"
                    value={alamat}
                    onChangeText={setAlamat}
                    multiline
                    numberOfLines={2}
                  />
                </ThemedView>
              </>
            )}

            <ThemedView style={styles.inputGlass}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#94a3b8"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </ThemedView>
            <ThemedView style={styles.inputGlass}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#94a3b8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </ThemedView>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={() => router.replace('/(tabs)' as any)}
            >
              <ThemedText style={styles.primaryButtonText}>
                {isSignUp ? 'Daftar' : 'Masuk'}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
    backgroundColor: 'transparent',
  },
  appTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0a7ea4',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    padding: 4,
    marginBottom: 28,
  },
  toggleTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleTabActive: {
    backgroundColor: '#0a7ea4',
    shadowColor: '#0a7ea4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
  },
  toggleTextActive: {
    color: '#ffffff',
  },
  formContainer: {
    gap: 16,
    backgroundColor: 'transparent',
  },
  inputGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 16 : 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  input: {
    fontSize: 16,
    color: '#1e293b',
    fontFamily: Fonts.sans,
  },
  primaryButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#0a7ea4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },
});
