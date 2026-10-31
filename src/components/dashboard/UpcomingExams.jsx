import { CalendarClock } from "lucide-react";
import Card from "../common/Card";
import SectionHeader from "../common/SectionHeader";
import Badge from "../common/Badge";
import SubjectIcon from "../common/SubjectIcon";
import { daysUntil, formatCountdown, formatShortDate } from "../../lib/utils";

export default function UpcomingExams({ exams, subjects }) {
  const upcoming = exams
    .filter((e) => new Date(e.date + "T00:00:00") > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <Card>
      <SectionHeader title="Próximas avaliações" subtitle="Contagem regressiva" />
      {upcoming.length === 0 ? (
        <p className="text-sm text-muted">Nenhuma avaliação futura cadastrada.</p>
      ) : (
        <ul className="space-y-3">
          {upcoming.map((exam) => {
            const subject = subjects.find((s) => s.id === exam.subjectId);
            const color = subject?.color || "#C58FA3";
            const days = daysUntil(exam.date);
            const tone = days < 7 ? "rose" : "neutral";
            return (
              <li key={exam.id} className="rounded-2xl border border-rose/20 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{exam.name}</p>
                    <p className="text-xs text-muted">{subject?.name}</p>
                  </div>
                  <Badge tone={tone}>{formatCountdown(exam.date)}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(exam.content || []).map((item) => (
                    <span key={item} className="rounded-full bg-sakura/60 px-2.5 py-1 text-[11px] font-medium text-petal">
                      {item}
                    </span>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
