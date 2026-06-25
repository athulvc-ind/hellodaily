import { titleCase } from "../utils/format.js";

const styles = {
  available: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  booked: "bg-amber-50 text-amber-700 ring-amber-200",
  occupied: "bg-orange-50 text-orange-700 ring-orange-200",
  maintenance: "bg-slate-100 text-slate-600 ring-slate-200",
  placed: "bg-sky-50 text-sky-700 ring-sky-200",
  accepted: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  preparing: "bg-orange-50 text-orange-700 ring-orange-200",
  ready: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  served: "bg-teal-50 text-teal-700 ring-teal-200",
  completed: "bg-slate-100 text-slate-700 ring-slate-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  failed: "bg-red-50 text-red-700 ring-red-200",
  confirmed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  inactive: "bg-slate-100 text-slate-600 ring-slate-200",
  "on-shift": "bg-teal-50 text-teal-700 ring-teal-200"
};

export function StatusBadge({ value }) {
  return (
    <span
      className={`inline-flex min-w-16 items-center justify-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
        styles[value] || "bg-slate-100 text-slate-700 ring-slate-200"
      }`}
    >
      {titleCase(value)}
    </span>
  );
}
