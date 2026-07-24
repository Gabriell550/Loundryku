import { api } from './api';
import type { ReportData, ApiResponse } from '../types';

export const reportService = {
  daily: () => api.get<ReportData>('/api/reports/daily'),
  weekly: () => api.get<ReportData>('/api/reports/weekly'),
  monthly: () => api.get<ReportData>('/api/reports/monthly'),
};