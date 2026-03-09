import { useEffect, useState } from 'react';
import { coreApi, type HomePayload } from '../../api/core';
import { Card } from '../../components/common/Card';
import { useAuth } from '../../hooks/useAuth';

export function HomePage() {
  const { user } = useAuth();
  const [data, setData] = useState<HomePayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const payload = await coreApi.home();
        setData(payload);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const permissionsValue = data?.permissions as unknown;
  const permissionsText = Array.isArray(permissionsValue)
    ? permissionsValue.join(', ')
    : typeof permissionsValue === 'string'
      ? permissionsValue
      : permissionsValue && typeof permissionsValue === 'object'
        ? Object.entries(permissionsValue)
            .filter(([, value]) => Boolean(value))
            .map(([key]) => key)
            .join(', ')
        : '';

  return (
    <div className='space-y-6'>
      <Card title='Home' subtitle='Resumo inicial autenticado'>
        <div className='space-y-2'>
          <p className='text-sm text-slate-600'>
            {loading ? 'Carregando mensagem da home...' : data?.message ?? 'Bem-vindo ao painel administrativo.'}
          </p>
          <p className='text-sm text-slate-500'>Usuário logado: {user?.email}</p>
          <p className='text-sm text-slate-500'>Perfil atual: {user?.role}</p>
        </div>
      </Card>

      <div className='grid gap-4 md:grid-cols-3'>
        <Card title='Usuário' subtitle='Dados atuais'>
          <p className='text-sm text-slate-600'>{user?.full_name || user?.name || user?.email}</p>
        </Card>
        <Card title='Permissões' subtitle='Retornadas pela API /api/home/'>
          <p className='text-sm text-slate-600'>{permissionsText || 'Sem lista de permissões'}</p>
        </Card>
        <Card title='Ambiente' subtitle='Configuração da aplicação'>
          <p className='text-sm text-slate-600'>Servidor: {import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8839'}</p>
        </Card>
      </div>
    </div>
  );
}



