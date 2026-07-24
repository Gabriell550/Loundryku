import { api } from './api';
import type { Customer, ApiResponse } from '../types';

export const customerService = {
  getAll: () => api.get<Customer[]>('/api/customers'),
  search: (q: string) => api.get<Customer[]>(`/api/customers/search?q=${encodeURIComponent(q)}`),
  getById: (id: string) => api.get<Customer>(`/api/customers/${id}`),
  create: (data: { name: string; phone: string; address?: string; type: string }) =>
    api.post<Customer>('/api/customers', data),
  update: (id: string, data: { name: string; phone: string; address?: string; type: string }) =>
    api.put<Customer>(`/api/customers/${id}`, data),
  delete: (id: string) => api.delete<null>(`/api/customers/${id}`),
};