import { useQuery } from '@tanstack/react-query';
import { Platform } from 'react-native'; // <-- Tambahkan import ini
import API_BASE_URL from '../constants/api';
import { ReportServiceResponse, ReportPeriod, ReportData } from '../types/report';
import * as SecureStore from 'expo-secure-store';

const REPORT_QUERY_KEY = 'reportData';

const fetchReport = async (period: ReportPeriod): Promise<ReportData> => {
  let userToken: string | null = null;

  // Cek environment: Gunakan localStorage untuk Web, SecureStore untuk Mobile
  if (Platform.OS === 'web') {
    userToken = localStorage.getItem('userToken');
  } else {
    userToken = await SecureStore.getItemAsync('userToken');
  }

  if (!userToken) {
    throw new Error('User not authenticated.');
  }

  const response = await fetch(`${API_BASE_URL}/api/reports/${period}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Failed to fetch ${period} report`);
  }

  const result: ReportServiceResponse = await response.json();
  if (!result.success) {
    throw new Error(result.message || `Failed to fetch ${period} report`);
  }
  return result.data;
};

export const useReport = (period: ReportPeriod) => {
  return useQuery<ReportData, Error>({
    queryKey: [REPORT_QUERY_KEY, period],
    queryFn: () => fetchReport(period),
  });
};