interface StatusBadgeProps {
  active?: boolean;
}

export function StatusBadge({ active = true }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        active ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
      }`}
    >
      {active ? 'Ativo' : 'Inativo'}
    </span>
  );
}

