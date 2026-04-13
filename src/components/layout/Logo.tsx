import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface LogoProps {
  compact?: boolean;
}

export function Logo({ compact = false }: LogoProps) {
  return (
    <Link to='/' className='inline-flex items-center gap-3'>
      <span className='grid size-10 place-items-center rounded-2xl bg-[#121826] text-[11px] font-bold tracking-[0.24em] text-white'>
        JAQ
      </span>
      <span className={cn('min-w-0 transition-all', compact ? 'hidden' : 'block')}>
        <span className='block text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400'>Studio</span>
        <span className='block text-base font-semibold text-slate-950'>Admin</span>
      </span>
    </Link>
  );
}
