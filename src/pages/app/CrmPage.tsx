import { LoaderCircle, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { crmApi, type ActivityType, type CommercialActivity, type Opportunity, type OpportunityStatus, type Pipeline } from '../../api/crm';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Textarea } from '../../components/common/Textarea';

type ViewMode = 'pipeline' | 'lista';

const activityTypeLabels: Record<ActivityType, string> = {
  NOTE: 'Nota',
  CALL: 'Ligacao',
  MEETING: 'Reuniao',
  EMAIL: 'E-mail',
  FOLLOW_UP: 'Follow-up',
};

const statusLabels: Record<OpportunityStatus, string> = {
  OPEN: 'Em aberto',
  WON: 'Ganho',
  LOST: 'Perdido',
  CANCELED: 'Cancelado',
};

const statusTone: Record<OpportunityStatus, string> = {
  OPEN: 'bg-slate-100 text-slate-700',
  WON: 'bg-emerald-100 text-emerald-700',
  LOST: 'bg-rose-100 text-rose-700',
  CANCELED: 'bg-amber-100 text-amber-700',
};

function formatCurrency(value?: string | null, currency = 'BRL') {
  if (!value) return 'Sem valor';
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return value;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(parsed);
}

function formatDate(value?: string | null) {
  if (!value) return 'Sem data';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(date);
}

