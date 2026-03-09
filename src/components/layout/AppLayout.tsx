import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../../hooks/useAuth';

export function AppLayout() {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className='flex min-h-screen'>
      <Sidebar role={user?.role} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className='flex min-w-0 flex-1 flex-col'>
        <Header onToggleSidebar={() => setMobileOpen(true)} />
        <main className='flex-1 px-4 py-6 lg:px-6'>
          <div className='mx-auto w-full max-w-7xl'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

