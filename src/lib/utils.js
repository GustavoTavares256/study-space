export const SUBJECT_COLORS = [
  "#C58FA3",
  "#D9A6B8",
  "#A8B99C",
  "#B4768C",
  "#C9A86A",
  "#97A8BC",
];

export const SUBJECT_ICONS = [
  "BookOpen",
  "FlaskConical",
  "Palette",
  "Landmark",
  "Sigma",
  "Leaf",
  "PenLine",
  "Music",
];

export const MOTIVATIONAL_PHRASES = [
  "Não precisa ser perfeito. Só precisa continuar. 🌷",
  "Cada página virada é uma vitória pequena. 🌸",
  "A calma de hoje é o foco de amanhã.",
  "Devagar, mas com carinho. O conhecimento cresce aos poucos.",
  "Um minuto de foco vale mais que uma hora de distração.",
  "A sua mente é um jardim: regue com constância. 🌷",
  "Hoje é um bom dia para aprender algo novo.",
  "Respire fundo. Você está no seu próprio santuário.",
  "A melhora é silenciosa e chega antes do esperado.",
  "Foque na qualidade, não na quantidade. A júlio é paciente o suficiente.",
];

export const DEFAULT_PREP_LEVEL = 2;

export const WEEKDAY_LABELS = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];

export const WEEKDAY_SHORT = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export function getDayIndex(date) {
  const d = new Date(date);
  return (d.getDay() + 6) % 7;
}

export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function toISODate(date) {
  const d = typeof date === "string" ? new Date(date + "T00:00:00") : date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date, amount) {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

export function todayISO() {
  return toISODate(new Date());
}

export function isOverdue(task) {
  if (!task) return false;
  if (task.status === "concluida") return false;
  const due = task.dueDate || task.due || task.date;
  if (!due) return false;
  const dueISO = typeof due === "string" ? due.slice(0, 10) : toISODate(due);
  return dueISO < todayISO();
}

export function daysUntil(date) {
  const target = startOfDay(new Date(date));
  const now = startOfDay(new Date());
  const diff = Math.round((target - now) / 86400000);
  return diff;
}

export function formatLongDate(date) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date + "T00:00:00") : new Date(date);
  return d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export function formatShortDate(date) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date + "T00:00:00") : new Date(date);
  return d.toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
}

export function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function motivationalMessage() {
  const hour = new Date().getHours();
  const pool = MOTIVATIONAL_PHRASES;
  let index = Math.abs(hour * 7 + new Date().getDate() * 3);
  const phrase = pool[index % pool.length];
  return phrase;
}

export function randomPhrase() {
  return MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];
}

export function formatCountdown(targetDate) {
  const diffDays = daysUntil(targetDate);
  if (diffDays < 0) {
    const overdue = Math.abs(diffDays);
    return `Atrasada em ${overdue} dia${overdue === 1 ? "" : "s"}`;
  }
  const diffMs = new Date(targetDate).getTime() - new Date().getTime();
  const hours = Math.floor(diffMs / 3600000);
  const days = Math.floor(hours / 24);
  const restHours = hours % 24;
  if (days === 0) {
    if (restHours === 0) return "Faltam algumas horas";
    return `Faltam ${restHours} hora${restHours === 1 ? "" : "s"}`;
  }
  return `Faltam ${days} dia${days === 1 ? "" : "s"}`;
}

export function formatTimer(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
