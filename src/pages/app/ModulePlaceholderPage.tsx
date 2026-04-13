import { ArrowRight, LockKeyhole } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';

interface ModulePlaceholderPageProps {
  title: string;
  subtitle: string;
  description: string;
  nextSteps: string[];
}

export function ModulePlaceholderPage({ title, subtitle, description, nextSteps }: ModulePlaceholderPageProps) {
  return (
    <div className='space-y-6'>
      <section className='rounded-[34px] border border-white/80 bg-[linear-gradient(135deg,#ffffff_0%,#f6f3ef_100%)] p-7 shadow-[0_24px_56px_rgba(23,32,51,0.08)]'>
        <div className='flex flex-wrap items-start justify-between gap-6'>
          <div className='max-w-3xl'>
            <p className='text-xs font-semibold uppercase tracking-[0.24em] text-slate-400'>Módulo</p>
            <h1 className='mt-3 text-3xl font-semibold tracking-tight text-slate-950'>{title}</h1>
            <p className='mt-3 text-sm text-slate-500'>{subtitle}</p>
            <p className='mt-5 max-w-2xl text-base leading-7 text-slate-600'>{description}</p>
          </div>

          <div className='rounded-3xl bg-slate-900 px-5 py-4 text-white shadow-[0_24px_40px_rgba(23,32,51,0.22)]'>
            <p className='text-sm font-medium text-slate-300'>Situação</p>
            <p className='mt-2 text-lg font-semibold'>Estrutura disponível para integração</p>
          </div>
        </div>
      </section>

      <div className='grid gap-6 xl:grid-cols-[1.1fr_0.9fr]'>
        <Card title='Escopo inicial' subtitle='Fluxos previstos para a próxima entrega.' className='rounded-[30px]'>
          <div className='space-y-3'>
            {nextSteps.map((step) => (
              <div key={step} className='flex items-start gap-3 rounded-2xl bg-slate-50 p-4'>
                <ArrowRight className='mt-0.5 size-4 text-slate-400' />
                <p className='text-sm text-slate-600'>{step}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title='Controle de acesso' className='rounded-[30px]'>
          <div className='space-y-4 text-sm text-slate-600'>
            <div className='flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4'>
              <LockKeyhole className='mt-0.5 size-4 text-slate-500' />
              <p>Rotas e ações serão habilitadas conforme os módulos e permissões retornados pelo backend.</p>
            </div>
            <Link to='/' className='inline-flex items-center gap-2 font-medium text-slate-950'>
              Voltar para a Home
              <ArrowRight className='size-4' />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