function StatusPill({ status }: { status: OpportunityStatus }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusTone[status]}`}>{statusLabels[status]}</span>;
}

function ListSkeleton() {
  return (
    <div className='overflow-hidden rounded-2xl border border-slate-200'>
      <div className='bg-slate-50 px-4 py-3'>
        <div className='skeleton h-4 w-40' />
      </div>
      <div className='space-y-3 bg-white p-4'>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className='grid gap-3 md:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.6fr]'>
            <div className='skeleton h-10' />
            <div className='skeleton h-10' />
            <div className='skeleton h-10' />
            <div className='skeleton h-10' />
            <div className='skeleton h-10' />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CrmPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('lista');
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [activities, setActivities] = useState<CommercialActivity[]>([]);
  const [selectedPipelineId, setSelectedPipelineId] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<OpportunityStatus | ''>('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [submittingActivity, setSubmittingActivity] = useState(false);
  const [submittingConvert, setSubmittingConvert] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [activityForm, setActivityForm] = useState({
    opportunity: '',
    activity_type: 'FOLLOW_UP' as ActivityType,
    subject: '',
    description: '',
    due_at: '',
  });

  const loadCrm = async () => {
    setLoading(true);
    try {
      const [pipelinesResponse, opportunitiesResponse, activitiesResponse] = await Promise.all([
        crmApi.listPipelines(),
        crmApi.listOpportunities({ page_size: 100 }),
        crmApi.listActivities({ page_size: 10 }),
      ]);
      setPipelines(pipelinesResponse.filter((pipeline) => pipeline.is_active !== false));
      setOpportunities(opportunitiesResponse.results ?? []);
      setActivities(activitiesResponse.results ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCrm();
  }, []);

  const filteredOpportunities = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return opportunities.filter((item) => {
      const matchesPipeline = selectedPipelineId === 'all' || item.pipeline === selectedPipelineId;
      const matchesStatus = !statusFilter || item.status === statusFilter;
      const haystack = [item.title, item.lead_company_name, item.pipeline_name, item.stage_name, item.owner_email]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      return matchesPipeline && matchesStatus && matchesQuery;
    });
  }, [opportunities, query, selectedPipelineId, statusFilter]);

  const selectedPipeline = useMemo(() => {
    if (selectedPipelineId === 'all') {
      return pipelines.find((pipeline) => pipeline.is_default) || pipelines[0] || null;
    }
    return pipelines.find((pipeline) => pipeline.id === selectedPipelineId) || null;
  }, [pipelines, selectedPipelineId]);

  const groupedByStage = useMemo(() => {
    const result = new Map<number, Opportunity[]>();
    for (const item of filteredOpportunities) {
      const bucket = result.get(item.stage) ?? [];
      bucket.push(item);
      result.set(item.stage, bucket);
    }
    return result;
  }, [filteredOpportunities]);

  const handleCreateActivity = async () => {
    if (!activityForm.opportunity || !activityForm.subject.trim()) {
      setMessage('Selecione a oportunidade e preencha o assunto da atividade.');
      return;
    }

    setSubmittingActivity(true);
    setMessage(null);
    try {
      await crmApi.createActivity({
        opportunity: Number(activityForm.opportunity),
        activity_type: activityForm.activity_type,
        subject: activityForm.subject,
        description: activityForm.description || undefined,
        due_at: activityForm.due_at || undefined,
      });
      setActivityForm({
        opportunity: '',
        activity_type: 'FOLLOW_UP',
        subject: '',
        description: '',
        due_at: '',
      });
      setMessage('Atividade registrada com sucesso.');
      await loadCrm();
    } catch {
      setMessage('Nao foi possivel registrar a atividade.');
    } finally {
      setSubmittingActivity(false);
    }
  };

  const handleConvert = async (opportunity: Opportunity) => {
    setSubmittingConvert(opportunity.id);
    setMessage(null);
    try {
      await crmApi.convertOpportunity(opportunity.id, {
        client_legal_name: opportunity.lead_company_name || opportunity.title,
        client_trade_name: opportunity.lead_company_name || opportunity.title,
        billing_email: opportunity.owner_email || '',
        briefing_title: opportunity.title,
        briefing_objective_summary: opportunity.notes || '',
      });
      setMessage('Oportunidade convertida com sucesso.');
      await loadCrm();
    } catch {
      setMessage('Nao foi possivel concluir a conversao.');
    } finally {
      setSubmittingConvert(null);
    }
  };

  return (
    <div className='space-y-6'>
      <section className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.22em] text-slate-400'>CRM</p>
          <h1 className='mt-2 text-3xl font-semibold tracking-tight text-slate-950'>Oportunidades</h1>
          <p className='mt-2 text-sm text-slate-500'>Mesa comercial com pipeline, atividades e conversao.</p>
        </div>

        <div className='flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1'>
          <button
            type='button'
            onClick={() => setViewMode('lista')}
            className={`rounded-full px-4 py-2 text-sm transition ${viewMode === 'lista' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Lista
          </button>
          <button
            type='button'
            onClick={() => setViewMode('pipeline')}
            className={`rounded-full px-4 py-2 text-sm transition ${viewMode === 'pipeline' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'}`}
          >
            Pipeline
          </button>
        </div>
      </section>

      <Card title='Filtros' className='rounded-3xl'>
        <div className='grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr]'>
          <Input placeholder='Buscar por empresa, oportunidade ou responsavel' value={query} onChange={(event) => setQuery(event.target.value)} />
          <Select value={selectedPipelineId} onChange={(event) => setSelectedPipelineId(event.target.value === 'all' ? 'all' : Number(event.target.value))}>
            <option value='all'>Todos os pipelines</option>
            {pipelines.map((pipeline) => (
              <option key={pipeline.id} value={pipeline.id}>
                {pipeline.name}
              </option>
            ))}
          </Select>
          <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as OpportunityStatus | '')}>
            <option value=''>Todos os status</option>
            {Object.entries(statusLabels).map(([status, label]) => (
              <option key={status} value={status}>
                {label}
              </option>
            ))}
          </Select>
        </div>
      </Card>

      {message ? <div className='rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600'>{message}</div> : null}

      <section className='grid gap-6 xl:grid-cols-[1.35fr_0.65fr]'>
        <Card title={viewMode === 'lista' ? 'Lista de oportunidades' : selectedPipeline?.name || 'Pipeline'} className='rounded-3xl'>
          {loading ? <ListSkeleton /> : null}

          {!loading && filteredOpportunities.length === 0 ? (
            <EmptyState title='Nenhuma oportunidade encontrada' description='Ajuste os filtros ou revise os registros disponiveis.' />
          ) : null}

          {!loading && filteredOpportunities.length > 0 && viewMode === 'lista' ? (
            <div className='overflow-hidden rounded-2xl border border-slate-200'>
              <table className='min-w-full divide-y divide-slate-200 text-sm'>
                <thead className='bg-slate-50 text-left text-slate-500'>
                  <tr>
                    <th className='px-4 py-3 font-medium'>Oportunidade</th>
                    <th className='px-4 py-3 font-medium'>Empresa</th>
                    <th className='px-4 py-3 font-medium'>Estagio</th>
                    <th className='px-4 py-3 font-medium'>Valor</th>
                    <th className='px-4 py-3 font-medium'>Status</th>
                    <th className='px-4 py-3 font-medium'>Acao</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-100 bg-white'>
                  {filteredOpportunities.map((item) => (
                    <tr key={item.id} className='hover:bg-slate-50/60'>
                      <td className='px-4 py-3 font-medium text-slate-900'>{item.title}</td>
                      <td className='px-4 py-3 text-slate-600'>{item.lead_company_name || '-'}</td>
                      <td className='px-4 py-3 text-slate-600'>{item.stage_name || '-'}</td>
                      <td className='px-4 py-3 text-slate-600'>{formatCurrency(item.estimated_value, item.currency || 'BRL')}</td>
                      <td className='px-4 py-3'>
                        <StatusPill status={item.status} />
                      </td>
                      <td className='px-4 py-3'>
                        {item.status === 'OPEN' ? (
                          <button
                            type='button'
                            onClick={() => void handleConvert(item)}
                            className='text-sm font-medium text-slate-900 transition hover:text-[#6f7c66]'
                          >
                            {submittingConvert === item.id ? 'Convertendo...' : 'Converter'}
                          </button>
                        ) : (
                          <span className='text-slate-400'>-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {!loading && filteredOpportunities.length > 0 && viewMode === 'pipeline' ? (
            <div className='grid gap-4 xl:grid-cols-4'>
              {(selectedPipeline?.stages ?? []).slice().sort((a, b) => a.stage_order - b.stage_order).map((stage) => {
                const items = groupedByStage.get(stage.id) ?? [];
                return (
                  <div key={stage.id} className='rounded-2xl border border-slate-200 bg-slate-50/80 p-3'>
                    <div className='mb-3 flex items-center justify-between gap-2'>
                      <div>
                        <p className='font-medium text-slate-900'>{stage.name}</p>
                        <p className='text-xs text-slate-400'>{stage.probability ?? 0}%</p>
                      </div>
                      <span className='rounded-full bg-white px-2 py-0.5 text-xs text-slate-600'>{items.length}</span>
                    </div>

                    <div className='space-y-3'>
                      {items.length === 0 ? (
                        <div className='rounded-xl border border-dashed border-slate-200 bg-white px-3 py-6 text-center text-sm text-slate-400'>
                          Sem itens
                        </div>
                      ) : null}

                      {items.map((item) => (
                        <div key={item.id} className='rounded-xl border border-slate-200 bg-white p-3'>
                          <p className='font-medium text-slate-900'>{item.title}</p>
                          <p className='mt-1 text-sm text-slate-500'>{item.lead_company_name || 'Empresa nao informada'}</p>
                          <div className='mt-3 flex items-center justify-between text-xs text-slate-500'>
                            <span>{formatCurrency(item.estimated_value, item.currency || 'BRL')}</span>
                            <StatusPill status={item.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </Card>

        <div className='space-y-6'>
          <Card title='Nova atividade' className='rounded-3xl'>
            <div className='space-y-4'>
              <Select label='Oportunidade' value={activityForm.opportunity} onChange={(event) => setActivityForm((current) => ({ ...current, opportunity: event.target.value }))}>
                <option value=''>Selecione</option>
                {filteredOpportunities.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </Select>
              <Select label='Tipo' value={activityForm.activity_type} onChange={(event) => setActivityForm((current) => ({ ...current, activity_type: event.target.value as ActivityType }))}>
                {Object.entries(activityTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
              <Input label='Assunto' value={activityForm.subject} onChange={(event) => setActivityForm((current) => ({ ...current, subject: event.target.value }))} />
              <Textarea label='Descricao' value={activityForm.description} onChange={(event) => setActivityForm((current) => ({ ...current, description: event.target.value }))} />
              <Input label='Prazo' type='datetime-local' value={activityForm.due_at} onChange={(event) => setActivityForm((current) => ({ ...current, due_at: event.target.value }))} />
              <Button className='h-11 w-full rounded-xl' disabled={submittingActivity} onClick={() => void handleCreateActivity()}>
                {submittingActivity ? <LoaderCircle className='size-4 animate-spin' /> : <Plus size={16} />}
                Registrar atividade
              </Button>
            </div>
          </Card>

          <Card title='Atividades recentes' className='rounded-3xl'>
            <div className='space-y-3'>
              {activities.length === 0 ? <EmptyState title='Sem atividades' description='As atividades registradas aparecerao aqui.' /> : null}
              {activities.map((activity) => {
                const opportunity = opportunities.find((item) => item.id === activity.opportunity);
                return (
                  <div key={activity.id} className='rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3'>
                    <p className='font-medium text-slate-900'>{activity.subject}</p>
                    <p className='mt-1 text-sm text-slate-500'>{opportunity?.title || `Oportunidade #${activity.opportunity}`}</p>
                    <div className='mt-2 flex items-center justify-between text-xs text-slate-400'>
                      <span>{activityTypeLabels[activity.activity_type]}</span>
                      <span>{formatDate(activity.created_at)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
