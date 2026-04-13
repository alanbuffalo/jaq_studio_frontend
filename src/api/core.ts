import { http } from './http';
import type { ApiListResponse } from '../types/api';
import type { User } from '../types/auth';

export interface AgencySettings {
  id?: number;
  legal_name?: string;
  trade_name?: string;
  tax_id?: string;
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
  timezone?: string;
  currency?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  bank_name?: string;
  bank_branch?: string;
  bank_account?: string;
  pix_key?: string;
  [key: string]: unknown;
}

export type Agency = AgencySettings;

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
  getAgency: async (): Promise<AgencySettings> => {
    const { data } = await http.get<AgencySettings>('/api/core/agency/');
    return data;
  },

  updateAgency: async (payload: Partial<AgencySettings>): Promise<AgencySettings> => {
    const { data } = await http.patch<AgencySettings>('/api/core/agency/', payload);
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

  listUsers: async (): Promise<User[]> => {
    const { data } = await http.get<ApiListResponse<User>>('/api/auth/users/');
    return data.results ?? [];
  },

  getUser: async (id: string): Promise<User> => {
    const { data } = await http.get<User>(`/api/auth/users/${id}/`);
    return data;
  },

  createUser: async (payload: UserInput): Promise<User> => {
    const { data } = await http.post<User>('/api/auth/users/', payload);
    return data;
  },

  updateUser: async (id: string, payload: Partial<UserInput>): Promise<User> => {
    const { data } = await http.patch<User>(`/api/auth/users/${id}/`, payload);
    return data;
  },
};
