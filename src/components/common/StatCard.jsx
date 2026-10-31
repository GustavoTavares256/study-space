import { cx } from "../../lib/utils";

export default function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "rose",
  trend,
}) {
  const accents = {
    rose: "bg-sakura text-petal",
    sage: "bg-sage/25 text-[#6B7F5E]",
    roseDeep: "bg-rose/40 text-petal",
    neutral: "bg-sakura text-petal",
  };
  return (
    <div className="h-study-card group flex items-start gap-4 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
      <div className={cx("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105", accents[tone] || accents.rose)}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-1 font-display text-3xl font-semibold text-ink">{value}</p>
        {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
        {trend ? <p className="mt-1 text-xs font-semibold text-sage">{trend}</p> : null}
      </div>
    </div>
  );
}
