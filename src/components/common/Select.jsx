import { cx } from "../../lib/utils";

export default function Select({ label, error, className, children, ...props }) {
  return (
    <div>
      {label ? <label className="h-study-label">{label}</label> : null}
      <select className={cx("h-study-input", className)} {...props}>
        {children}
      </select>
      {error ? <p className="mt-1.5 text-xs font-medium text-petal">{error}</p> : null}
    </div>
  );
}
