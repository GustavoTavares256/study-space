import { cx } from "../../lib/utils";

const tones = {
  rose: "bg-rose/30 text-petal",
  sage: "bg-sage/30 text-[#6B7F5E]",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-rose/40 text-petal",
  neutral: "bg-sakura text-petal",
};

export default function Badge({ tone = "neutral", className, children }) {
  return <span className={cx("h-study-chip rounded-full px-3 py-1 text-xs font-semibold", tones[tone] || tones.neutral, className)}>{children}</span>;
}
