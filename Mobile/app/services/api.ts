import API_BASE_URL from '../../constants/api';
import * as SecureStore from 'expo-secure-store';

let isRedirecting = false;

async function handleAuthError() {
  if (isRedirecting) return;
  isRedirecting = true;
  await SecureStore.deleteItemAsync('userToken');
  const { router } = await import('expo-router');
  router.replace('/(auth)/login');
}

async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync('userToken');
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<{ success: boolean; message: string; data: T }> {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      await handleAuthError();
      throw new Error('Sesi telah berakhir. Silakan login ulang.');
    }
    let json: any;
    try {
      json = await res.json();
    } catch {
      throw new Error(res.statusText || 'Terjadi kesalahan');
    }
    throw new Error(json?.message || 'Terjadi kesalahan');
  }

  let json: any;
  try {
    json = await res.json();
  } catch {
    throw new Error(res.statusText || 'Gagal memproses respons server');
  }

  return json;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => request<T>('PUT', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};