import { Target } from "lucide-react";
import Card from "../common/Card";
import ProgressBar from "../common/ProgressBar";
import SectionHeader from "../common/SectionHeader";

export default function GoalProgress({ goals }) {
  const total = goals.length;
  const done = goals.filter((g) => g.status === "concluida" || Number(g.progress) >= 100).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <Card>
      <SectionHeader title="Metas em andamento" subtitle="Progresso geral das suas metas" />
      {total === 0 ? <p className="text-sm text-muted">Nenhuma meta cadastrada ainda.</p> : null}
      <div className="space-y-4">
        {goals.slice(0, 3).map((goal) => (
          <div key={goal.id}>
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <p className="truncate text-sm font-semibold text-ink">{goal.title}</p>
              <span className="text-xs font-bold text-petal">{Math.round(Number(goal.progress) || 0)}%</span>
            </div>
            <ProgressBar value={goal.progress} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-4 rounded-2xl bg-sakura/50 p-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-petal">
          <Target size={20} />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">Sua meta geral</p>
          <p className="text-xs text-muted">Meta média das metas ativas</p>
        </div>
        <div className="ml-auto">
          <p className="font-display text-2xl font-semibold text-petal">{percent}%</p>
        </div>
      </div>
    </Card>
  );
}
