import { ArrowLeft, Building2, Home, Settings, UserCircle2, Users2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { Logo } from './Logo';

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
  roles?: Array<'ADMIN' | 'DIRETOR'>;
  end?: boolean;
  footer?: boolean;
}

const MAIN_LINKS: NavItem[] = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/perfil', label: 'Meu Perfil', icon: UserCircle2 },
  { to: '/configuracoes/agencia', label: 'Configurações', icon: Settings, roles: ['ADMIN', 'DIRETOR'], footer: true },
];

const SETTINGS_LINKS: NavItem[] = [
  { to: '/configuracoes/agencia', label: 'Agência', icon: Building2, roles: ['ADMIN', 'DIRETOR'] },
  { to: '/configuracoes/usuarios', label: 'Usuários', icon: Users2, roles: ['ADMIN', 'DIRETOR'] },
  { to: '/', label: 'Sair de Configurações', icon: ArrowLeft, roles: ['ADMIN', 'DIRETOR'], end: true, footer: true },
];

interface SidebarProps {
  role?: string;
  mobileOpen: boolean;
  onClose: () => void;
}

function canSee(item: NavItem, role?: string) {
  if (!item.roles) return true;
  return item.roles.includes(role as 'ADMIN' | 'DIRETOR');
}

function MinifyIcon({ compact }: { compact: boolean }) {
  return compact ? (
    <svg
      className='size-5 shrink-0'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <rect width='18' height='18' x='3' y='3' rx='2' />
      <path d='M15 3v18' />
      <path d='m8 9 3 3-3 3' />
    </svg>
  ) : (
    <svg
      className='size-5 shrink-0'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <rect width='18' height='18' x='3' y='3' rx='2' />
      <path d='M15 3v18' />
      <path d='m10 15-3-3 3-3' />
    </svg>
  );
}

function NavList({
  items,
  role,
  compact,
  currentPath,
  onNavigate,
}: {
  items: NavItem[];
  role?: string;
  compact: boolean;
  currentPath: string;
  onNavigate?: () => void;
}) {
  const visible = items.filter((item) => canSee(item, role));
  const primary = visible.filter((item) => !item.footer);
  const footer = visible.filter((item) => item.footer);

  const renderLink = (item: NavItem) => (
    <NavLink
      key={item.to + item.label}
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      title={compact ? item.label : undefined}
      aria-label={item.label}
      className={({ isActive }) => {
        const isSettingsShortcut = item.label === 'Configurações' && currentPath.startsWith('/configuracoes');
        const active = isActive || isSettingsShortcut;
        return cn(
          'min-h-[42px] rounded-xl text-sm font-medium transition-all duration-200',
          'flex items-center',
          compact ? 'justify-center px-2.5' : 'gap-3.5 px-3',
          active ? 'bg-brand-50 text-brand-600' : 'text-slate-600 hover:bg-slate-100',
        );
      }}
    >
      <item.icon size={20} />
      <span className={cn('truncate', compact ? 'hidden' : 'inline')}>{item.label}</span>
    </NavLink>
  );

  return (
    <nav className='flex h-full flex-col'>
      <div className='space-y-1'>{primary.map(renderLink)}</div>
      {footer.length ? <div className='mt-auto space-y-1 border-t border-slate-200 pt-3'>{footer.map(renderLink)}</div> : null}
    </nav>
  );
}

export function Sidebar({ role, mobileOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const [compact, setCompact] = useState(false);
  const isInSettings = location.pathname.startsWith('/configuracoes');

  useEffect(() => {
    const saved = window.localStorage.getItem('sidebar:compact');
    setCompact(saved === '1');
  }, []);

  useEffect(() => {
    window.localStorage.setItem('sidebar:compact', compact ? '1' : '0');
  }, [compact]);

  const visibleLinks = useMemo(() => (isInSettings ? SETTINGS_LINKS : MAIN_LINKS), [isInSettings]);

  return (
    <>
      <div className={cn('relative hidden h-screen shrink-0 lg:block', compact ? 'w-[86px]' : 'w-[272px]')}>
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-20 overflow-visible border-r border-slate-200 bg-white transition-all duration-300',
            compact ? 'w-[86px]' : 'w-[272px]',
          )}
        >
          <div className='flex h-full max-h-full flex-col p-3'>
            <header className={cn('flex items-center px-1 pb-4 pt-2', compact ? 'justify-center' : '')}>
              <Logo compact={compact} />
            </header>

            <div className='min-h-0 flex-1 overflow-y-auto px-1 pb-2'>
              <NavList items={visibleLinks} role={role} compact={compact} currentPath={location.pathname} />
            </div>
          </div>
        </aside>

        <button
          type='button'
          onClick={() => setCompact((prev) => !prev)}
          className={cn(
            'fixed top-16 z-50 hidden size-10 -translate-x-1/2 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-600 shadow-md transition-transform duration-150 hover:-translate-y-0.5 active:translate-y-0.5 lg:inline-flex',
            compact ? 'left-[86px]' : 'left-[272px]',
          )}
          aria-label='Minificar navegação'
          title={compact ? 'Expandir menu' : 'Compactar menu'}
        >
          <MinifyIcon compact={compact} />
        </button>
      </div>

      {mobileOpen ? (
        <div className='fixed inset-0 z-40 bg-slate-900/50 lg:hidden' onClick={onClose} aria-hidden='true'>
          <aside className='h-full w-64 bg-white' onClick={(event) => event.stopPropagation()}>
            <div className='flex h-full max-h-full flex-col p-3'>
              <header className='flex items-center justify-between px-1 pb-4 pt-2'>
                <Logo />
                <button
                  type='button'
                  onClick={onClose}
                  className='inline-flex size-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100'
                  aria-label='Fechar menu'
                >
                  <X size={14} />
                </button>
              </header>

              <div className='min-h-0 flex-1 overflow-y-auto px-1 pb-2'>
                <NavList
                  items={visibleLinks}
                  role={role}
                  compact={false}
                  currentPath={location.pathname}
                  onNavigate={onClose}
                />
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

