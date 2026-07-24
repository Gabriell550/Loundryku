import { api } from './api';
import type { ApiResponse, DashboardData } from '../types';

export const dashboardService = {
  get: () => api.get<DashboardData>('/api/dashboard'),
};