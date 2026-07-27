export type ReportPeriod = 'daily' | 'weekly' | 'monthly';

export interface Transaction {
  invoiceNumber: string;
  customerName: string;
  transactionDate: string; // ISO string (e.g., "2026-07-26T10:00:00Z")
  totalPrice: number;
  orderStatus: 'DITERIMA' | 'DIPROSES' | 'SELESAI' | 'DIAMBIL' | 'DIBATALKAN';
  paymentStatus: 'BELUM_LUNAS' | 'LUNAS';
}

export interface ReportData {
  totalTransaction: number;
  totalRevenue: number;
  completedOrder: number;
  processingOrder: number;
  paidOrder: number;
  unpaidOrder: number;
  transactions: Transaction[];
  // Assuming 'services' data for chart will be an array of objects
  // each containing a label (e.g., day of week) and a value
  services: { name: string; value: number }[];
  // Add other chart-related data if specified, e.g., daily revenue values
  dailyRevenue: { day: string; value: number }[]; // For RevenueChart
}

export interface ReportServiceResponse {
    success: boolean;
    message: string;
    data: ReportData;
}
