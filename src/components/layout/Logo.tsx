interface LogoProps {
  compact?: boolean;
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <div className='flex items-center gap-3'>
      <span className='grid h-11 w-11 place-items-center rounded-xl bg-brand-500 text-xl font-bold text-white'>
        JQ
      </span>
      {compact ? null : (
        <div>
          <p className='text-base text-slate-500'>Painel</p>
          <p className='text-lg font-semibold text-slate-900'>JAQ Studio</p>
        </div>
      )}
    </div>
  );
}


