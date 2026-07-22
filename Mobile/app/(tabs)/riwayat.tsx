import { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StatusBar } from 'expo-status-bar';

const orders = [
  {
    id: '#ORD-001',
    date: '20 Jul 2026',
    service: 'Reguler',
    weight: '2.5 kg',
    total: 'Rp 25.000',
  },
  {
    id: '#ORD-002',
    date: '18 Jul 2026',
    service: 'Express',
    weight: '1.8 kg',
    total: 'Rp 27.000',
  },
  {
    id: '#ORD-003',
    date: '15 Jul 2026',
    service: 'Super Express',
    weight: '3.2 kg',
    total: 'Rp 64.000',
  },
];

export default function RiwayatScreen() {
  const [selectedOrder, setSelectedOrder] = useState<(typeof orders)[0] | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>Riwayat Transaksi</ThemedText>
      </ThemedView>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {orders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={styles.orderCard}
            activeOpacity={0.7}
            onPress={() => setSelectedOrder(order)}
          >
            <ThemedView style={styles.orderHeader}>
              <ThemedText style={styles.orderId}>{order.id}</ThemedText>
              <ThemedText style={styles.orderDate}>{order.date}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.orderBody}>
              <ThemedView style={styles.orderDetail}>
                <ThemedText style={styles.detailLabel}>Layanan</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {order.service}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.orderDetail}>
                <ThemedText style={styles.detailLabel}>Berat</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {order.weight}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.orderDetail}>
                <ThemedText style={styles.detailLabel}>Total</ThemedText>
                <ThemedText style={styles.detailValueTotal}>
                  {order.total}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={!!selectedOrder}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText style={styles.modalTitle}>Detail Transaksi</ThemedText>

            {selectedOrder && (
              <>
                <ThemedView style={styles.modalRow}>
                  <ThemedText style={styles.modalLabel}>
                    No. Pesanan
                  </ThemedText>
                  <ThemedText style={styles.modalValue}>
                    {selectedOrder.id}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.modalRow}>
                  <ThemedText style={styles.modalLabel}>Tanggal</ThemedText>
                  <ThemedText style={styles.modalValue}>
                    {selectedOrder.date}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.modalRow}>
                  <ThemedText style={styles.modalLabel}>Layanan</ThemedText>
                  <ThemedText style={styles.modalValue}>
                    {selectedOrder.service}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.modalRow}>
                  <ThemedText style={styles.modalLabel}>Berat</ThemedText>
                  <ThemedText style={styles.modalValue}>
                    {selectedOrder.weight}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.modalRow}>
                  <ThemedText style={styles.modalLabel}>Biaya Layanan</ThemedText>
                  <ThemedText style={styles.modalValue}>
                    Rp 5.000
                  </ThemedText>
                </ThemedView>
                <ThemedView style={[styles.modalRow, styles.modalRowTotal]}>
                  <ThemedText style={styles.modalLabelTotal}>
                    Total Pembayaran
                  </ThemedText>
                  <ThemedText style={styles.modalValueTotal}>
                    {selectedOrder.total}
                  </ThemedText>
                </ThemedView>

                <TouchableOpacity style={styles.qrisButton} activeOpacity={0.8}>
                  <ThemedText style={styles.qrisButtonText}>
                    Tampilkan QRIS
                  </ThemedText>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              activeOpacity={0.7}
              onPress={() => setSelectedOrder(null)}
            >
              <ThemedText style={styles.closeButtonText}>Tutup</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </View>
      </Modal>
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
    gap: 12,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  orderId: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0a7ea4',
  },
  orderDate: {
    fontSize: 13,
    color: '#94a3b8',
  },
  orderBody: {
    gap: 6,
    backgroundColor: 'transparent',
  },
  orderDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  detailValueTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0a7ea4',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: 'transparent',
  },
  modalRowTotal: {
    borderBottomWidth: 0,
    marginTop: 4,
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 10,
  },
  modalLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  modalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalLabelTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalValueTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0a7ea4',
  },
  qrisButton: {
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  qrisButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  closeButtonText: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '600',
  },
});
