import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, BellRing, RotateCcw, LogOut, User, Flower2 } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { TASKS_SEED, EXAMS_SEED, GOALS_SEED, SUBJECTS_SEED, NOTES_SEED, SCHEDULE_SEED } from "../../services/seed";
import { storage, storageKeys } from "../../services/storage";
import { isSupabaseConfigured } from "../../lib/supabase";

const NOTIF_KEY = "notifications";

const DEFAULT_NOTIFICATIONS = {
  taskReminders: true,
  examReminders: true,
  dailyReminder: false,
};

export default function Settings() {
  const { user, signOut, updateUser } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useLocalStorageState(NOTIF_KEY, DEFAULT_NOTIFICATIONS);
  const [, setTasks] = useLocalStorageState("tasks", TASKS_SEED);
  const [, setExams] = useLocalStorageState("exams", EXAMS_SEED);
  const [, setGoals] = useLocalStorageState("goals", GOALS_SEED);
  const [, setSubjects] = useLocalStorageState("subjects", SUBJECTS_SEED);
  const [, setNotes] = useLocalStorageState("notes", NOTES_SEED);
  const [, setSchedule] = useLocalStorageState("schedule", SCHEDULE_SEED);

  function toggleNotification(key) {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  }

  function handleSaveProfile(e) {
    e.preventDefault();
    if (name.trim().length < 2) return;
    updateUser({ name: name.trim() });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  function handleResetData() {
    storage.set(storageKeys.tasks, TASKS_SEED);
    storage.set(storageKeys.exams, EXAMS_SEED);
    storage.set(storageKeys.goals, GOALS_SEED);
    storage.set(storageKeys.subjects, SUBJECTS_SEED);
    storage.set(storageKeys.notes, NOTES_SEED);
    storage.set(storageKeys.schedule, SCHEDULE_SEED);
    setTasks(TASKS_SEED);
    setExams(EXAMS_SEED);
    setGoals(GOALS_SEED);
    setSubjects(SUBJECTS_SEED);
    setNotes(NOTES_SEED);
    setSchedule(SCHEDULE_SEED);
  }

  async function handleLogout() {
    await signOut();
    navigate("/login");
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-12 pt-0 md:pt-8">
      <div className="mb-6">
        <h1 className="h-study-display text-2xl font-semibold text-ink sm:text-3xl">Configurações</h1>
        <p className="mt-1 text-sm text-muted">Personalize sua experiência no espaço.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sakura text-petal">
              <User size={20} />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Perfil</h2>
              <p className="text-xs text-muted">{user?.email}</p>
            </div>
          </div>
          <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
            <label className="h-study-label">Nome</label>
            <input className="h-study-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
            <div className="flex items-center gap-3">
              <Button type="submit">Salvar</Button>
              {saved ? <span className="text-sm font-semibold text-sage">Salvo com carinho ✨</span> : null}
            </div>
          </form>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sakura text-petal">
              <Bell size={20} />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Notificações</h2>
              <p className="text-xs text-muted">Controle os lembretes da sua rotina.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {[
              { key: "taskReminders", label: "Lembretes de tarefas pendentes", desc: "Seu espaço está quieto quando você precisa agir." },
              { key: "examReminders", label: "Lembretes de avaliações", desc: "Contagem regressiva e preparação." },
              { key: "dailyReminder", label: "Lembrete do dia", desc: "Uma frase para começar o dia com calma." },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-3 rounded-2xl bg-sakura/40 p-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{item.label}</p>
                  <p className="text-xs text-muted">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggleNotification(item.key)}
                  role="switch"
                  aria-checked={Boolean(notifications[item.key])}
                  className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${notifications[item.key] ? "bg-petal" : "bg-rose/30"}`}
                >
                  <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${notifications[item.key] ? "left-6" : "left-1"}`} />
                </button>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sakura text-petal">
              <Flower2 size={20} />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-ink">Meu espaço</h2>
              <p className="text-xs text-muted">Dados e conta.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <button onClick={handleResetData} className="flex w-full items-center justify-between rounded-2xl border border-rose/30 bg-white/70 p-3 text-sm font-semibold text-petal transition hover:bg-sakura">
              <span className="inline-flex items-center gap-2">
                <RotateCcw size={16} /> Restaurar dados de demonstração
              </span>
            </button>
            <button onClick={handleLogout} className="flex w-full items-center justify-between rounded-2xl border border-rose/30 bg-white/70 p-3 text-sm font-semibold text-petal transition hover:bg-sakura">
              <span className="inline-flex items-center gap-2">
                <LogOut size={16} /> Sair da conta
              </span>
            </button>
          </div>
          <p className="mt-4 flex items-center gap-2 rounded-2xl bg-sakura/50 p-3 text-xs text-muted">
            <BellRing size={14} className="text-petal" />
            {isSupabaseConfigured
              ? "Conectado ao Supabase — dados em nuvem."
              : "Modo demonstração: dados salvos localmente. Supabase será integrado futuramente."}
          </p>
        </Card>
      </div>
    </div>
  );
}
