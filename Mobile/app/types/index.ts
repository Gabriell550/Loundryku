export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'ADMIN' | 'KASIR';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  type?: string;
}

export interface ServiceType {
  id: string;
  name: string;
  processing: string;
  weight: string;
  estimation: string;
  price: number;
}

export interface OrderItem {
  serviceTypeId: string;
  serviceTypeName: string;
  processing: string;
  qty: number;
  weight?: string;
  estimation: string;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  totalPrice: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'DITERIMA' | 'DIPROSES' | 'SELESAI' | 'DIAMBIL' | 'DIBATALKAN';
export type PaymentStatus = 'BELUM_LUNAS' | 'LUNAS';

export interface DashboardData {
  totalOrderToday: number;
  revenueToday: number;
  totalCustomers: number;
  recentOrders: Order[];
}

export interface ReportData {
  period: string;
  startDate: string;
  endDate: string;
  totalOrders: number;
  totalRevenue: number;
  orders: Order[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}