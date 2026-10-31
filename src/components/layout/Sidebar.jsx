import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  ListChecks,
  GraduationCap,
  NotebookPen,
  Target,
  Settings,
  LogOut,
  Flower2,
  PanelLeft,
} from "lucide-react";
import { cx } from "../../lib/utils";
import Avatar from "../common/Avatar";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Início", icon: LayoutDashboard },
  { to: "/cronograma", label: "Cronograma", icon: CalendarDays },
  { to: "/materias", label: "Matérias", icon: BookOpen },
  { to: "/tarefas", label: "Tarefas", icon: ListChecks },
  { to: "/provas", label: "Provas", icon: GraduationCap },
  { to: "/anotacoes", label: "Anotações", icon: NotebookPen },
  { to: "/metas", label: "Metas", icon: Target },
  { to: "/configuracoes", label: "Configurações", icon: Settings },
];

export default function Sidebar({ open, onClose, onToggle }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 hidden md:flex flex-col border-r border-rose/20 bg-white/85 backdrop-blur-xl transition-all duration-300 ${
        open ? "w-72 p-5" : "w-20 p-4"
      }`}
    >
      <div className="mb-8 flex items-center gap-3 px-2">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose to-petal text-white shadow-rose">
          <Flower2 size={22} />
        </span>
        <div className={open ? "block" : "hidden"}>
          <p className="h-study-display text-lg font-semibold leading-tight text-ink">Her Study Space</p>
          <p className="text-xs text-muted">Jardim de estudos</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto h-scroll">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition-all duration-300 ${
                isActive ? "bg-petal text-white shadow-rose" : "text-muted hover:bg-sakura hover:text-ink"
              } ${open ? "" : "justify-center"}`
            }
          >
            <Icon size={20} className="shrink-0" />
            <span className={open ? "" : "hidden"}>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 rounded-3xl bg-sakura/50 p-3">
        <div className={open ? "flex items-center gap-2" : "flex flex-col items-center"}>
          <Avatar name="Júlia" size="md" />
          {open ? (
            <div>
              <p className="text-sm font-semibold text-ink">Júlia</p>
              <p className="truncate text-xs text-muted">julia@herstudios.space</p>
            </div>
          ) : null}
        </div>
        <button
          onClick={onToggle}
          aria-label={open ? "Recolher menu" : "Expandir menu"}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl px-2 py-2 text-xs font-semibold text-petal transition hover:bg-rose/30"
        >
          <PanelLeft size={16} className={open ? "" : "rotate-180"} />
          {open ? <span>Recolher</span> : <span className="hidden">Recolher</span>}
        </button>
      </div>
    </aside>
  );
}
