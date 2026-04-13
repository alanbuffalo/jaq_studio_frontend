import { Globe, Mail, Phone } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { clientsApi, type Brand, type Client, type ClientDetail, type Contact } from '../../api/clients';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { Input } from '../../components/common/Input';

const clientStatusLabels = {
  LEAD: 'Lead',
  ACTIVE: 'Ativo',
  PAUSED: 'Pausado',
  CHURNED: 'Encerrado',
} as const;

const onboardingLabels = {
  NOT_STARTED: 'Nao iniciado',
  IN_PROGRESS: 'Em andamento',
  COMPLETED: 'Concluido',
} as const;

function statusClass(status?: keyof typeof clientStatusLabels) {
  switch (status) {
    case 'ACTIVE':
      return 'bg-emerald-100 text-emerald-700';
    case 'PAUSED':
      return 'bg-amber-100 text-amber-700';
    case 'CHURNED':
      return 'bg-rose-100 text-rose-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
}

function ClientListSkeleton() {
  return (
    <div className='space-y-2'>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className='rounded-xl border border-slate-200 bg-white p-4'>
          <div className='skeleton h-4 w-40' />
          <div className='mt-3 skeleton h-3 w-24' />
        </div>
      ))}
    </div>
  );
}

function ClientDetailSkeleton() {
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
    </div>
  );
}

