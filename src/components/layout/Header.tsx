import { ChevronDown, LogOut, Menu, Settings, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function UserMenu() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const displayName =
    user?.full_name || user?.name || `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim() || 'Usuário';

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className='relative' ref={wrapperRef}>
      <button
        onClick={() => setOpen((value) => !value)}
        className='flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-slate-300'
      >
        {user?.photo_bytes ? (
          <img src={`data:image/jpeg;base64,${user.photo_bytes}`} className='h-10 w-10 rounded-full object-cover' />
        ) : (
          <div className='grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700'>
            {initials(displayName)}
          </div>
        )}
        <div className='hidden text-left md:block'>
          <p className='text-sm font-medium text-slate-900'>{displayName}</p>
          <p className='text-xs text-slate-500'>{user?.email}</p>
        </div>
        <ChevronDown size={16} className={`text-slate-500 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open ? (
        <div className='absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl'>
          <div className='border-b border-slate-100 px-4 py-3'>
            <p className='text-sm font-semibold text-slate-900'>{displayName}</p>
            <p className='text-xs text-slate-500'>{user?.role}</p>
          </div>
          <nav className='p-2'>
            <Link
              to='/perfil'
              className='flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100'
              onClick={() => setOpen(false)}
            >
              <UserRound size={16} />
              Meu Perfil
            </Link>
            <Link
              to='/configuracoes/agencia'
              className='flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100'
              onClick={() => setOpen(false)}
            >
              <Settings size={16} />
              Configurações
            </Link>
            <button
              onClick={handleSignOut}
              className='flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 transition hover:bg-rose-50'
            >
              <LogOut size={16} />
              Sair
            </button>
          </nav>
        </div>
      ) : null}
    </div>
  );
}

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className='sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-6'>
      <div className='flex items-center justify-between gap-3'>
        <button
          onClick={onToggleSidebar}
          className='grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-slate-600 lg:hidden'
        >
          <Menu size={18} />
        </button>
        <div className='hidden md:block'>
          <h1 className='text-base font-semibold text-slate-900'>Painel Administrativo</h1>
          <p className='text-xs text-slate-500'>Visual TailAdmin com integração Django JWT</p>
        </div>
        <UserMenu />
      </div>
    </header>
  );
}


