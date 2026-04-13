import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'outline' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const styles: Record<Variant, string> = {
  primary:
    'border border-transparent bg-[linear-gradient(135deg,#121826_0%,#243044_100%)] text-white shadow-[0_14px_24px_rgba(18,24,38,0.12)] hover:translate-y-[-1px] hover:shadow-[0_18px_30px_rgba(18,24,38,0.16)]',
  outline: 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
  danger: 'border border-transparent bg-rose-500 text-white hover:bg-rose-600',
  ghost: 'border border-transparent bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950',
};

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-60',
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}

