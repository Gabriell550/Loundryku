import { api } from './api';
import type { Order, ApiResponse } from '../types';

export const paymentService = {
  process: (data: { orderId: string; amount: number; method: string }) =>
    api.post<Order>('/api/payments', data),
};