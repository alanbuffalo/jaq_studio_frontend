import { http } from './http';
import type { User } from '../types/auth';
import type { ApiListResponse } from '../types/api';

export interface Agency {
  id?: number;
  legal_name?: string;
  name?: string;
  trade_name?: string;
  tax_id?: string;
  cnpj?: string;
  email?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  logo_bytes?: string | null;
  primary_color?: string;
  secondary_color?: string;
  tertiary_color?: string;
  quaternary_color?: string;
  address_line?: string;
  address_city?: string;
  address_state?: string;
  address_zip_code?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  [key: string]: unknown;
}

export interface CepAddress {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  ibge_code: string;
}

export interface StateOption {
  code: string;
  name: string;
}

export interface CityOption {
  name: string;
}

export interface HomePayload {
  message?: string;
  user?: User;
  permissions?: string[];
  [key: string]: unknown;
}

export interface UserInput {
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  is_active?: boolean;
  password?: string;
  photo_bytes?: string | null;
}

export const coreApi = {
  home: async (): Promise<HomePayload> => {
    const { data } = await http.get<HomePayload>('/api/home/');
    return data;
  },

  getAgency: async (): Promise<Agency> => {
    const { data } = await http.get<Agency>('/api/core/agency/');
    return data;
  },

  updateAgency: async (payload: Partial<Agency>): Promise<Agency> => {
    const { data } = await http.patch<Agency>('/api/core/agency/', payload);
    return data;
  },

  getAddressByCep: async (cep: string): Promise<CepAddress> => {
    const { data } = await http.get<CepAddress>(`/api/common/address/cep/${cep}/`);
    return data;
  },

  listStates: async (q?: string): Promise<StateOption[]> => {
    const { data } = await http.get<StateOption[]>('/api/common/address/states/', {
      params: q ? { q } : undefined,
    });
    return data;
  },

  listCities: async (state: string, q?: string): Promise<CityOption[]> => {
    const { data } = await http.get<CityOption[]>('/api/common/address/cities/', {
      params: q ? { state, q } : { state },
    });
    return data;
  },

  createUser: async (payload: UserInput): Promise<User> => {
    const { data } = await http.post<User>('/api/auth/register/', payload);
    return data;
  },

  listUsers: async (): Promise<User[]> => {
    const { data } = await http.get<User[] | ApiListResponse<User>>('/api/auth/users/');
    if (Array.isArray(data)) {
      return data;
    }
    return data.results ?? [];
  },

  getUser: async (id: string): Promise<User> => {
    const { data } = await http.get<User>(`/api/auth/users/${id}/`);
    return data;
  },

  updateUser: async (id: string, payload: Partial<UserInput>): Promise<User> => {
    const { data } = await http.patch<User>(`/api/auth/users/${id}/`, payload);
    return data;
  },
};




