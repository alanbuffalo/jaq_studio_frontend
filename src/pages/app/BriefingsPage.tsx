import { FileText, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { briefingsApi, type Briefing, type BriefingDetail } from '../../api/briefings';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { Input } from '../../components/common/Input';

const analysisStatusTone: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-700',
  COMPLETED: 'bg-amber-100 text-amber-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
};

const draftStatusTone: Record<string, string> = {
  DRAFT: 'bg-slate-100 text-slate-700',
  REVIEWED: 'bg-sky-100 text-sky-700',
  APPROVED: 'bg-emerald-100 text-emerald-700',
  DISCARDED: 'bg-rose-100 text-rose-700',
};

function formatDate(value?: string | null) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(date);
}

function BriefingListSkeleton() {
  return (
    <div className='space-y-2'>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className='rounded-xl border border-slate-200 bg-white p-4'>
          <div className='skeleton h-4 w-40' />
          <div className='mt-3 skeleton h-3 w-28' />
        </div>
      ))}
    </div>
  );
}

function BriefingDetailSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='space-y-3'>
        <div className='skeleton h-7 w-56' />
        <div className='skeleton h-4 w-72' />
      </div>
      <div className='grid gap-3 md:grid-cols-3'>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className='rounded-2xl bg-slate-50 p-4'>
            <div className='skeleton h-4 w-20' />
            <div className='mt-3 skeleton h-4 w-full' />
          </div>
        ))}
      </div>
      <div className='skeleton h-24 w-full' />
      <div className='skeleton h-24 w-full' />
    </div>
  );
}

