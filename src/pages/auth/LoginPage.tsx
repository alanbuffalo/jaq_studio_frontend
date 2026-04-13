import { ArrowRight, Lock, Mail } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
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
      setError('Nao foi possivel autenticar. Verifique e-mail e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='grid min-h-screen bg-[#f6f3ef] lg:grid-cols-[1.08fr_0.92fr]'>
      <section className='relative hidden overflow-hidden bg-[linear-gradient(145deg,#172033_0%,#1f2b40_45%,#30405a_100%)] px-14 py-12 text-white lg:flex lg:flex-col lg:justify-between'>
        <div className='absolute left-[-80px] top-[-120px] h-[320px] w-[320px] rounded-full bg-[#b9817f]/25 blur-3xl' />
        <div className='absolute bottom-[-120px] right-[-80px] h-[320px] w-[320px] rounded-full bg-[#707b68]/30 blur-3xl' />

        <div className='relative z-10 max-w-xl'>
          <p className='inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80'>
            JAQ Studio
          </p>
          <h1 className='mt-6 text-5xl font-semibold leading-[1.05] tracking-tight'>Operacao, clientes e entrega em um unico ambiente.</h1>
          <p className='mt-6 max-w-lg text-base leading-7 text-slate-300'>Base administrativa da agencia com foco em rotina, contexto e execucao.</p>
        </div>

        <div className='relative z-10 grid gap-4 md:grid-cols-3'>
          <div className='rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm'>
            <p className='text-sm font-medium text-slate-300'>Acesso</p>
            <p className='mt-3 text-xl font-semibold'>Controle por perfil</p>
          </div>
          <div className='rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm'>
            <p className='text-sm font-medium text-slate-300'>Operacao</p>
            <p className='mt-3 text-xl font-semibold'>Fluxos conectados</p>
          </div>
          <div className='rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm'>
            <p className='text-sm font-medium text-slate-300'>Visual</p>
            <p className='mt-3 text-xl font-semibold'>Leitura objetiva</p>
          </div>
        </div>
      </section>

      <section className='grid place-items-center px-5 py-10 lg:px-10'>
        <div className='w-full max-w-[520px] app-enter'>
          <div className='rounded-[36px] border border-white/80 bg-white/92 p-8 shadow-[0_30px_80px_rgba(23,32,51,0.12)] lg:p-10'>
            <div className='mb-8'>
              <p className='text-xs font-semibold uppercase tracking-[0.24em] text-slate-400'>Acesso</p>
              <h2 className='mt-3 text-3xl font-semibold tracking-tight text-slate-950'>Entrar no sistema</h2>
              <p className='mt-3 text-sm leading-6 text-slate-500'>Use suas credenciais para acessar o ambiente administrativo.</p>
            </div>

            <form className='space-y-5' onSubmit={handleSubmit}>
              <div className='relative'>
                <Mail className='pointer-events-none absolute left-4 top-[42px] size-4 text-slate-400' />
                <Input
                  label='E-mail'
                  type='email'
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder='voce@jaqstudio.com.br'
                  className='pl-11'
                />
              </div>

              <div className='relative'>
                <Lock className='pointer-events-none absolute left-4 top-[42px] size-4 text-slate-400' />
                <Input
                  label='Senha'
                  type='password'
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  placeholder='Sua senha'
                  className='pl-11'
                />
              </div>

              {error ? (
                <div className='rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600'>{error}</div>
              ) : null}

              <Button className='h-12 w-full rounded-2xl'>
                {loading ? 'Entrando...' : 'Entrar'}
                {!loading ? <ArrowRight size={16} /> : null}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
