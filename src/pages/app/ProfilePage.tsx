import { useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { authApi } from '../../api/auth';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { fileToBase64 } from '../../utils/base64';

export function ProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    email: String(user?.email ?? ''),
    first_name: String(user?.first_name ?? ''),
    last_name: String(user?.last_name ?? ''),
    password: '',
  });
  const [saving, setSaving] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const preview = useMemo(() => {
    if (user?.photo_bytes) {
      return `data:image/jpeg;base64,${user.photo_bytes}`;
    }
    return null;
  }, [user?.photo_bytes]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const payload: Record<string, unknown> = {
        email: form.email,
        first_name: form.first_name,
        last_name: form.last_name,
      };
      if (form.password) {
        payload.password = form.password;
      }
      const updated = await authApi.updateMe(payload);
      setUser(updated);
      setMessage('Dados atualizados com sucesso.');
      setForm((prev) => ({ ...prev, password: '' }));
    } catch {
      setMessage('Erro ao atualizar seu perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPhotoLoading(true);
    setMessage(null);
    try {
      const photo_bytes = await fileToBase64(file);
      const updated = await authApi.updateMyPhoto(photo_bytes);
      setUser(updated);
      setMessage('Foto atualizada com sucesso.');
    } catch {
      setMessage('Erro ao atualizar foto.');
    } finally {
      setPhotoLoading(false);
      event.target.value = '';
    }
  };

  const removePhoto = async () => {
    setPhotoLoading(true);
    setMessage(null);
    try {
      const updated = await authApi.updateMyPhoto(null);
      setUser(updated);
      setMessage('Foto removida com sucesso.');
    } catch {
      setMessage('Erro ao remover foto.');
    } finally {
      setPhotoLoading(false);
    }
  };

  return (
    <div className='grid gap-6 lg:grid-cols-[1fr_360px]'>
      <Card title='Meu Perfil' subtitle='Atualize seus dados e senha'>
        <form className='grid gap-4 md:grid-cols-2' onSubmit={onSubmit}>
          <Input
            label='E-mail'
            type='email'
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
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
          <Input
            label='Nova senha'
            type='password'
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            placeholder='Preencha apenas se quiser alterar'
          />
          <div className='md:col-span-2 flex items-center gap-3'>
            <Button disabled={saving}>{saving ? 'Salvando...' : 'Salvar alterações'}</Button>
            {message ? <p className='text-sm text-slate-500'>{message}</p> : null}
          </div>
        </form>
      </Card>

      <Card title='Foto de Perfil' subtitle='Envie uma imagem em base64 via API'>
        <div className='space-y-4'>
          {preview ? (
            <img src={preview} alt='Foto de perfil' className='h-36 w-36 rounded-2xl object-cover' />
          ) : (
            <div className='grid h-36 w-36 place-items-center rounded-2xl bg-slate-100 text-slate-500'>Sem foto</div>
          )}
          <input type='file' accept='image/*' onChange={handlePhotoChange} className='field-input' />
          <Button variant='outline' onClick={removePhoto} disabled={photoLoading}>
            Remover foto
          </Button>
        </div>
      </Card>
    </div>
  );
}


