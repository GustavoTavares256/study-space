import { Mail, Lock } from "lucide-react";
import { cx } from "../../lib/utils";

export default function Input({ label, error, className, icon: Icon, ...props }) {
  return (
    <div>
      {label ? <label className="h-study-label">{label}</label> : null}
      <div className="relative">
        {Icon ? <Icon size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-petal" /> : null}
        <input className={cx("h-study-input", Icon ? "pl-11" : "", className)} {...props} />
      </div>
      {error ? <p className="mt-1.5 text-xs font-medium text-petal">{error}</p> : null}
    </div>
  );
}
