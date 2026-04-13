import { http } from './http';

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Briefing {
  id: number;
  client: number;
  client_name: string;
  brand: number | null;
  brand_name: string;
  template: number | null;
  template_name: string;
  status: string;
  title: string;
  project_type: string;
  objective_summary: string;
  priority: string;
  requested_start_date: string | null;
  requested_end_date: string | null;
  budget_range: string;
  created_by_name: string;
  approved_by_name: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BriefingAnalysis {
  id: number;
  briefing: number;
  status: 'DRAFT' | 'COMPLETED' | 'APPROVED';
  recommended_scope: string;
  recommended_deliverables: string;
  excluded_deliverables: string;
  assumptions: string;
  risks: string;
  suggested_billing_model: string;
  suggested_monthly_value: string | null;
  suggested_start_date: string | null;
  suggested_end_date: string | null;
  commercial_notes: string;
  reviewed_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface ContractDraft {
  id: number;
  briefing: number;
  briefing_title: string;
  analysis: number | null;
  analysis_status: string;
  status: 'DRAFT' | 'REVIEWED' | 'APPROVED' | 'DISCARDED';
  title: string;
  code_suggestion: string;
  scope_summary: string;
  included_deliverables: string;
  excluded_deliverables: string;
  commercial_terms: string;
  generated_by_name: string;
  created_at: string;
  updated_at: string;
}

export interface BriefingDetail extends Briefing {
  analysis: BriefingAnalysis | null;
  contract_drafts: ContractDraft[];
}

export interface GenerateContractDraftPayload {
  title?: string;
  code_suggestion?: string;
}

export const briefingsApi = {
  async listBriefings(params?: Record<string, string | number | boolean>) {
    const { data } = await http.get<PaginatedResponse<Briefing>>('/briefings/briefings/', { params });
    return data;
  },

  async getBriefing(id: number) {
    const { data } = await http.get<BriefingDetail>(`/briefings/briefings/${id}/`);
    return data;
  },

  async generateContractDraft(id: number, payload: GenerateContractDraftPayload) {
    const { data } = await http.post<ContractDraft>(`/briefings/briefings/${id}/generate-contract-draft/`, payload);
    return data;
  },
};
