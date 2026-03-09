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
    <section className={cn('panel animate-fadeInUp p-5 md:p-6', className)}>
      <header className='mb-4 flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h2 className='text-lg font-semibold text-slate-900'>{title}</h2>
          {subtitle ? <p className='text-sm text-slate-500'>{subtitle}</p> : null}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

