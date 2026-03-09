import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';

export function LoginPage() {
  const { signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn({ email, password });
      navigate(from, { replace: true });
    } catch {
      setError('Não foi possível autenticar. Verifique seu e-mail e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='grid min-h-screen grid-cols-1 bg-[#f2f5fb] lg:grid-cols-2'>
      <section className='hidden bg-brand-600 p-12 text-white lg:flex lg:flex-col lg:justify-between'>
        <div className='max-w-md'>
          <p className='mb-4 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold'>JAQ Studio</p>
          <h1 className='text-4xl font-bold leading-tight'>
            Gestão criativa para equipes de alto desempenho
          </h1>
          <p className='mt-4 text-brand-100'>
            Painel premium com visual TailAdmin, fluxo rápido e experiência limpa para operação diária.
          </p>
        </div>
        <p className='text-sm text-brand-100'>Versão inicial - Frontend completo integrado ao Django API</p>
      </section>

      <section className='grid place-items-center p-5'>
        <div className='panel w-full max-w-md p-8'>
          <h2 className='text-2xl font-semibold text-slate-900'>Entrar</h2>
          <p className='mt-1 text-sm text-slate-500'>Acesse o sistema com suas credenciais.</p>

          <form className='mt-6 space-y-4' onSubmit={handleSubmit}>
            <Input
              label='E-mail'
              type='email'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder='voce@empresa.com'
            />
            <Input
              label='Senha'
              type='password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder='Sua senha'
            />
            {error ? <p className='text-sm text-rose-500'>{error}</p> : null}
            <Button className='w-full' disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}



