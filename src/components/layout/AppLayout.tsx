import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    setCompact(window.localStorage.getItem('jaq:sidebar:compact') === '1');
  }, []);

  useEffect(() => {
    window.localStorage.setItem('jaq:sidebar:compact', compact ? '1' : '0');
  }, [compact]);

  return (
    <div className='min-h-screen bg-app text-slate-900'>
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        compact={compact}
        onToggleCompact={() => setCompact((current) => !current)}
      />

      <div className={compact ? 'lg:pl-[84px]' : 'lg:pl-[248px]'}>
        <Header onToggleSidebar={() => setMobileOpen(true)} />
        <main className='px-4 py-5 lg:px-8 lg:py-6'>
          <div className='mx-auto w-full max-w-[1480px] app-enter'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
