import { cx } from "../../lib/utils";

export default function Button({
  variant = "primary",
  size = "md",
  className,
  loading,
  children,
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-rose/25 disabled:opacity-60 disabled:pointer-events-none active:scale-[0.98]";

  const variants = {
    primary: "bg-petal text-white shadow-rose hover:brightness-90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
    ghost: "bg-white/70 border border-rose/40 text-petal hover:bg-sakura",
    subtle: "bg-sakura text-petal hover:bg-rose/40",
    danger: "bg-white border border-rose/40 text-petal hover:bg-rose hover:text-white",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-4 text-base",
  };

  return (
    <button
      className={cx(base, variants[variant] || variants.primary, sizes[size] || sizes.md, className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : null}
      {children}
    </button>
  );
}
