import { Link } from "react-router-dom";
import { Flower2 } from "lucide-react";
import Avatar from "../common/Avatar";

export default function TopBar() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-rose/20 bg-cream/85 px-4 py-3 backdrop-blur-xl md:hidden">
      <Link to="/dashboard" className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-rose to-petal text-white shadow-rose">
          <Flower2 size={18} />
        </span>
        <span className="h-study-display text-base font-semibold text-ink">Her Study Space</span>
      </Link>
      <Link to="/configuracoes" aria-label="Abrir configurações">
        <Avatar name="Júlia" size="sm" />
      </Link>
    </header>
  );
}
