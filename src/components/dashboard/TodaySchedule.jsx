import { Clock } from "lucide-react";
import Card from "../common/Card";
import SectionHeader from "../common/SectionHeader";
import SubjectIcon from "../common/SubjectIcon";
import Badge from "../common/Badge";
import { WEEKDAY_SHORT } from "../../lib/utils";

export default function TodaySchedule({ schedule, subjects, todayIndex }) {
  const sessions = schedule
    .filter((s) => s.day === todayIndex)
    .sort((a, b) => a.start.localeCompare(b.start));

  return (
    <Card>
      <SectionHeader title="Cronograma de hoje" subtitle={WEEKDAY_SHORT[todayIndex]} />
      {sessions.length === 0 ? (
        <p className="text-sm text-muted">Nenhuma atividade programada para hoje. Aproveite o silêncio 🌸</p>
      ) : (
        <ul className="space-y-3">
          {sessions.map((session) => {
            const subject = subjects.find((s) => s.id === session.subjectId);
            const color = subject?.color || "#C58FA3";
            return (
              <li key={session.id} className="flex items-center gap-3 rounded-2xl bg-sakura/40 p-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${color}22` }}>
                  <SubjectIcon icon={subject?.icon} size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{session.description || subject?.name}</p>
                  <p className="text-xs text-muted">{subject?.name} · {session.start} – {session.end}</p>
                </div>
                <Badge tone={session.status === "concluida" ? "sage" : "neutral"}>{session.status === "concluida" ? "Feita" : "Pendente"}</Badge>
              </li>
            );
          })}
        </ul>
      )}
      <div className="mt-4 flex items-center gap-2 text-xs text-muted">
        <Clock size={14} /> Sessões finalizadas aparecem em verde.
      </div>
    </Card>
  );
}
