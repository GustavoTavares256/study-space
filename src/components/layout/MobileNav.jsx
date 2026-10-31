import { NavLink } from "react-router-dom";
import { LayoutDashboard, CalendarDays, ListChecks, GraduationCap, NotebookPen } from "lucide-react";
import { cx } from "../../lib/utils";

const ITEMS = [
  { to: "/dashboard", label: "Início", icon: LayoutDashboard },
  { to: "/cronograma", label: "Cronograma", icon: CalendarDays },
  { to: "/tarefas", label: "Tarefas", icon: ListChecks },
  { to: "/provas", label: "Provas", icon: GraduationCap },
  { to: "/anotacoes", label: "Anotações", icon: NotebookPen },
];

export default function MobileNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 md:hidden">
      <div className="border-t border-rose/20 bg-white/90 backdrop-blur-xl px-2 pb-2 pt-2">
        <div className="grid grid-cols-5 gap-1">
          {ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cx(
                  "flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-semibold transition-colors duration-300",
                  isActive ? "text-petal" : "text-muted"
                )
              }
            >
              <Icon size={21} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
