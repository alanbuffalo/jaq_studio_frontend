import { cn } from '../../utils/cn';

interface CardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Card({ title, subtitle, action, children, className }: CardProps) {
  return (
    <section className={cn('panel p-5 md:p-6', className)}>
      <header className='mb-5 flex flex-wrap items-start justify-between gap-3'>
        <div>
          <h2 className='text-lg font-semibold tracking-[-0.02em] text-slate-950'>{title}</h2>
          {subtitle ? <p className='mt-1 text-sm text-slate-500'>{subtitle}</p> : null}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

