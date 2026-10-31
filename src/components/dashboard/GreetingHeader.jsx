import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CalendarClock, AlertCircle } from "lucide-react";
import Avatar from "../common/Avatar";
import { cx, formatShortDate, formatLongDate, greeting, isOverdue, motivationalMessage, toISODate } from "../../lib/utils";

export default function GreetingHeader({ user, tasks, exams }) {
  const [open, setOpen] = useState(false);
  const bellRef = useRef(null);
  const navigate = useNavigate();
  const today = new Date();
  const motivational = motivationalMessage();

  useEffect(() => {
    if (!open) return undefined;
    function onClickOutside(e) {
      if (bellRef.current && !bellRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const pending = tasks.filter((t) => t.status !== "concluida");
  const overdue = pending.filter((t) => isOverdue(t));
  const dueToday = pending.filter((t) => {
    if (!t.dueDate) return false;
    const due = new Date(t.dueDate + "T00:00:00");
    const now = new Date();
    return due.getDate() === now.getDate() && due.getMonth() === now.getMonth() && due.getFullYear() === now.getFullYear();
  });
  const upcomingExams = exams
    .filter((e) => new Date(e.date + "T00:00:00") > today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const notifications = [
    ...overdue.map((t) => ({
      id: `overdue-${t.id}`,
      icon: AlertCircle,
      tone: "rose",
      title: "Tarefa atrasada",
      description: t.title,
      date: t.dueDate,
      to: "/tarefas",
    })),
    ...dueToday.map((t) => ({
      id: `today-${t.id}`,
      icon: CalendarClock,
      tone: "amber",
      title: "Entrega de hoje",
      description: t.title,
      date: t.dueDate,
      to: "/tarefas",
    })),
    ...upcomingExams.map((e) => ({
      id: `exam-${e.id}`,
      icon: Bell,
      tone: "sage",
      title: "Avaliação próxima",
      description: `${e.name} — ${formatShortDate(e.date)}`,
      date: e.date,
      to: "/provas",
    })),
  ];

  const unread = notifications.length;

  return (
    <header className="mb-6 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <h1 className="h-study-display text-2xl font-semibold text-ink sm:text-3xl">
            {greeting()}, {user?.name?.split(" ")[0] || "Júlia"}! 🌸
          </h1>
          <Avatar name={user?.name || "Júlia"} size="lg" />
        </div>
        <p className="mt-2 text-sm font-medium capitalize text-muted">{formatLongDate(toISODate(new Date()))}</p>
        <p className="mt-1 text-sm text-muted">{motivational}</p>
      </div>

      <div className="relative shrink-0" ref={bellRef}>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Notificações"
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-petal shadow-soft border border-rose/30 transition hover:bg-sakura"
        >
          <Bell size={20} />
          {unread > 0 ? <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-petal text-[10px] font-bold text-white">{unread}</span> : null}
        </button>

        {open ? (
          <div className="absolute right-0 z-40 mt-2 w-80 rounded-3xl border border-rose/30 bg-white p-3 shadow-soft">
            <p className="px-2 pb-2 text-sm font-semibold text-ink">Notificações</p>
            {notifications.length === 0 ? (
              <p className="px-2 py-4 text-center text-sm text-muted">Tudo tranquilo por aqui 🌷</p>
            ) : (
              <ul className="max-h-80 space-y-1 overflow-y-auto">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      onClick={() => {
                        setOpen(false);
                        navigate(n.to);
                      }}
                      className="flex w-full items-start gap-3 rounded-2xl p-2 text-left transition hover:bg-sakura"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sakura text-petal">
                        <n.icon size={16} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-ink">{n.title}</span>
                        <span className="block truncate text-xs text-muted">{n.description}</span>
                        {n.date ? <span className="block text-[11px] text-muted">{formatShortDate(n.date)}</span> : null}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </div>
    </header>
  );
}
