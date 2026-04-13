import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/cn';
import { Logo } from './Logo';
import { navigationGroups, type NavigationItem } from './navigation';

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
  compact: boolean;
  onToggleCompact: () => void;
}

function matchesAccess(
  item: NavigationItem,
  canAccessModule: (...keys: string[]) => boolean,
  canAccessPermission: (...keys: string[]) => boolean,
  role?: string,
) {
  const hasRole = !item.roles?.length || item.roles.includes(role ?? '');
  const hasModule = !item.modules?.length || canAccessModule(...item.modules);
  const hasPermission = !item.permissions?.length || canAccessPermission(...item.permissions);
  return hasRole && hasModule && hasPermission;
}

export function Sidebar({ mobileOpen, onClose, compact, onToggleCompact }: SidebarProps) {
  const { user, canAccessModule, canAccessPermission } = useAuth();

  const visibleGroups = useMemo(
    () =>
      navigationGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => matchesAccess(item, canAccessModule, canAccessPermission, user?.role)),
        }))
        .filter((group) => group.items.length > 0),
    [canAccessModule, canAccessPermission, user?.role],
  );

  const content = (
    <div className='flex h-full flex-col px-4 py-5'>
      <div className='flex items-center justify-between gap-3 pb-8'>
        <Logo compact={compact} />
        <button
          type='button'
          onClick={onClose}
          className='inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 lg:hidden'
          aria-label='Fechar menu'
        >
          <X size={16} />
        </button>
      </div>

      <div className='min-h-0 flex-1 overflow-y-auto'>
        <div className='space-y-6'>
          {visibleGroups.map((group) => (
            <section key={group.label}>
              <p className={cn('mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400', compact && 'sr-only')}>
                {group.label}
              </p>

              <div className='space-y-1'>
                {group.items.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to ?? '/'}
                    onClick={onClose}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'flex min-h-[40px] items-center rounded-xl px-3 text-sm transition',
                        compact ? 'justify-center' : 'gap-3',
                        isActive
                          ? 'bg-[#121826] text-white'
                          : 'text-slate-600 hover:bg-white hover:text-slate-900',
                      )
                    }
                    title={compact ? item.label : undefined}
                  >
                    <item.icon size={17} className='shrink-0' />
                    <span className={compact ? 'hidden' : 'truncate'}>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className='hidden pt-4 lg:block'>
        <button
          type='button'
          onClick={onToggleCompact}
          className='inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-900'
        >
          {compact ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          <span className={compact ? 'hidden' : 'inline'}>{compact ? 'Expandir' : 'Recolher menu'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200/80 bg-[rgba(247,247,243,0.94)] backdrop-blur-xl lg:block',
          compact ? 'w-[84px]' : 'w-[248px]',
        )}
      >
        {content}
      </aside>

      <div
        className={cn('fixed inset-0 z-40 bg-slate-950/20 transition lg:hidden', mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0')}
        onClick={onClose}
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[248px] border-r border-slate-200 bg-[rgba(247,247,243,0.98)] backdrop-blur-xl transition-transform lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {content}
      </aside>
    </>
  );
}
