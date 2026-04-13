import { http } from './http';
import type { ApiListResponse } from '../types/api';

export type ClientStatus = 'LEAD' | 'ACTIVE' | 'PAUSED' | 'CHURNED';
export type OnboardingStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export interface Client {
  id: number;
  legal_name: string;
  trade_name?: string;
  tax_id?: string;
  segment?: string;
  status?: ClientStatus;
  onboarding_status?: OnboardingStatus;
  service_notes?: string;
  billing_email?: string;
  phone?: string;
  website?: string;
  logo_url?: string;
  address_line?: string;
  address_city?: string;
  address_state?: string;
  address_zip_code?: string;
  is_active?: boolean;
  brands_count?: number;
  contacts_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ClientDetail extends Client {}

export interface Brand {
  id: number;
  client: number;
  client_name?: string;
  name: string;
  legal_name?: string;
  tax_id?: string;
  website?: string;
  cost_center_code?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Contact {
  id: number;
  client: number;
  client_name?: string;
  brand?: number | null;
  brand_name?: string;
  name: string;
  email: string;
  phone?: string;
  job_title?: string;
  department?: string;
  notes?: string;
  is_primary?: boolean;
  is_financial_contact?: boolean;
  is_approver?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const clientsApi = {
  listClients: async (params?: { page_size?: number }): Promise<ApiListResponse<Client>> => {
    const { data } = await http.get<ApiListResponse<Client>>('/api/clients/clients/', { params });
    return data;
  },

  getClient: async (id: number): Promise<ClientDetail> => {
    const { data } = await http.get<ClientDetail>(`/api/clients/clients/${id}/`);
    return data;
  },

  listBrands: async (params?: { page_size?: number }): Promise<ApiListResponse<Brand>> => {
    const { data } = await http.get<ApiListResponse<Brand>>('/api/clients/brands/', { params });
    return data;
  },

  listContacts: async (params?: { page_size?: number }): Promise<ApiListResponse<Contact>> => {
    const { data } = await http.get<ApiListResponse<Contact>>('/api/clients/contacts/', { params });
    return data;
  },
};
