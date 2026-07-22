import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Table, Row } from 'react-native-table-component';

export default function UserManagement() {
  const tableHead = ["ID", "Nama", "Email", "Aksi"];
  const tableData = [
    { id: "1", nama: "gabriel", email: "gabe@email.com" },
    { id: "2", nama: "agy", email: "agy@gmail.com" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Management</Text>

      <Table borderStyle={{ borderWidth: 1, borderColor: "#333333" }}>
        {/* Header */}
        <Row
          data={tableHead}
          style={styles.head}
          textStyle={styles.headText}
        />

        {/* Body - dibikin manual biar bisa isi tombol */}
        {tableData.map((item, index) => (
          <View key={item.id} style={styles.row}>
            <Text style={[styles.cell, styles.cellText]}>{item.id}</Text>
            <Text style={[styles.cell, styles.cellText]}>{item.nama}</Text>
            <Text style={[styles.cell, styles.cellText]}>{item.email}</Text>

            <View style={[styles.cell, styles.actionCell]}>
              <TouchableOpacity style={styles.editButton}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.buttonText}>Hapus</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </Table>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  head: {
    height: 40,
    backgroundColor: "#f1f8ff",
  },
  headText: {
    margin: 6,
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#333333",
    alignItems: "center",
    minHeight: 44,
  },
  cell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    textAlign: "center",
  },
  actionCell: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  editButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
});