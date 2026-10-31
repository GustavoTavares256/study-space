import { useMemo } from "react";
import { ListChecks, CheckCircle2, GraduationCap, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { TASKS_SEED, EXAMS_SEED, GOALS_SEED, SUBJECTS_SEED, SCHEDULE_SEED } from "../../services/seed";
import { addDays, getDayIndex, startOfDay } from "../../lib/utils";
import GreetingHeader from "../../components/dashboard/GreetingHeader";
import WeeklyChart from "../../components/dashboard/WeeklyChart";
import GoalProgress from "../../components/dashboard/GoalProgress";
import TodaySchedule from "../../components/dashboard/TodaySchedule";
import UpcomingExams from "../../components/dashboard/UpcomingExams";
import RecentTasks from "../../components/dashboard/RecentTasks";
import ReminderCard from "../../components/dashboard/ReminderCard";
import AchievementsCard from "../../components/dashboard/AchievementsCard";
import PomodoroTimer from "../../components/pomodoro/PomodoroTimer";
import StatCard from "../../components/common/StatCard";
import LogoSakura from "../../components/common/LogoSakura";

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useLocalStorageState("tasks", TASKS_SEED);
  const [exams, setExams] = useLocalStorageState("exams", EXAMS_SEED);
  const [goals, setGoals] = useLocalStorageState("goals", GOALS_SEED);
  const [subjects] = useLocalStorageState("subjects", SUBJECTS_SEED);
  const [schedule] = useLocalStorageState("schedule", SCHEDULE_SEED);

  const todayIndex = getDayIndex(new Date());

  const pendingTasks = tasks.filter((t) => t.status !== "concluida");
  const completedTasks = tasks.filter((t) => t.status === "concluida");
  const upcomingExams = exams
    .filter((e) => new Date(e.date + "T00:00:00") > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const taskCompletion = tasks.length === 0 ? 0 : Math.round((completedTasks.length / tasks.length) * 100);

  const monday = addDays(startOfDay(new Date()), -todayIndex);
  const weekSessions = schedule.filter((s) => {
    const d = addDays(monday, s.day);
    const weekEnd = addDays(monday, 7);
    return d >= monday && d < weekEnd;
  });

  const hoursThisWeek = weekSessions.reduce((acc, s) => {
    const start = parseInt(s.start?.slice(0, 2) || "0", 10) * 60;
    const end = parseInt(s.end?.slice(0, 2) || "0", 10) * 60;
    const mins = Math.max(0, end - start);
    return acc + mins / 60;
  }, 0);

  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const dayDate = addDays(startOfDay(new Date()), -i);
      const daySessions = schedule.filter((s) => {
        const d = addDays(monday, s.day);
        return d.getFullYear() === dayDate.getFullYear() && d.getMonth() === dayDate.getMonth() && d.getDate() === dayDate.getDate();
      });
      const hours = daySessions.reduce((acc, s) => {
        const start = parseInt(s.start?.slice(0, 2) || "0", 10) * 60;
        const end = parseInt(s.end?.slice(0, 2) || "0", 10) * 60;
        return acc + Math.max(0, end - start) / 60;
      }, 0);
      days.push({ label: dayDate.toLocaleDateString("pt-BR", { weekday: "short" }), hours: Number(hours.toFixed(1)) });
    }
    return days;
  }, [schedule, monday]);

  const stats = {
    completedTasks: completedTasks.length,
    hoursThisWeek,
    completedGoals: goals.filter((g) => g.status === "concluida" || Number(g.progress) >= 100).length,
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-0 md:pt-8">
      <div className="flex flex-col items-center gap-3 mb-8 md:mb-10">
        <LogoSakura size={44} className="md:size-56 md:mb-2" />
        <span className="h-study-display text-xl font-semibold text-ink md:text-2xl tracking-tight">
          Seu jardim particular de estudos 🌸
        </span>
        <div className="h-[1px] w-24 md:w-32 bg-rose/30 rounded-full mx-4" />
      </div>
      <GreetingHeader user={user} tasks={tasks} exams={exams} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={ListChecks} label="Tarefas pendentes" value={pendingTasks.length} tone="rose" hint={`${completedTasks.length} concluídas no total`} />
        <StatCard icon={CheckCircle2} label="Tarefas concluídas" value={completedTasks.length} tone="sage" hint={`${taskCompletion}% de conclusão`} />
        <StatCard icon={GraduationCap} label="Próximas provas" value={upcomingExams.length} tone="petal" hint="Próximas avaliações" />
        <StatCard icon={Clock} label="Horas estudadas" value={hoursThisWeek.toFixed(1)} tone="neutral" hint="Nesta semana" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WeeklyChart data={weeklyData} />
        </div>
        <div className="lg:col-span-1">
          <GoalProgress goals={goals} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TodaySchedule schedule={schedule} subjects={subjects} todayIndex={todayIndex} />
        </div>
        <div className="lg:col-span-1">
          <PomodoroTimer />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UpcomingExams exams={exams} subjects={subjects} />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-1">
          <RecentTasks tasks={tasks} subjects={subjects} onToggle={toggleTask} onDelete={deleteTask} />
          <ReminderCard />
        </div>
      </div>

      <div className="mt-6">
        <AchievementsCard stats={stats} />
      </div>
    </div>
  );

  function toggleTask(task) {
    setTasks(
      tasks.map((t) => (t.id === task.id ? { ...t, status: t.status === "concluida" ? "pendente" : "concluida" } : t))
    );
  }

  function deleteTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }
}
