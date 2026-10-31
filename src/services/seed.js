import { storage, storageKeys } from "./storage";

const DAY_MS = 86400000;

function isoOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export const SUBJECTS_SEED = [
  {
    id: "subj-matematica",
    name: "Matemática",
    color: "#C58FA3",
    icon: "Sigma",
    description: "Álgebra, geometria e preparação para a prova de aplicação.",
    progress: 0.55,
    createdAt: new Date().toISOString(),
  },
  {
    id: "subj-biologia",
    name: "Biologia",
    color: "#A8B99C",
    icon: "Leaf",
    description: "Células, genética e ecologia. Base para a matéria de ciências.",
    progress: 0.4,
    createdAt: new Date().toISOString(),
  },
  {
    id: "subj-historia",
    name: "História",
    color: "#D9A6B8",
    icon: "Landmark",
    description: "Períodos estudados no semestre e fichamentos de capa.",
    progress: 0.3,
    createdAt: new Date().toISOString(),
  },
  {
    id: "subj-portugues",
    name: "Português",
    color: "#B4768C",
    icon: "PenLine",
    description: "Gramática, interpretação de texto e redação.",
    progress: 0.65,
    createdAt: new Date().toISOString(),
  },
];

export const TASKS_SEED = [
  {
    id: "task-1",
    title: "Revisar limites e derivadas",
    description: "Fazer 10 exercícios de regra de limite e 5 de derivada.",
    subjectId: "subj-matematica",
    status: "em andamento",
    priority: "alta",
    dueDate: isoOffset(1),
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Fazer ficha de célula",
    description: "Organizar o conteúdo de procariócitos com desenhos.",
    subjectId: "subj-biologia",
    status: "pendente",
    priority: "media",
    dueDate: isoOffset(2),
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Leitura: capítulo sobre Revolução Industrial",
    description: "",
    subjectId: "subj-historia",
    status: "pendente",
    priority: "baixa",
    dueDate: isoOffset(4),
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-4",
    title: "Entregar redação escolar",
    description: "Estrutura dissertativa com introdução, desenvolvimento e conclusão.",
    subjectId: "subj-portugues",
    status: "concluida",
    priority: "alta",
    dueDate: isoOffset(-2),
    createdAt: new Date().toISOString(),
  },
];

export const EXAMS_SEED = [
  {
    id: "exam-1",
    name: "Prova de Biologia",
    subjectId: "subj-biologia",
    date: isoOffset(12),
    content: ["Células e organelas", "Genética mendeliana", "Ecologia"],
    prepLevel: 2,
  },
  {
    id: "exam-2",
    name: "Avaliação de Matemática",
    subjectId: "subj-matematica",
    date: isoOffset(19),
    content: ["Funções", "Trigonometria", "Geometria"],
    prepLevel: 3,
  },
];

export const NOTES_SEED = [
  {
    id: "note-1",
    title: "Foco da semana",
    subjectId: "subj-matematica",
    content: "Dominar limites antes da avaliação. Revisar derivadas com graficos.",
    createdAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
  },
  {
    id: "note-2",
    title: "Ideias de estudo",
    subjectId: "subj-biologia",
    content: "Fazer diagramas de fotossíntese. Memorizar nomes de vírus.",
    createdAt: new Date(Date.now() - 5 * 24 * 3600000).toISOString(),
  },
];

export const GOALS_SEED = [
  {
    id: "goal-1",
    title: "Estudar matemática 3x na semana",
    description: "Resolução de exercícios e revisão de conteúdo.",
    deadline: isoOffset(30),
    progress: 60,
    status: "em andamento",
  },
  {
    id: "goal-2",
    title: "Concluir todas as tarefas pendentes",
    description: "Organizar a semana sem deixar tarefas para o fim.",
    deadline: isoOffset(14),
    progress: 25,
    status: "em andamento",
  },
];

export const SCHEDULE_SEED = [
  {
    id: "sch-1",
    subjectId: "subj-matematica",
    day: 0, // segunda-feira
    start: "19:00",
    end: "20:30",
    description: "Limites e derivadas",
    status: "concluida",
  },
  {
    id: "sch-2",
    subjectId: "subj-biologia",
    day: 2, // quarta-feira
    start: "18:30",
    end: "20:00",
    description: "Ficha de célula e genética",
    status: "pendente",
  },
  {
    id: "sch-3",
    subjectId: "subj-portugues",
    day: 3, // quinta-feira
    start: "17:00",
    end: "18:00",
    description: "Gramática e redação",
    status: "pendente",
  },
];

export function loadInitialData() {
  return {
    subjects: storage.get(storageKeys.subjects, SUBJECTS_SEED),
    tasks: storage.get(storageKeys.tasks, TASKS_SEED),
    exams: storage.get(storageKeys.exams, EXAMS_SEED),
    notes: storage.get(storageKeys.notes, NOTES_SEED),
    goals: storage.get(storageKeys.goals, GOALS_SEED),
    schedule: storage.get(storageKeys.schedule, SCHEDULE_SEED),
  };
}

export function saveCollection(key, value) {
  storage.set(storageKeys[key], value);
}

export { DAY_MS };
