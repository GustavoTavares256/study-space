import { cx } from "../../lib/utils";

export default function Avatar({ name, size = "md" }) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
  };
  const initials = (name || "J").trim().charAt(0).toUpperCase();
  return (
    <div className={cx("flex items-center justify-center rounded-full bg-gradient-to-br from-rose to-petal font-semibold text-white shadow-rose", sizes[size])}>
      {initials}
    </div>
  );
}
