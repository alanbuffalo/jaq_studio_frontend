import { http } from './http';
import { tokenStore } from './tokens';
import type { ApiListResponse } from '../types/api';
import type { AccessMatrix, LoginPayload, LoginResponse, User } from '../types/auth';

export const authApi = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await http.post<LoginResponse>('/api/auth/login/', payload);
    tokenStore.setTokens({ access: data.access, refresh: data.refresh });
    return data;
  },

  me: async (): Promise<User> => {
    const { data } = await http.get<User>('/api/auth/me/');
    return data;
  },

  access: async (): Promise<AccessMatrix> => {
    const { data } = await http.get<AccessMatrix>('/api/auth/access/');
    return data;
  },

  updateMe: async (payload: Record<string, unknown>): Promise<User> => {
    const { data } = await http.patch<User>('/api/auth/me/', payload);
    return data;
  },

  updateMyPhoto: async (photoBytes: string | null): Promise<User> => {
    const { data } = await http.patch<User>('/api/auth/me/photo/', { photo_bytes: photoBytes });
    return data;
  },

  refresh: async (): Promise<void> => {
    const refresh = tokenStore.getRefresh();
    await http.post('/api/auth/refresh/', refresh ? { refresh } : undefined);
  },

  logout: async (): Promise<void> => {
    try {
      await http.post('/api/auth/logout/');
    } catch {
      // Endpoint opcional: se não existir, apenas segue limpando estado local.
    }
    tokenStore.clear();
  },

  listUsers: async (): Promise<ApiListResponse<User>> => {
    const { data } = await http.get<ApiListResponse<User>>('/api/auth/users/');
    return data;
  },

  getUser: async (id: string | number): Promise<User> => {
    const { data } = await http.get<User>(`/api/auth/users/${id}/`);
    return data;
  },

  createUser: async (payload: Record<string, unknown>): Promise<User> => {
    const { data } = await http.post<User>('/api/auth/users/', payload);
    return data;
  },

  updateUser: async (id: string | number, payload: Record<string, unknown>): Promise<User> => {
    const { data } = await http.patch<User>(`/api/auth/users/${id}/`, payload);
    return data;
  },
};
