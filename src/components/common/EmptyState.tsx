interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className='rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center'>
      <p className='font-medium text-slate-800'>{title}</p>
      <p className='mt-1 text-sm leading-6 text-slate-500'>{description}</p>
    </div>
  );
}

