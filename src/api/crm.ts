import { http } from './http';
import type { ApiListResponse } from '../types/api';

export type OpportunityStatus = 'OPEN' | 'WON' | 'LOST' | 'CANCELED';
export type ActivityType = 'NOTE' | 'CALL' | 'MEETING' | 'EMAIL' | 'FOLLOW_UP';

export interface PipelineStage {
  id: number;
  pipeline: number;
  pipeline_name: string;
  name: string;
  stage_order: number;
  probability?: number;
  is_closed_won?: boolean;
  is_closed_lost?: boolean;
  is_active?: boolean;
}

export interface Pipeline {
  id: number;
  name: string;
  description?: string;
  is_default?: boolean;
  is_active?: boolean;
  stages: PipelineStage[];
}

export interface Opportunity {
  id: number;
  lead?: number;
  lead_company_name?: string;
  pipeline: number;
  pipeline_name?: string;
  stage: number;
  stage_name?: string;
  title: string;
  status: OpportunityStatus;
  estimated_value?: string | null;
  currency?: string;
  expected_close_date?: string | null;
  loss_reason?: string;
  notes?: string;
  owner?: number | null;
  owner_email?: string;
  converted_client?: number | null;
  converted_client_name?: string;
  converted_briefing?: number | null;
  converted_briefing_title?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CommercialActivity {
  id: number;
  opportunity: number;
  activity_type: ActivityType;
  subject: string;
  description?: string;
  due_at?: string | null;
  completed_at?: string | null;
  created_by?: number | null;
  created_by_email?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ConvertOpportunityPayload {
  client_legal_name?: string;
  client_trade_name?: string;
  billing_email?: string;
  briefing_title?: string;
  briefing_objective_summary?: string;
}

export interface OpportunityFilters {
  page?: number;
  page_size?: number;
  pipeline?: number;
  stage?: number;
  status?: OpportunityStatus | '';
}

export const crmApi = {
  listPipelines: async (): Promise<Pipeline[]> => {
    const { data } = await http.get<ApiListResponse<Pipeline> | Pipeline[]>('/api/crm/pipelines/');
    return Array.isArray(data) ? data : data.results ?? [];
  },

  listOpportunities: async (params?: OpportunityFilters): Promise<ApiListResponse<Opportunity>> => {
    const { data } = await http.get<ApiListResponse<Opportunity>>('/api/crm/opportunities/', { params });
    return data;
  },

  listActivities: async (params?: { opportunity?: number; page_size?: number }): Promise<ApiListResponse<CommercialActivity>> => {
    const { data } = await http.get<ApiListResponse<CommercialActivity>>('/api/crm/activities/', { params });
    return data;
  },

  createActivity: async (payload: {
    opportunity: number;
    activity_type: ActivityType;
    subject: string;
    description?: string;
    due_at?: string;
  }): Promise<CommercialActivity> => {
    const { data } = await http.post<CommercialActivity>('/api/crm/activities/', payload);
    return data;
  },

  convertOpportunity: async (id: number, payload: ConvertOpportunityPayload): Promise<unknown> => {
    const { data } = await http.post(`/api/crm/opportunities/${id}/convert-to-client/`, payload);
    return data;
  },
};
