export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="panel-pad flex min-h-48 flex-col items-center justify-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon size={22} />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-ink">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  );
}
