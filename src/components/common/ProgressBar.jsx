import { cx } from "../../lib/utils";

export default function ProgressBar({ value, className, color = "bg-petal" }) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className={cx("h-2.5 w-full overflow-hidden rounded-full bg-sakura", className)}>
      <div
        className={cx("h-full rounded-full transition-all duration-700 ease-out", color)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
