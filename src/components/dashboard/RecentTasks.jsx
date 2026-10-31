import { Link } from "react-router-dom";
import { CheckCircle2, Trash2, CalendarDays } from "lucide-react";
import Card from "../common/Card";
import SectionHeader from "../common/SectionHeader";
import Badge from "../common/Badge";
import SubjectIcon from "../common/SubjectIcon";
import { cx, formatShortDate, isOverdue } from "../../lib/utils";

export default function RecentTasks({ tasks, subjects, onToggle, onDelete }) {
  const pending = tasks
    .filter((t) => t.status !== "concluida")
    .sort((a, b) => String(a.dueDate || "9999").localeCompare(String(b.dueDate || "9999")));

  return (
    <Card>
      <SectionHeader
        title="Tarefas recentes"
        subtitle="Suas pendências"
        action={
          <Link to="/tarefas" className="text-sm font-semibold text-petal hover:underline">
            Ver todas
          </Link>
        }
      />
      {pending.length === 0 ? (
        <p className="text-sm text-muted">Nenhuma tarefa pendente. Hora de florescer! 🌷</p>
      ) : (
        <ul className="space-y-2">
          {pending.slice(0, 4).map((task) => {
            const subject = subjects.find((s) => s.id === task.subjectId);
            const overdueTask = isOverdue(task);
            const dueSoon = task.dueDate && !overdueTask && (task.dueDate <= daysAhead(2));
            return (
              <li key={task.id} className="rounded-2xl border border-rose/20 p-3 transition hover:bg-sakura/40">
                <div className="flex items-start gap-2">
                  <button
                    onClick={() => onToggle(task)}
                    aria-label={task.status === "concluida" ? "Marcar como pendente" : "Marcar como concluída"}
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-petal bg-white text-white transition hover:bg-petal"
                  >
                    {task.status === "concluida" ? <CheckCircle2 size={14} /> : null}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{task.title}</p>
                    {task.description ? <p className="truncate text-xs text-muted">{task.description}</p> : null}
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      {subject ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-petal">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: subject.color }} />
                          {subject.name}
                        </span>
                      ) : null}
                      {task.dueDate ? (
                        <span className={cx("inline-flex items-center gap-1 text-xs font-semibold", overdueTask ? "text-petal" : dueSoon ? "text-amber-600" : "text-muted")}>
                          <CalendarDays size={12} /> {formatShortDate(task.dueDate)}
                        </span>
                      ) : null}
                      <Badge tone={task.priority === "alta" ? "rose" : task.priority === "media" ? "neutral" : "sage"}>{task.priority}</Badge>
                    </div>
                  </div>
                  <button onClick={() => onDelete(task.id)} aria-label="Excluir tarefa" className="rounded-full p-1.5 text-muted transition hover:bg-rose/30 hover:text-petal">
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

function daysAhead(n) {
  const now = new Date();
  const limit = new Date(now);
  limit.setDate(now.getDate() + n);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(limit.getFullYear(), limit.getMonth(), limit.getDate());
  return (target - today) / 86400000;
}
