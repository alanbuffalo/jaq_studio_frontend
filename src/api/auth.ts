import { http } from './http';
import { tokenStore } from './tokens';
import type { LoginPayload, LoginResponse, User } from '../types/auth';

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

  updateMe: async (payload: Record<string, unknown>): Promise<User> => {
    const { data } = await http.patch<User>('/api/auth/me/', payload);
    return data;
  },

  updateMyPhoto: async (photo_bytes: string | null): Promise<User> => {
    const { data } = await http.patch<User>('/api/auth/me/photo/', { photo_bytes });
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
      // Endpoint opcional: se não existir, apenas segue limpando estado local
    }
    tokenStore.clear();
  },
};




