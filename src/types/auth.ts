export type Role = 'ADMIN' | 'ATENDIMENTO' | 'MIDIA' | 'FINANCEIRO' | 'DIRETOR';

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  full_name?: string;
  role: Role;
  is_active?: boolean;
  photo_bytes?: string | null;
  [key: string]: unknown;
}

export interface AccessMatrix {
  role: Role | string;
  permissions: Record<string, boolean>;
  modules: Record<string, boolean>;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  access?: string;
  refresh?: string;
  user?: User;
}