export function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientDetail | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [clientsResponse, brandsResponse, contactsResponse] = await Promise.all([
          clientsApi.listClients({ page_size: 100 }),
          clientsApi.listBrands({ page_size: 300 }),
          clientsApi.listContacts({ page_size: 300 }),
        ]);
        const clientItems = clientsResponse.results ?? [];
        setClients(clientItems);
        setBrands(brandsResponse.results ?? []);
        setContacts(contactsResponse.results ?? []);
        if (clientItems[0]) {
          setSelectedClientId(clientItems[0].id);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedClientId) {
      setSelectedClient(null);
      return;
    }

    (async () => {
      setDetailLoading(true);
      try {
        const detail = await clientsApi.getClient(selectedClientId);
        setSelectedClient(detail);
      } finally {
        setDetailLoading(false);
      }
    })();
  }, [selectedClientId]);

  const filteredClients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return clients.filter((client) => {
      const haystack = [client.legal_name, client.trade_name, client.segment, client.billing_email, client.phone]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return !normalizedQuery || haystack.includes(normalizedQuery);
    });
  }, [clients, query]);

  const selectedBrands = useMemo(() => brands.filter((brand) => brand.client === selectedClientId), [brands, selectedClientId]);
  const selectedContacts = useMemo(() => contacts.filter((contact) => contact.client === selectedClientId), [contacts, selectedClientId]);

  return (
    <div className='space-y-6'>
      <section className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
        <div>
          <p className='text-xs font-semibold uppercase tracking-[0.22em] text-slate-400'>Clientes</p>
          <h1 className='mt-2 text-3xl font-semibold tracking-tight text-slate-950'>Base de clientes</h1>
          <p className='mt-2 text-sm text-slate-500'>Clientes, marcas e contatos vinculados a operacao.</p>
        </div>
      </section>

      <Card title='Busca' className='rounded-3xl'>
        <Input placeholder='Buscar por cliente, segmento, e-mail ou telefone' value={query} onChange={(event) => setQuery(event.target.value)} />
      </Card>

      <section className='grid gap-6 xl:grid-cols-[0.9fr_1.1fr]'>
        <Card title='Clientes' className='rounded-3xl'>
          {loading ? <ClientListSkeleton /> : null}

          {!loading && filteredClients.length === 0 ? (
            <EmptyState title='Nenhum cliente encontrado' description='Ajuste a busca ou valide os registros disponiveis.' />
          ) : null}

          {!loading && filteredClients.length > 0 ? (
            <div className='space-y-2'>
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  type='button'
                  onClick={() => setSelectedClientId(client.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    selectedClientId === client.id ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div>
                      <p className='font-medium'>{client.trade_name || client.legal_name}</p>
                      <p className={`mt-1 text-sm ${selectedClientId === client.id ? 'text-slate-300' : 'text-slate-500'}`}>{client.segment || 'Sem segmento'}</p>
                    </div>
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${selectedClientId === client.id ? 'bg-white/10 text-white' : statusClass(client.status)}`}>
                      {clientStatusLabels[client.status as keyof typeof clientStatusLabels] || 'Status'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : null}
        </Card>

        <Card title='Detalhe' className='rounded-3xl'>
          {detailLoading ? <ClientDetailSkeleton /> : null}

          {!detailLoading && !selectedClient ? <EmptyState title='Selecione um cliente' description='O detalhe do cliente aparecera aqui.' /> : null}

          {!detailLoading && selectedClient ? (
            <div className='space-y-6'>
              <div className='flex flex-wrap items-start justify-between gap-4'>
                <div>
                  <h2 className='text-2xl font-semibold text-slate-950'>{selectedClient.trade_name || selectedClient.legal_name}</h2>
                  <p className='mt-1 text-sm text-slate-500'>{selectedClient.legal_name}</p>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClass(selectedClient.status)}`}>
                    {clientStatusLabels[selectedClient.status as keyof typeof clientStatusLabels] || 'Status'}
                  </span>
                  <span className='inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700'>
                    {onboardingLabels[selectedClient.onboarding_status as keyof typeof onboardingLabels] || 'Onboarding'}
                  </span>
                </div>
              </div>

              <div className='grid gap-3 md:grid-cols-3'>
                <div className='rounded-2xl bg-slate-50 px-4 py-3'>
                  <div className='flex items-center gap-2 text-sm font-medium text-slate-900'>
                    <Mail size={15} />
                    Billing
                  </div>
                  <p className='mt-2 text-sm text-slate-600'>{selectedClient.billing_email || 'Nao informado'}</p>
                </div>
                <div className='rounded-2xl bg-slate-50 px-4 py-3'>
                  <div className='flex items-center gap-2 text-sm font-medium text-slate-900'>
                    <Phone size={15} />
                    Telefone
                  </div>
                  <p className='mt-2 text-sm text-slate-600'>{selectedClient.phone || 'Nao informado'}</p>
                </div>
                <div className='rounded-2xl bg-slate-50 px-4 py-3'>
                  <div className='flex items-center gap-2 text-sm font-medium text-slate-900'>
                    <Globe size={15} />
                    Website
                  </div>
                  <p className='mt-2 text-sm text-slate-600'>{selectedClient.website || 'Nao informado'}</p>
                </div>
              </div>

              <div className='rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-4'>
                <p className='text-sm font-medium text-slate-900'>Observacoes</p>
                <p className='mt-2 text-sm leading-6 text-slate-600'>{selectedClient.service_notes || 'Sem observacoes registradas.'}</p>
              </div>

              <div className='grid gap-6 md:grid-cols-2'>
                <div>
                  <p className='mb-3 text-sm font-medium text-slate-900'>Marcas</p>
                  <div className='space-y-2'>
                    {selectedBrands.length === 0 ? <p className='text-sm text-slate-500'>Nenhuma marca vinculada.</p> : null}
                    {selectedBrands.map((brand) => (
                      <div key={brand.id} className='rounded-xl border border-slate-200 bg-white px-4 py-3'>
                        <p className='font-medium text-slate-900'>{brand.name}</p>
                        <p className='mt-1 text-sm text-slate-500'>{brand.legal_name || 'Sem razao social complementar'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className='mb-3 text-sm font-medium text-slate-900'>Contatos</p>
                  <div className='space-y-2'>
                    {selectedContacts.length === 0 ? <p className='text-sm text-slate-500'>Nenhum contato vinculado.</p> : null}
                    {selectedContacts.map((contact) => (
                      <div key={contact.id} className='rounded-xl border border-slate-200 bg-white px-4 py-3'>
                        <p className='font-medium text-slate-900'>{contact.name}</p>
                        <p className='mt-1 text-sm text-slate-500'>{contact.job_title || contact.department || 'Contato operacional'}</p>
                        <div className='mt-2 flex flex-wrap gap-2 text-xs text-slate-500'>
                          <span className='rounded-full bg-slate-100 px-2.5 py-1'>{contact.email}</span>
                          {contact.brand_name ? <span className='rounded-full bg-slate-100 px-2.5 py-1'>{contact.brand_name}</span> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </Card>
      </section>
    </div>
  );
}
