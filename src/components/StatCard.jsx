export function StatCard({ icon: Icon, label, value, tone = "leaf", detail }) {
  const tones = {
    leaf: "bg-mint text-leaf",
    ember: "bg-orange-50 text-ember",
    saffron: "bg-yellow-50 text-yellow-700",
    ink: "bg-slate-100 text-ink"
  };

  return (
    <div className="panel-pad">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
          {detail ? <p className="mt-1 text-xs text-slate-500">{detail}</p> : null}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${tones[tone]}`}>
          <Icon size={21} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}