export function BriefingsPage() {
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [selectedBriefingId, setSelectedBriefingId] = useState<number | null>(null);
  const [selectedBriefing, setSelectedBriefing] = useState<BriefingDetail | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [submittingDraft, setSubmittingDraft] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const loadBriefings = async () => {
    setLoading(true);
    try {
      const response = await briefingsApi.listBriefings({ page_size: 100 });
      const items = response.results ?? [];
      setBriefings(items);
      setSelectedBriefingId((current) => current ?? items[0]?.id ?? null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBriefings();
  }, []);

  useEffect(() => {
    if (!selectedBriefingId) {
      setSelectedBriefing(null);
      return;
    }

    (async () => {
      setDetailLoading(true);
      try {
        const detail = await briefingsApi.getBriefing(selectedBriefingId);
        setSelectedBriefing(detail);
      } finally {
        setDetailLoading(false);
      }
    })();
  }, [selectedBriefingId]);

  const filteredBriefings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return briefings.filter((item) => {
      const haystack = [item.title, item.client_name, item.brand_name, item.project_type, item.status]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return !normalizedQuery || haystack.includes(normalizedQuery);
    });
  }, [briefings, query]);

  const canGenerateDraft = selectedBriefing?.analysis?.status === 'APPROVED';

  const handleGenerateDraft = async () => {
    if (!selectedBriefing || !canGenerateDraft) return;

    setSubmittingDraft(true);
    setMessage(null);
    try {
      await briefingsApi.generateContractDraft(selectedBriefing.id, {
        title: `Minuta - ${selectedBriefing.title}`,
      });
      setMessage('Minuta gerada com sucesso.');
      const refreshed = await briefingsApi.getBriefing(selectedBriefing.id);
      setSelectedBriefing(refreshed);
    } catch {
      setMessage('Nao foi possivel gerar a minuta.');
    } finally {
      setSubmittingDraft(false);
    }
  };

  return (
    <div className='space-y-6'>
      <section className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.22em] text-slate-400'>Briefings</p>
          <h1 className='mt-2 text-3xl font-semibold tracking-tight text-slate-950'>Fluxo de briefing</h1>
          <p className='mt-2 text-sm text-slate-500'>Briefing, analise e minuta em uma unica mesa de trabalho.</p>
        </div>
      </section>

      <Card title='Busca' className='rounded-3xl'>
        <Input placeholder='Buscar por briefing, cliente, marca ou tipo de projeto' value={query} onChange={(event) => setQuery(event.target.value)} />
      </Card>

      {message ? <div className='rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600'>{message}</div> : null}

      <section className='grid gap-6 xl:grid-cols-[0.9fr_1.1fr]'>
        <Card title='Briefings' className='rounded-3xl'>
          {loading ? <BriefingListSkeleton /> : null}

          {!loading && filteredBriefings.length === 0 ? (
            <EmptyState title='Nenhum briefing encontrado' description='Ajuste a busca ou revise os registros disponiveis.' />
          ) : null}

          {!loading && filteredBriefings.length > 0 ? (
            <div className='space-y-2'>
              {filteredBriefings.map((item) => (
                <button
                  key={item.id}
                  type='button'
                  onClick={() => setSelectedBriefingId(item.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    selectedBriefingId === item.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <p className='font-medium'>{item.title}</p>
                      <p className={`mt-1 text-sm ${selectedBriefingId === item.id ? 'text-slate-300' : 'text-slate-500'}`}>
                        {item.client_name} {item.brand_name ? `- ${item.brand_name}` : ''}
                      </p>
                    </div>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${selectedBriefingId === item.id ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-700'}`}>
                      {item.status}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </Card>

        <Card
          title='Detalhe'
          className='rounded-3xl'
          action={
            canGenerateDraft ? (
              <Button className='h-10 rounded-xl' disabled={submittingDraft} onClick={() => void handleGenerateDraft()}>
                <Sparkles size={16} />
                {submittingDraft ? 'Gerando...' : 'Gerar minuta'}
              </Button>
            ) : undefined
          }
        >
          {detailLoading ? <BriefingDetailSkeleton /> : null}

          {!detailLoading && !selectedBriefing ? <EmptyState title='Selecione um briefing' description='O detalhe do briefing aparecera aqui.' /> : null}

          {!detailLoading && selectedBriefing ? (
            <div className='space-y-6'>
              <div className='flex flex-wrap items-start justify-between gap-4'>
                <div>
                  <h2 className='text-2xl font-semibold text-slate-950'>{selectedBriefing.title}</h2>
                  <p className='mt-1 text-sm text-slate-500'>
                    {selectedBriefing.client_name}
                    {selectedBriefing.brand_name ? ` - ${selectedBriefing.brand_name}` : ''}
                  </p>
                </div>
                <span className='inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700'>{selectedBriefing.status}</span>
              </div>

              <div className='grid gap-3 md:grid-cols-3'>
                <div className='rounded-2xl bg-slate-50 px-4 py-3'>
                  <p className='text-sm font-medium text-slate-900'>Projeto</p>
                  <p className='mt-2 text-sm text-slate-600'>{selectedBriefing.project_type || '-'}</p>
                </div>
                <div className='rounded-2xl bg-slate-50 px-4 py-3'>
                  <p className='text-sm font-medium text-slate-900'>Prioridade</p>
                  <p className='mt-2 text-sm text-slate-600'>{selectedBriefing.priority || '-'}</p>
                </div>
                <div className='rounded-2xl bg-slate-50 px-4 py-3'>
                  <p className='text-sm font-medium text-slate-900'>Prazo</p>
                  <p className='mt-2 text-sm text-slate-600'>{formatDate(selectedBriefing.requested_end_date)}</p>
                </div>
              </div>

              <div className='rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4'>
                <p className='text-sm font-medium text-slate-900'>Objetivo</p>
                <p className='mt-2 text-sm leading-6 text-slate-600'>{selectedBriefing.objective_summary || 'Sem objetivo registrado.'}</p>
              </div>

              <div className='grid gap-6 md:grid-cols-2'>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-medium text-slate-900'>Analise</p>
                    {selectedBriefing.analysis ? (
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${analysisStatusTone[selectedBriefing.analysis.status] || 'bg-slate-100 text-slate-700'}`}>
                        {selectedBriefing.analysis.status}
                      </span>
                    ) : null}
                  </div>

                  {!selectedBriefing.analysis ? <EmptyState title='Sem analise' description='A geracao de minuta depende de uma analise aprovada.' /> : null}

                  {selectedBriefing.analysis ? (
                    <div className='space-y-3'>
                      <div className='rounded-xl border border-slate-200 bg-white px-4 py-3'>
                        <p className='text-sm font-medium text-slate-900'>Escopo recomendado</p>
                        <p className='mt-2 text-sm leading-6 text-slate-600'>{selectedBriefing.analysis.recommended_scope || '-'}</p>
                      </div>
                      <div className='rounded-xl border border-slate-200 bg-white px-4 py-3'>
                        <p className='text-sm font-medium text-slate-900'>Entregaveis</p>
                        <p className='mt-2 text-sm leading-6 text-slate-600'>{selectedBriefing.analysis.recommended_deliverables || '-'}</p>
                      </div>
                      <div className='rounded-xl border border-slate-200 bg-white px-4 py-3'>
                        <p className='text-sm font-medium text-slate-900'>Riscos</p>
                        <p className='mt-2 text-sm leading-6 text-slate-600'>{selectedBriefing.analysis.risks || '-'}</p>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <p className='text-sm font-medium text-slate-900'>Minutas</p>
                    <span className='text-xs text-slate-400'>{selectedBriefing.contract_drafts.length}</span>
                  </div>

                  {selectedBriefing.contract_drafts.length === 0 ? (
                    <EmptyState title='Sem minuta' description='Quando gerada, a minuta passara a aparecer nesta area.' />
                  ) : null}

                  {selectedBriefing.contract_drafts.map((draft) => (
                    <div key={draft.id} className='rounded-xl border border-slate-200 bg-white px-4 py-3'>
                      <div className='flex items-start justify-between gap-3'>
                        <div className='min-w-0'>
                          <div className='flex items-center gap-2'>
                            <FileText size={15} className='text-slate-400' />
                            <p className='truncate font-medium text-slate-900'>{draft.title}</p>
                          </div>
                          <p className='mt-2 text-sm text-slate-500'>{draft.code_suggestion || 'Sem codigo sugerido'}</p>
                        </div>
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${draftStatusTone[draft.status] || 'bg-slate-100 text-slate-700'}`}>
                          {draft.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </Card>
      </section>
    </div>
  );
}
