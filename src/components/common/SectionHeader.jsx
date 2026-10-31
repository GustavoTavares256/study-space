import { Sparkles } from "lucide-react";
import { cx } from "../../lib/utils";

export default function SectionHeader({ title, subtitle, action, className }) {
  return (
    <div className={cx("mb-4 flex items-end justify-between gap-3", className)}>
      <div>
        <h2 className="h-study-display text-xl font-semibold text-ink">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-sm text-muted">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
