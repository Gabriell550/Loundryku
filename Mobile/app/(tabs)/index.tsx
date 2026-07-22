import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StatusBar } from 'expo-status-bar';

const stages = [
  { key: 'diterima', label: 'Diterima', icon: '📥' },
  { key: 'dicuci', label: 'Dicuci', icon: '🧺' },
  { key: 'dikeringkan', label: 'Dikeringkan', icon: '💨' },
  { key: 'disetrika', label: 'Disetrika', icon: '🔥' },
  { key: 'selesai', label: 'Selesai', icon: '✅' },
];

const activeStage = 'dicuci';

export default function CustomerDashboard() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.header}>
          <ThemedView style={styles.headerContent}>
            <ThemedText style={styles.greeting}>Halo, Budi!</ThemedText>
            <ThemedText style={styles.headerSub}>
              Selamat datang kembali
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.avatar}>
            <ThemedText style={styles.avatarText}>B</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.trackingCard}>
          <ThemedText style={styles.cardTitle}>Live Order Tracking</ThemedText>

          <ThemedView style={styles.stagesContainer}>
            {stages.map((stage, index) => {
              const isActive = stage.key === activeStage;
              const isCompleted = getStageIndex(stage.key) < getStageIndex(activeStage);

              return (
                <ThemedView key={stage.key} style={styles.stageRow}>
                  <ThemedView style={styles.stageIconContainer}>
                    <ThemedView
                      style={[
                        styles.stageIcon,
                        isActive && styles.stageIconActive,
                        isCompleted && styles.stageIconCompleted,
                      ]}
                    >
                      <ThemedText style={styles.stageEmoji}>
                        {stage.icon}
                      </ThemedText>
                    </ThemedView>
                    {index < stages.length - 1 && (
                      <ThemedView
                        style={[
                          styles.stageLine,
                          (isActive || isCompleted) && styles.stageLineActive,
                        ]}
                      />
                    )}
                  </ThemedView>
                  <ThemedText
                    style={[
                      styles.stageLabel,
                      isActive && styles.stageLabelActive,
                      isCompleted && styles.stageLabelCompleted,
                    ]}
                  >
                    {stage.label}
                  </ThemedText>
                  {isActive && (
                    <ThemedView style={styles.activeBadge}>
                      <ThemedText style={styles.activeBadgeText}>
                        Sedang {stage.label.toLowerCase()}
                      </ThemedText>
                    </ThemedView>
                  )}
                </ThemedView>
              );
            })}
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.infoCard}>
          <ThemedText style={styles.infoTitle}>Pesanan Aktif</ThemedText>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>No. Pesanan</ThemedText>
            <ThemedText style={styles.infoValue}>#ORD-001</ThemedText>
          </ThemedView>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Layanan</ThemedText>
            <ThemedText style={styles.infoValue}>Reguler</ThemedText>
          </ThemedView>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Berat</ThemedText>
            <ThemedText style={styles.infoValue}>2.5 kg</ThemedText>
          </ThemedView>
          <ThemedView style={styles.infoRow}>
            <ThemedText style={styles.infoLabel}>Estimasi Selesai</ThemedText>
            <ThemedText style={styles.infoValue}>24 Jul 2026</ThemedText>
          </ThemedView>
        </ThemedView>

        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
          <ThemedText style={styles.primaryButtonText}>
            + Buat Pesanan Baru
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function getStageIndex(key: string) {
  return stages.findIndex((s) => s.key === key);
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
    paddingBottom: 24,
  },
  header: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    backgroundColor: 'transparent',
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
  },
  headerSub: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  trackingCard: {
    marginHorizontal: 20,
    marginTop: -16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 20,
  },
  stagesContainer: {
    backgroundColor: 'transparent',
    gap: 0,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  stageIconContainer: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: 40,
  },
  stageIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  stageIconActive: {
    backgroundColor: '#0a7ea4',
    shadowColor: '#0a7ea4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 4,
  },
  stageIconCompleted: {
    backgroundColor: '#10b981',
  },
  stageEmoji: {
    fontSize: 16,
  },
  stageLine: {
    width: 2,
    flex: 1,
    minHeight: 28,
    backgroundColor: '#e2e8f0',
  },
  stageLineActive: {
    backgroundColor: '#0a7ea4',
  },
  stageLabel: {
    fontSize: 15,
    color: '#94a3b8',
    marginLeft: 12,
    marginTop: 8,
  },
  stageLabelActive: {
    color: '#0a7ea4',
    fontWeight: '700',
  },
  stageLabelCompleted: {
    color: '#10b981',
    fontWeight: '600',
  },
  activeBadge: {
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 8,
    marginTop: 6,
  },
  activeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0a7ea4',
  },
  infoCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  infoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: 'transparent',
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  primaryButton: {
    backgroundColor: '#0a7ea4',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
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
