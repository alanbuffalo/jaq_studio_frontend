import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { coreApi, type Agency, type CityOption, type StateOption } from '../../api/core';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { fileToBase64 } from '../../utils/base64';

function splitAddressLine(addressLine: string) {
  const value = addressLine.trim();
  if (!value) return { street: '', number: '' };
  const parts = value.split(',').map((part) => part.trim());
  if (parts.length === 1) return { street: parts[0], number: '' };

  return {
    street: parts.slice(0, -1).join(', '),
    number: parts[parts.length - 1],
  };
}

export function AgencySettingsPage() {
  const [form, setForm] = useState<Agency>({});
  const [addressNumber, setAddressNumber] = useState('');
  const [states, setStates] = useState<StateOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const stateValue = String(form.address_state ?? form.state ?? '');
  const cityValue = String(form.address_city ?? form.city ?? '');
  const zipCodeValue = useMemo(
    () => String(form.address_zip_code ?? form.zip_code ?? ''),
    [form.address_zip_code, form.zip_code],
  );
  const logoPreview = useMemo(() => (form.logo_bytes ? `data:image/jpeg;base64,${form.logo_bytes}` : null), [form.logo_bytes]);

  useEffect(() => {
    (async () => {
      try {
        const [agency, statesResponse] = await Promise.all([coreApi.getAgency(), coreApi.listStates()]);
        const { street, number } = splitAddressLine(String(agency.address_line ?? agency.address ?? ''));
        setForm({ ...agency, address_line: street });
        setAddressNumber(number);
        setStates(statesResponse);

        const initialState = String(agency.address_state ?? agency.state ?? '');
        if (initialState) {
          setCities(await coreApi.listCities(initialState));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleStateChange = async (nextState: string) => {
    setForm((prev) => ({ ...prev, address_state: nextState, address_city: '' }));
    setCities([]);
    if (!nextState) return;

    setLoadingCities(true);
    try {
      setCities(await coreApi.listCities(nextState));
    } finally {
      setLoadingCities(false);
    }
  };

  const handleZipBlur = async () => {
    const digits = zipCodeValue.replace(/\D/g, '');
    if (digits.length !== 8) return;

    setLoadingCep(true);
    setMessage(null);
    try {
      const address = await coreApi.getAddressByCep(digits);
      setForm((prev) => ({
        ...prev,
        address_zip_code: address.cep,
        address_line: address.street,
        address_city: address.city,
        address_state: address.state,
      }));
      setCities(await coreApi.listCities(address.state));
    } catch {
      setMessage('Não foi possível buscar o endereço pelo CEP informado.');
    } finally {
      setLoadingCep(false);
    }
  };

  const handleLogoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const logo_bytes = await fileToBase64(file);
    setForm((prev) => ({ ...prev, logo_bytes }));
    event.target.value = '';
  };

  const isValidHex = (value: string) => /^#([0-9A-F]{3}|[0-9A-F]{6})$/.test(value);
  const handleHexChange = (key: string, rawValue: string) => {
    let value = rawValue.toUpperCase().replace(/[^#0-9A-F]/g, '');
    if (value && !value.startsWith('#')) value = `#${value}`;
    if (value.length > 7) value = value.slice(0, 7);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const street = String(form.address_line ?? form.address ?? '').trim();
      const number = addressNumber.trim();
      const payload: Partial<Agency> = {
        legal_name: String(form.legal_name ?? form.name ?? ''),
        trade_name: String(form.trade_name ?? ''),
        tax_id: String(form.tax_id ?? form.cnpj ?? ''),
        email: String(form.email ?? ''),
        phone: String(form.phone ?? ''),
        website: String(form.website ?? ''),
        instagram: String(form.instagram ?? ''),
        logo_bytes: form.logo_bytes ?? null,
        primary_color: String(form.primary_color ?? ''),
        secondary_color: String(form.secondary_color ?? ''),
        tertiary_color: String(form.tertiary_color ?? ''),
        quaternary_color: String(form.quaternary_color ?? ''),
        address_zip_code: String(form.address_zip_code ?? form.zip_code ?? ''),
        address_line: number ? `${street}, ${number}` : street,
        address_state: String(form.address_state ?? form.state ?? ''),
        address_city: String(form.address_city ?? form.city ?? ''),
      };

      const updated = await coreApi.updateAgency(payload);
      const parsed = splitAddressLine(String(updated.address_line ?? ''));
      setForm({ ...updated, address_line: parsed.street });
      setAddressNumber(parsed.number);
      setMessage('Configurações da agência atualizadas com sucesso.');
    } catch {
      setMessage('Erro ao salvar configurações da agência.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Card title='Agência'>Carregando configurações...</Card>;
  }

  const colors = [
    { key: 'primary_color', label: 'Primária', fallback: '#101828' },
    { key: 'secondary_color', label: 'Secundária', fallback: '#F5A524' },
    { key: 'tertiary_color', label: 'Terciária', fallback: '#22C55E' },
    { key: 'quaternary_color', label: 'Quaternária', fallback: '#2563EB' },
  ] as const;

  return (
    <Card title='Configurações da Agência' subtitle='Permissão: ADMIN ou DIRETOR'>
      <form className='grid gap-4 md:grid-cols-12' onSubmit={onSubmit}>
        <div className='md:col-span-6'>
          <Input
            label='Nome da empresa'
            value={String(form.legal_name ?? form.name ?? '')}
            onChange={(event) => setForm((prev) => ({ ...prev, legal_name: event.target.value }))}
          />
        </div>
        <div className='md:col-span-6'>
          <Input
            label='Nome fantasia'
            value={String(form.trade_name ?? '')}
            onChange={(event) => setForm((prev) => ({ ...prev, trade_name: event.target.value }))}
          />
        </div>

        <div className='md:col-span-6'>
          <Input
            label='CNPJ'
            value={String(form.tax_id ?? form.cnpj ?? '')}
            onChange={(event) => setForm((prev) => ({ ...prev, tax_id: event.target.value }))}
          />
        </div>
        <div className='md:col-span-6'>
          <Input
            label='Telefone'
            value={String(form.phone ?? '')}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
          />
        </div>

        <div className='md:col-span-4'>
          <Input
            label='E-mail'
            type='email'
            value={String(form.email ?? '')}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
        </div>
        <div className='md:col-span-4'>
          <Input
            label='Website'
            value={String(form.website ?? '')}
            onChange={(event) => setForm((prev) => ({ ...prev, website: event.target.value }))}
          />
        </div>
        <div className='md:col-span-4'>
          <Input
            label='Instagram'
            value={String(form.instagram ?? '')}
            onChange={(event) => setForm((prev) => ({ ...prev, instagram: event.target.value }))}
          />
        </div>

        <div className='md:col-span-1'>
          <Input
            label='CEP'
            value={zipCodeValue}
            onChange={(event) => setForm((prev) => ({ ...prev, address_zip_code: event.target.value }))}
            onBlur={handleZipBlur}
          />
          {loadingCep ? <p className='mt-1 text-xs text-slate-500'>Buscando CEP...</p> : null}
        </div>
        <div className='md:col-span-2'>
          <Input
            label='Endereço'
            value={String(form.address_line ?? form.address ?? '')}
            onChange={(event) => setForm((prev) => ({ ...prev, address_line: event.target.value }))}
          />
        </div>
        <div className='md:col-span-1'>
          <Input label='Nº' value={addressNumber} onChange={(event) => setAddressNumber(event.target.value)} />
        </div>
        <div className='md:col-span-4'>
          <Select label='Estado' value={stateValue} onChange={(event) => void handleStateChange(event.target.value)}>
            <option value=''>Selecione</option>
            {states.map((state) => (
              <option key={state.code} value={state.code}>
                {state.code} - {state.name}
              </option>
            ))}
          </Select>
        </div>
        <div className='md:col-span-4'>
          <Select
            label='Cidade'
            value={cityValue}
            onChange={(event) => setForm((prev) => ({ ...prev, address_city: event.target.value }))}
            disabled={!stateValue || loadingCities}
          >
            <option value=''>{loadingCities ? 'Carregando...' : 'Selecione'}</option>
            {cities.map((city) => (
              <option key={city.name} value={city.name}>
                {city.name}
              </option>
            ))}
          </Select>
        </div>

        <div className='md:col-span-12'>
          <span className='field-label'>Identidade visual</span>
          <div className='grid items-start gap-6 rounded-xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-12'>
            <div className='md:col-span-2'>
              <p className='mb-3 text-center text-sm font-medium text-slate-700'>Logo</p>
              <div className='mx-auto grid h-28 w-28 place-items-center rounded-2xl border border-slate-200 bg-white'>
                {logoPreview ? (
                  <img src={logoPreview} alt='Prévia da logo' className='h-24 w-24 rounded-xl object-cover' />
                ) : (
                  <span className='text-xs text-slate-500'>Sem logo</span>
                )}
              </div>
            </div>

            <div className='md:col-span-2'>
              <p className='mb-3 text-sm font-medium text-slate-700'>Arquivo da logo</p>
              <input type='file' accept='image/*' onChange={handleLogoChange} className='field-input' />
            </div>

            {colors.map((color) => {
              const value = String(form[color.key] ?? color.fallback);
              const previewColor = isValidHex(value) ? value : color.fallback;
              return (
                <div key={color.key} className='md:col-span-2'>
                  <p className='mb-3 text-center text-sm font-medium text-slate-700'>{color.label}</p>
                  <div className='flex flex-col items-center gap-2'>
                    <div className='h-11 w-11 rounded-lg border border-slate-300' style={{ backgroundColor: previewColor }} />
                    <Input
                      aria-label={`Cor ${color.label}`}
                      value={value}
                      onChange={(event) => handleHexChange(color.key, event.target.value)}
                      placeholder={color.fallback}
                      maxLength={7}
                      className='mx-auto max-w-[110px] px-2 text-center uppercase tracking-wide'
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className='md:col-span-12 flex items-center gap-3'>
          <Button disabled={saving}>{saving ? 'Salvando...' : 'Salvar configuração'}</Button>
          {message ? <p className='text-sm text-slate-500'>{message}</p> : null}
        </div>
      </form>
    </Card>
  );
}

