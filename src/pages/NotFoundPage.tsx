import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className='grid min-h-screen place-items-center p-6'>
      <div className='panel max-w-md p-8 text-center'>
        <p className='text-xs font-semibold uppercase tracking-wider text-brand-600'>Erro 404</p>
        <h1 className='mt-2 text-2xl font-semibold text-slate-900'>Página não encontrada</h1>
        <p className='mt-2 text-sm text-slate-500'>A rota acessada não existe no frontend atual.</p>
        <Link
          to='/'
          className='mt-6 inline-flex rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600'
        >
          Ir para Home
        </Link>
      </div>
    </div>
  );
}


