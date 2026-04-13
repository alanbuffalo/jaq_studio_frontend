import {
  Bell,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  FileSpreadsheet,
  FolderKanban,
  Gauge,
  HandCoins,
  Receipt,
  Settings,
  ShieldCheck,
  SquareKanban,
  Target,
  Users,
  WalletCards,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavigationItem {
  label: string;
  to?: string;
  icon: LucideIcon;
  roles?: string[];
  modules?: string[];
  permissions?: string[];
  children?: NavigationItem[];
}

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}

export const navigationGroups: NavigationGroup[] = [
  {
    label: 'Visão Geral',
    items: [
      { label: 'Home', to: '/', icon: Gauge, modules: ['dashboard'] },
      { label: 'Notificações', to: '/notificacoes', icon: Bell, modules: ['notifications'] },
    ],
  },
  {
    label: 'Comercial',
    items: [
      { label: 'CRM', to: '/crm/oportunidades', icon: Target, modules: ['crm'] },
      { label: 'Clientes', to: '/clientes', icon: Building2, modules: ['clients'] },
      { label: 'Briefings', to: '/briefings', icon: ClipboardCheck, modules: ['briefings'] },
      { label: 'Contratos', to: '/contratos', icon: FileSpreadsheet, modules: ['contracts'] },
    ],
  },
  {
    label: 'Operação',
    items: [
      { label: 'Serviços', to: '/servicos', icon: BriefcaseBusiness, modules: ['services'] },
      { label: 'Projetos', to: '/projetos', icon: FolderKanban, modules: ['projects'] },
      { label: 'Jobs e Tasks', to: '/jobs', icon: SquareKanban, modules: ['projects', 'tasks'] },
      { label: 'Time Entries', to: '/time-entries', icon: Receipt, modules: ['time_entries', 'time-entries'] },
    ],
  },
  {
    label: 'Criativo',
    items: [
      { label: 'Arquivos e Assets', to: '/arquivos/assets', icon: WalletCards, modules: ['files'] },
      { label: 'Aprovações', to: '/arquivos/aprovacoes', icon: ShieldCheck, modules: ['files'] },
    ],
  },
  {
    label: 'Financeiro',
    items: [
      { label: 'Recebíveis', to: '/financeiro/recebiveis', icon: HandCoins, modules: ['finance'] },
      { label: 'Pagáveis', to: '/financeiro/pagaveis', icon: WalletCards, modules: ['finance'] },
      { label: 'Fornecedores', to: '/financeiro/fornecedores', icon: Users, modules: ['finance'] },
      { label: 'Relatórios', to: '/financeiro/relatorios', icon: Receipt, modules: ['finance'] },
    ],
  },
  {
    label: 'Administração',
    items: [
      { label: 'Usuários', to: '/configuracoes/usuarios', icon: Users, permissions: ['can_manage_users'] },
      { label: 'Agência', to: '/configuracoes/agencia', icon: Settings, roles: ['ADMIN', 'DIRETOR'] },
      { label: 'Auditoria', to: '/configuracoes/auditoria', icon: ShieldCheck, modules: ['audit'] },
    ],
  },
];
