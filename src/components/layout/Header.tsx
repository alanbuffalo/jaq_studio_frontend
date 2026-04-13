import { Bell, Menu, Search } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { user, signOut, canAccessModule } = useAuth();

  const initials = useMemo(() => {
    const source = `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim() || user?.email || 'JAQ';
    return source
      .split(' ')
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('');
  }, [user?.email, user?.first_name, user?.last_name]);

  return (
    <header className='sticky top-0 z-30 border-b border-slate-200/80 bg-[rgba(247,247,243,0.82)] backdrop-blur-xl'>
      <div className='mx-auto flex min-h-[64px] max-w-[1600px] items-center gap-3 px-4 lg:px-8'>
        <button
          type='button'
          onClick={onToggleSidebar}
          className='inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 lg:hidden'
          aria-label='Abrir menu'
        >
          <Menu size={18} />
        </button>

        <div className='hidden min-w-0 flex-1 lg:flex'>
          <label className='relative w-full max-w-md'>
            <Search className='pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400' />
            <input
              type='text'
              placeholder='Buscar'
              className='field-input h-10 rounded-full bg-white/85 pl-10 pr-4'
            />
          </label>
        </div>

        <div className='ml-auto flex items-center gap-2'>
          {canAccessModule('notifications') ? (
            <Link
              to='/notificacoes'
              className='relative inline-flex size-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300'
              aria-label='Notificações'
            >
              <Bell size={17} />
              <span className='absolute right-2.5 top-2.5 size-1.5 rounded-full bg-[#b9817f]' />
            </Link>
          ) : null}

          <Link
            to='/perfil'
            className='inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-3 transition hover:border-slate-300'
          >
            <span className='grid size-8 place-items-center rounded-full bg-[#121826] text-[11px] font-semibold text-white'>{initials}</span>
            <span className='hidden min-w-0 sm:block'>
              <span className='block truncate text-sm font-medium text-slate-900'>
                {user?.full_name || user?.name || user?.first_name || user?.email}
              </span>
            </span>
          </Link>

          <button
            type='button'
            onClick={() => void signOut()}
            className='hidden rounded-full px-3 py-2 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-slate-900 lg:inline-flex'
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
