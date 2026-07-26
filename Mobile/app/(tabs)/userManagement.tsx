import { View, Text, StyleSheet,TouchableOpacity} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
// import { Table, Row } from 'react-native-table-component'; // Not used with custom table implementation
import GlassCard from '../../components/ui/GlassCard';
import PillButton from '../../components/ui/PillButton';
import { colors, spacing, typography, radius } from '../../constants/theme';


export default function UserManagement() {
  const tableHead = ["ID", "Nama", "Email", "Aksi"];
  const tableData = [
    { id: "1", nama: "gabriel", email: "gabe@email.com" },
    { id: "2", nama: "agy", email: "agy@gmail.com" },
  ];
    const columnFlex = [0.5, 1, 1, 1.5]; // Porsi untuk ID, Nama, Email, Aksi
  return (
    <SafeAreaView style={styles.safeArea}>
      <GlassCard style={styles.card}>
        <Text style={styles.title}>User Management</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            {tableHead.map((header, index) => (
              <Text key={index} style={styles.tableHeaderText}>{header}</Text>
            ))}
          </View>
          {tableData.map((item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.id}</Text>
              <Text style={styles.tableCell}>{item.nama}</Text>
              <Text style={styles.tableCell}>{item.email}</Text>
              <View style={[styles.actionButtons, { flex: 1.5 }]}>
                <TouchableOpacity
    style={styles.editButton}
    onPress={() => console.log('Edit', item.id)}
  >
    <Text style={styles.buttonText}>Edit</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.deleteButton}
    onPress={() => console.log('Delete', item.id)}
  >
    <Text style={styles.buttonText}>Hapus</Text>
  </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </GlassCard>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  card: {
    margin: spacing.containerPadding,
    padding: spacing.containerPadding,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  title: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing.stackMd,
    textAlign: 'center',
  },
  tableContainer: {
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing.stackSm,
  },
  tableHeaderText: {
    ...typography.labelMd,
    color: colors.onPrimary,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: spacing.stackSm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
  },
  tableCell: {
    ...typography.bodyMd,
    color: colors.onSurface,
    textAlign: 'center',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    // flex: 1, // <- Hapus ini dari StyleSheet karena sudah di-override di JSX { flex: 1.5 }
    gap: 4, // Perkecil gap sedikit agar lebih aman di layar sempit
  },
  editButton: {
    height: 30,
    flex: 1, // <-- Ganti width: 60 jadi flex: 1
    backgroundColor: colors.success,
    paddingVertical: spacing.unit / 2,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    height: 30,
    flex: 1, // <-- Ganti width: 60 jadi flex: 1
    backgroundColor: colors.error,
    paddingVertical: spacing.unit / 2,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    ...typography.labelSm,
    color: colors.onPrimary,
    fontWeight: '600',
    fontSize: 10, // <-- Perkecil font sedikit agar teks 'Hapus' gak terpotong
  },
});