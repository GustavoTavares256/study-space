import { useEffect } from "react";
import { X } from "lucide-react";
import { cx } from "../../lib/utils";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) {
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        className={cx("relative h-study-card w-full bg-white p-6 shadow-soft max-h-[90vh] overflow-y-auto rounded-3xl", sizes[size])}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h3 className="h-study-display text-xl font-semibold text-ink">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-inkSoft transition hover:bg-sakura hover:text-ink"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
