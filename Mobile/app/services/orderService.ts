import { api } from './api';
import type { Order, ServiceType, ApiResponse } from '../types';

export const orderService = {
  getAll: () => api.get<Order[]>('/api/orders'),
  search: (q: string) => api.get<Order[]>(`/api/orders/search?q=${encodeURIComponent(q)}`),
  getById: (id: string) => api.get<Order>(`/api/orders/${id}`),
  getByInvoice: (invoice: string) => api.get<Order>(`/api/orders/by-invoice/${encodeURIComponent(invoice)}`),
  create: (data: { customerId: string; items: { serviceTypeId: string; qty: number }[] }) =>
    api.post<Order>('/api/orders', data),
  updateStatus: (id: string, status: string) =>
    api.patch<Order>(`/api/orders/${id}/status`, { status }),
  delete: (id: string) => api.delete<null>(`/api/orders/${id}`),
};

export const serviceTypeService = {
  getAll: () => api.get<ServiceType[]>('/api/service-types'),
};