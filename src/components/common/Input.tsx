import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <label className='block'>
      {label ? <span className='field-label'>{label}</span> : null}
      <input className={cn('field-input', className)} {...props} />
      {error ? <span className='mt-1 block text-xs text-rose-500'>{error}</span> : null}
    </label>
  );
}

