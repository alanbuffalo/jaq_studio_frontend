import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { coreApi } from '../../api/core';
import { Card } from '../../components/common/Card';
import { EmptyState } from '../../components/common/EmptyState';
import { Input } from '../../components/common/Input';
import { StatusBadge } from '../../components/common/StatusBadge';
import type { User } from '../../types/auth';

function getDisplayName(user: User) {
  return user.full_name || user.name || `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || user.email;
}

export function UsersListPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await coreApi.listUsers();
        setUsers(response);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const value = query.toLowerCase();
    return users.filter((item) =>
      [item.email, item.first_name, item.last_name, item.full_name, item.name, item.role]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(value),
    );
  }, [query, users]);

  return (
    <Card
      title='Usuários'
      subtitle='Gerencie usuários (ADMIN e DIRETOR)'
      action={
        <Link
          to='/configuracoes/usuarios/novo'
          className='inline-flex items-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-600'
        >
          <Plus size={16} />
          Novo usuário
        </Link>
      }
    >
      <div className='mb-4'>
        <Input placeholder='Buscar por nome, e-mail ou perfil' value={query} onChange={(event) => setQuery(event.target.value)} />
      </div>

      {loading ? <p className='text-sm text-slate-500'>Carregando usuários...</p> : null}
      {!loading && filtered.length === 0 ? (
        <EmptyState title='Nenhum usuário encontrado' description='Tente ajustar o filtro ou criar um novo usuário.' />
      ) : null}

      {!loading && filtered.length > 0 ? (
        <div className='overflow-hidden rounded-lg border border-slate-200'>
          <table className='min-w-full divide-y divide-slate-200 bg-white text-sm'>
            <thead className='bg-slate-50 text-left text-slate-500'>
              <tr>
                <th className='px-4 py-3 font-medium'>Nome</th>
                <th className='px-4 py-3 font-medium'>E-mail</th>
                <th className='px-4 py-3 font-medium'>Perfil</th>
                <th className='px-4 py-3 font-medium'>Status</th>
                <th className='px-4 py-3 font-medium'>Ações</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-slate-100 text-slate-700'>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className='px-4 py-3'>{getDisplayName(item)}</td>
                  <td className='px-4 py-3'>{item.email}</td>
                  <td className='px-4 py-3'>{item.role}</td>
                  <td className='px-4 py-3'>
                    <StatusBadge active={item.is_active ?? true} />
                  </td>
                  <td className='px-4 py-3'>
                    <Link
                      to={`/configuracoes/usuarios/${item.id}`}
                      className='inline-flex items-center rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-700 transition hover:bg-brand-100'
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Card>
  );
}


