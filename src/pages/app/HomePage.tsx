import { ArrowRight, Bell, FolderOpenDot, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';

export function HomePage() {
  const { user, canAccessModule } = useAuth();

  const quickLinks = [
    canAccessModule('crm') ? { label: 'CRM', to: '/crm/oportunidades', icon: Target, description: 'Oportunidades e atividades' } : null,
    canAccessModule('clients') ? { label: 'Clientes', to: '/clientes', icon: FolderOpenDot, description: 'Clientes, marcas e contatos' } : null,
    canAccessModule('notifications') ? { label: 'Notificacoes', to: '/notificacoes', icon: Bell, description: 'Pendencias do usuario' } : null,
  ].filter(Boolean) as Array<{ label: string; to: string; icon: typeof Target; description: string }>;

  return (
    <div className='space-y-6'>
      <section className='grid gap-6 xl:grid-cols-[1.3fr_0.7fr]'>
        <Card title='JAQ Studio' subtitle={user?.role ? `Perfil atual: ${user.role}` : undefined} className='rounded-3xl'>
          <div className='max-w-3xl space-y-4'>
            <p className='text-[28px] font-semibold leading-tight text-slate-950'>Ambiente central de operacao da agencia.</p>
            <p className='max-w-2xl text-sm leading-6 text-slate-500'>A navegacao e as acoes disponiveis seguem o acesso do usuario autenticado.</p>
          </div>
        </Card>

        <Card title='Acesso' className='rounded-3xl'>
          <div className='space-y-3 text-sm text-slate-600'>
            <div className='flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3'>
              <span>Modulos</span>
              <strong className='text-slate-950'>Disponiveis por perfil</strong>
            </div>
            <div className='flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3'>
              <span>Acoes</span>
              <strong className='text-slate-950'>Liberadas por permissao</strong>
            </div>
          </div>
        </Card>
      </section>

      <section className='grid gap-6 lg:grid-cols-[1fr_1fr]'>
        <Card title='Areas de trabalho' subtitle='Acesso direto aos modulos disponiveis' className='rounded-3xl'>
          <div className='space-y-3'>
            {quickLinks.map((item) => (
              <Link key={item.to} to={item.to} className='flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 transition hover:border-slate-300 hover:bg-slate-50'>
                <div className='flex items-center gap-3'>
                  <span className='grid size-10 place-items-center rounded-2xl bg-slate-100 text-slate-700'>
                    <item.icon size={18} />
                  </span>
                  <div>
                    <p className='font-medium text-slate-950'>{item.label}</p>
                    <p className='text-sm text-slate-500'>{item.description}</p>
                  </div>
                </div>
                <ArrowRight size={16} className='text-slate-400' />
              </Link>
            ))}
          </div>
        </Card>

        <Card title='Foco do dia' subtitle='Fila operacional e proximos passos' className='rounded-3xl'>
          <div className='space-y-3'>
            <div className='rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500'>
              Esta area sera preenchida com prioridades operacionais dos modulos ativos.
            </div>
            <div className='rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600'>
              A base foi reorganizada para dar mais foco em trabalho e menos peso para dashboard.
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
