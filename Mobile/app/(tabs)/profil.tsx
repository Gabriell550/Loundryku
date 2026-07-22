import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

const menuItems = [
  { icon: '📋', label: 'Data Diri' },
  { icon: '📍', label: 'Alamat Saya' },
  { icon: '🔔', label: 'Notifikasi' },
  { icon: '❓', label: 'Bantuan' },
  { icon: '📝', label: 'Syarat & Ketentuan' },
];

export default function ProfilScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Profil Saya</ThemedText>
      </ThemedView>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.profileCard}>
          <ThemedView style={styles.avatarLarge}>
            <ThemedText style={styles.avatarText}>B</ThemedText>
          </ThemedView>
          <ThemedText style={styles.profileName}>Budi Santoso</ThemedText>
          <ThemedText style={styles.profilePhone}>+62 812-3456-7890</ThemedText>
          <ThemedText style={styles.profileAddress}>
            Jl. Merdeka No. 123, Jakarta
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index === menuItems.length - 1 && styles.menuItemLast,
              ]}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.menuIcon}>{item.icon}</ThemedText>
              <ThemedText style={styles.menuLabel}>{item.label}</ThemedText>
              <ThemedText style={styles.menuArrow}>›</ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.7}
          onPress={() => router.replace('/register' as any)}
        >
          <ThemedText style={styles.logoutText}>Keluar</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  profilePhone: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  profileAddress: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 2,
  },
  menuSection: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: 'transparent',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 15,
    color: '#1e293b',
    flex: 1,
  },
  menuArrow: {
    fontSize: 20,
    color: '#94a3b8',
    fontWeight: '300',
  },
  logoutButton: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fee2e2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ef4444',
  },
});
