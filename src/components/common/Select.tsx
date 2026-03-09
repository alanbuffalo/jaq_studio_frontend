import { ChevronDown } from 'lucide-react';
import type { SelectHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, className, children, ...props }: SelectProps) {
  return (
    <label className='block'>
      {label ? <span className='field-label'>{label}</span> : null}
      <span className='relative block'>
        <select className={cn('field-input appearance-none pr-10', className)} {...props}>
          {children}
        </select>
        <ChevronDown size={16} className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400' />
      </span>
    </label>
  );
}

