import { useEffect, useState } from "react";
import { Award } from "lucide-react";
import Card from "../common/Card";
import ProgressBar from "../common/ProgressBar";
import { storage, storageKeys } from "../../services/storage";

const ACHIEVEMENTS = [
  { id: "primeiro-passo", title: "Primeiro passo", description: "Concluir a primeira tarefa.", icon: Award },
  { id: "semente-aprendizado", title: "Semente de aprendizado", description: "Acumular 1 hora de estudo nesta semana.", icon: Award },
  { id: "meta-em-flor", title: "Meta em flor", description: "Concluir uma meta de estudo.", icon: Award },
];

export default function AchievementsCard({ stats }) {
  const [unlockedIds, setUnlockedIds] = useState(() => storage.get(storageKeys.achievements, []));

  const completedTasks = stats.completedTasks || 0;
  const hoursThisWeek = stats.hoursThisWeek || 0;
  const completedGoals = stats.completedGoals || 0;

  useEffect(() => {
    setUnlockedIds((prev) => {
      const next = [...prev];
      ACHIEVEMENTS.forEach((a) => {
        const unlockedNow =
          (a.id === "primeiro-passo" && completedTasks > 0) ||
          (a.id === "semente-aprendizado" && hoursThisWeek >= 1) ||
          (a.id === "meta-em-flor" && completedGoals > 0);
        if (unlockedNow && !next.includes(a.id)) next.push(a.id);
      });
      if (next.length !== prev.length) storage.set(storageKeys.achievements, next);
      return next.length === prev.length ? prev : next;
    });
  }, [completedTasks, hoursThisWeek, completedGoals]);

  return (
    <Card>
      <h3 className="h-study-display text-lg font-semibold text-ink">Conquistas</h3>
      <p className="mt-1 text-xs text-muted">Pequenas floresceres da sua jornada.</p>
      <ul className="mt-4 space-y-3">
        {ACHIEVEMENTS.map((a) => {
          const unlocked = unlockedIds.includes(a.id);
          const Icon = a.icon;
          return (
            <li key={a.id} className="flex items-center gap-3 rounded-2xl bg-sakura/40 p-3">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${unlocked ? "bg-petal text-white" : "bg-sakura text-petal"}`}>
                <Icon size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{a.title}</p>
                <p className="text-xs text-muted">{a.description}</p>
              </div>
              <div className="ml-auto w-16">
                <ProgressBar value={unlocked ? 100 : 0} color={unlocked ? "bg-petal" : "bg-rose/40"} />
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
