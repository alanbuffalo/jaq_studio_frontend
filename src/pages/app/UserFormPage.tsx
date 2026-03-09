import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { coreApi } from '../../api/core';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import type { Role } from '../../types/auth';
import { fileToBase64 } from '../../utils/base64';

const roles: Role[] = ['ADMIN', 'ATENDIMENTO', 'MIDIA', 'FINANCEIRO', 'DIRETOR'];

export function UserFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== 'novo';

  const [form, setForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: 'ATENDIMENTO' as Role,
    is_active: true,
    password: '',
    photo_bytes: null as string | null,
  });
  const [loading, setLoading] = useState(!!isEdit);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit || !id) return;

    (async () => {
      try {
        const payload = await coreApi.getUser(id);
        const user = ((payload as unknown as { user?: Record<string, unknown> }).user ??
          payload) as Record<string, unknown>;

        setForm({
          email: String(user.email ?? ''),
          first_name: String(user.first_name ?? ''),
          last_name: String(user.last_name ?? ''),
          role: (user.role as Role) ?? 'ATENDIMENTO',
          is_active: Boolean(user.is_active ?? true),
          password: '',
          photo_bytes: (user.photo_bytes as string | null) ?? null,
        });
        setMessage(null);
      } catch {
        setMessage('Não foi possível carregar os dados do usuário.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isEdit]);

  const preview = useMemo(() => {
    if (!form.photo_bytes) return null;
    return `data:image/jpeg;base64,${form.photo_bytes}`;
  }, [form.photo_bytes]);
  const passwordChecks = useMemo(() => {
    const value = form.password;
    const rules = [
      { label: 'Mínimo 8 caracteres', valid: value.length >= 8 },
      { label: 'Uma letra maiúscula', valid: /[A-Z]/.test(value) },
      { label: 'Um número', valid: /\d/.test(value) },
      { label: 'Um caractere especial', valid: /[^A-Za-z0-9]/.test(value) },
    ];
    const score = rules.filter((rule) => rule.valid).length;
    const shouldValidate = !isEdit || value.length > 0;

    return {
      rules,
      score,
      shouldValidate,
      isValid: rules.every((rule) => rule.valid),
    };
  }, [form.password, isEdit]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    if (passwordChecks.shouldValidate && !passwordChecks.isValid) {
      setMessage('A senha não atende os requisitos mínimos.');
      setSaving(false);
      return;
    }

    try {
      const payload: Record<string, unknown> = {
        email: form.email,
        first_name: form.first_name,
        last_name: form.last_name,
        role: form.role,
        is_active: form.is_active,
        photo_bytes: form.photo_bytes,
      };
      if (form.password) {
        payload.password = form.password;
      }

      if (isEdit && id) {
        await coreApi.updateUser(id, payload);
        setMessage('Usuário atualizado com sucesso.');
      } else {
        await coreApi.createUser(payload as never);
        navigate('/configuracoes/usuarios', { replace: true });
      }
    } catch {
      setMessage('Erro ao salvar usuário.');
    } finally {
      setSaving(false);
    }
  };

  const onPhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const photo_bytes = await fileToBase64(file);
    setForm((prev) => ({ ...prev, photo_bytes }));
    event.target.value = '';
  };

  if (loading) {
    return <Card title='Usuário'>Carregando dados...</Card>;
  }

  return (
    <Card title={isEdit ? 'Editar Usuário' : 'Novo Usuário'} subtitle='Cadastro e manutenção de usuários'>
      <form className='grid gap-4 md:grid-cols-2' onSubmit={onSubmit}>
        <Input
          label='E-mail'
          type='email'
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          required
        />
        <Select
          label='Perfil'
          value={form.role}
          onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as Role }))}
        >
          {roles.map((role) => (
            <option value={role} key={role}>
              {role}
            </option>
          ))}
        </Select>

        <Input
          label='Nome'
          value={form.first_name}
          onChange={(event) => setForm((prev) => ({ ...prev, first_name: event.target.value }))}
        />
        <Input
          label='Sobrenome'
          value={form.last_name}
          onChange={(event) => setForm((prev) => ({ ...prev, last_name: event.target.value }))}
        />

        <div>
          <Input
            label={isEdit ? 'Nova senha (opcional)' : 'Senha'}
            type='password'
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required={!isEdit}
          />
          <div
            className={`overflow-hidden transition-all duration-300 ${passwordChecks.shouldValidate ? 'mt-2 max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className='space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3'>
              <div className='flex gap-1'>
                {[0, 1, 2, 3].map((step) => (
                  <span
                    key={step}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                      step < passwordChecks.score
                        ? passwordChecks.score >= 3
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              <ul className='space-y-1'>
                {passwordChecks.rules.map((rule) => (
                  <li
                    key={rule.label}
                    className={`flex items-center gap-2 text-xs transition-colors duration-300 ${
                      rule.valid ? 'text-emerald-600' : 'text-slate-500'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        rule.valid ? 'scale-110 bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                    {rule.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div>
          <span className='field-label'>Status</span>
          <div className='flex h-[46px] items-center gap-3 px-1 text-sm'>
            <button
              type='button'
              role='switch'
              aria-checked={form.is_active}
              aria-label='Status do usuário'
              onClick={() => setForm((prev) => ({ ...prev, is_active: !prev.is_active }))}
              className={`relative h-6 w-11 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-300 ${
                form.is_active ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
                  form.is_active ? 'left-[22px] scale-100' : 'left-0.5 scale-95'
                }`}
              />
            </button>
            <span className={`font-medium transition-colors duration-300 ${form.is_active ? 'text-emerald-600' : 'text-slate-500'}`}>
              {form.is_active ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>

        <div className='md:col-span-2'>
          <span className='field-label'>Foto (base64)</span>
          <div className='flex flex-wrap items-center gap-4'>
            {preview ? (
              <img src={preview} alt='Prévia da foto' className='h-20 w-20 rounded-xl object-cover' />
            ) : (
              <div className='grid h-20 w-20 place-items-center rounded-xl bg-slate-100 text-xs text-slate-500'>Sem foto</div>
            )}
            <input type='file' accept='image/*' onChange={onPhotoChange} className='field-input max-w-sm' />
            <Button
              type='button'
              variant='outline'
              onClick={() => setForm((prev) => ({ ...prev, photo_bytes: null }))}
            >
              Remover foto
            </Button>
          </div>
        </div>

        <div className='md:col-span-2 flex items-center gap-3'>
          <Button disabled={saving}>{saving ? 'Salvando...' : isEdit ? 'Salvar usuário' : 'Criar usuário'}</Button>
          <Button type='button' variant='outline' onClick={() => navigate('/configuracoes/usuarios')}>
            Voltar
          </Button>
          {message ? <p className='text-sm text-slate-500'>{message}</p> : null}
        </div>
      </form>
    </Card>
  );
}




