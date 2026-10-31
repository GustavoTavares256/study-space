import { cx } from "../../lib/utils";

export default function Textarea({ label, error, className, ...props }) {
  return (
    <div>
      {label ? <label className="h-study-label">{label}</label> : null}
      <textarea className={cx("h-study-input min-h-[96px] resize-y", className)} {...props} />
      {error ? <p className="mt-1.5 text-xs font-medium text-petal">{error}</p> : null}
    </div>
  );
}
