import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { tokenStore } from './tokens';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/';

let isRefreshing = false;
let waitingQueue: Array<() => void> = [];

const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

const handleQueue = () => {
  waitingQueue.forEach((cb) => cb());
  waitingQueue = [];
};

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const method = config.method?.toUpperCase();
  const csrf = getCookie('csrftoken');
  const access = tokenStore.getAccess();

  if (access) {
    config.headers.set('Authorization', `Bearer ${access}`);
  }

  if (csrf && method && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    config.headers.set('X-CSRFToken', csrf);
  }

  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (!original || original._retry || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (original.url?.includes('/api/auth/refresh/')) {
      tokenStore.clear();
      return Promise.reject(error);
    }

    const refresh = tokenStore.getRefresh();
    if (!refresh) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      await new Promise<void>((resolve) => waitingQueue.push(resolve));
      return http(original);
    }

    isRefreshing = true;
    try {
      const { data } = await http.post<{ access?: string; refresh?: string }>('/api/auth/refresh/', { refresh });
      tokenStore.setTokens({ access: data?.access, refresh: data?.refresh ?? refresh });
      handleQueue();
      return http(original);
    } catch (refreshError) {
      tokenStore.clear();
      waitingQueue = [];
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);



