import { useMemo, useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Trash2, Pencil } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Textarea from "../../components/common/Textarea";
import SubjectIcon from "../../components/common/SubjectIcon";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { SCHEDULE_SEED, SUBJECTS_SEED } from "../../services/seed";
import { addDays, startOfDay, WEEKDAY_SHORT, WEEKDAY_LABELS, getDayIndex } from "../../lib/utils";
import { createItem, updateItem, deleteItem, newId } from "../../services/data";

const emptyForm = { subjectId: "", day: 0, start: "19:00", end: "20:30", description: "", status: "pendente" };

export default function Schedule() {
  const [schedule, setSchedule] = useLocalStorageState("schedule", SCHEDULE_SEED);
  const [subjects] = useLocalStorageState("subjects", SUBJECTS_SEED);

  const [weekStart, setWeekStart] = useState(() => {
    const today = startOfDay(new Date());
    const monday = addDays(today, -getDayIndex(today));
    return monday;
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const weekSessions = useMemo(() => {
    const list = [];
    days.forEach((day, index) => {
      schedule.filter((s) => s.day === index).forEach((s) => {
        list.push({ ...s, date: day.toISOString().slice(0, 10) });
      });
    });
    return list;
  }, [days, schedule]);

  function openCreate(dayIndex) {
    setEditingId(null);
    setForm({ ...emptyForm, day: dayIndex });
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(session) {
    setEditingId(session.id);
    setForm({
      subjectId: session.subjectId,
      day: session.day,
      start: session.start,
      end: session.end,
      description: session.description || "",
      status: session.status || "pendente",
    });
    setErrors({});
    setModalOpen(true);
  }

  function handleSave(e) {
    e.preventDefault();
    const next = { ...form };
    const nextErrors = {};
    if (!next.subjectId) nextErrors.subjectId = "Escolha a matéria.";
    if (!next.start || !next.end) nextErrors.times = "Informe início e término.";
    else if (next.end <= next.start) nextErrors.times = "O término deve ser depois do início.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (editingId) {
      setSchedule(updateItem(schedule, editingId, { ...next, id: editingId }));
    } else {
      const session = { ...next, id: newId() };
      setSchedule(createItem(schedule, session));
    }
    setModalOpen(false);
    setEditingId(null);
  }

  function handleDelete() {
    if (deletingId) setSchedule(deleteItem(schedule, deletingId));
    setDeletingId(null);
  }

  const deletingSession = schedule.find((s) => s.id === deletingId);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-0 md:pt-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h-study-display text-2xl font-semibold text-ink sm:text-3xl">Cronograma</h1>
          <p className="mt-1 text-sm text-muted">Organize suas sessões de estudo · Segunda a domingo</p>
        </div>
        <Button onClick={() => openCreate(getDayIndex(new Date()))}>
          <Plus size={18} /> Nova sessão
        </Button>
      </div>

      <Card className="mb-6">
        <div className="flex items-center justify-between gap-3">
          <button onClick={() => setWeekStart(addDays(weekStart, -7))} aria-label="Semana anterior" className="rounded-2xl bg-white border border-rose/30 p-2.5 text-petal transition hover:bg-sakura">
            <ChevronLeft size={18} />
          </button>
          <div className="text-center">
            <p className="font-display text-lg font-semibold text-ink">{WEEKDAY_SHORT[0]} {startOfDay(weekStart).getDate()}</p>
            <p className="text-xs text-muted">até {WEEKDAY_SHORT[6]} {addDays(weekStart, 6).getDate()}</p>
          </div>
          <button onClick={() => setWeekStart(addDays(weekStart, 7))} aria-label="Próxima semana" className="rounded-2xl bg-white border border-rose/30 p-2.5 text-petal transition hover:bg-sakura">
            <ChevronRight size={18} />
          </button>
        </div>
      </Card>

      <div className="h-scroll">
        <div className="min-w-[720px]">
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, i) => (
              <div key={day.toISOString()} className={`rounded-2xl p-2 text-center ${i === getDayIndex(new Date()) ? "bg-sakura/60" : "bg-white/70"}`}>
                <p className="text-xs font-bold uppercase tracking-wide text-petal">{WEEKDAY_SHORT[i]}</p>
                <p className="mt-0.5 font-display text-lg font-semibold text-ink">{day.getDate()}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {days.map((day, i) => {
              const daySessions = weekSessions.filter((s) => s.date === day.toISOString().slice(0, 10));
              return (
                <div key={day.toISOString()} className="min-h-[180px] rounded-2xl border border-rose/20 bg-white/70 p-2">
                  {daySessions.length === 0 ? <p className="pt-4 text-center text-xs text-muted/70">Livre</p> : null}
                  <div className="space-y-2">
                    {daySessions.map((s) => {
                      const subject = subjects.find((sub) => sub.id === s.subjectId);
                      const color = subject?.color || "#C58FA3";
                      return (
                        <div key={s.id} className="rounded-2xl border border-rose/20 bg-white p-2 shadow-softSm">
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                            <p className="min-w-0 flex-1 truncate text-xs font-semibold text-ink">{s.description || subject?.name}</p>
                            <button onClick={() => openEdit(s)} aria-label="Editar sessão" className="rounded-full p-1 text-muted transition hover:bg-sakura hover:text-petal">
                              <Pencil size={12} />
                            </button>
                            <button onClick={() => setDeletingId(s.id)} aria-label="Excluir sessão" className="rounded-full p-1 text-muted transition hover:bg-rose/30 hover:text-petal">
                              <Trash2 size={12} />
                            </button>
                          </div>
                          <p className="mt-1 text-[11px] font-medium text-muted">
                            {s.start} – {s.end}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={() => openCreate(i)} aria-label="Adicionar sessão" className="mt-2 w-full rounded-xl border border-dashed border-rose/40 py-1.5 text-xs font-semibold text-petal transition hover:bg-sakura">
                    <Plus size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar sessão" : "Nova sessão de estudo"} size="sm">
        <form onSubmit={handleSave} className="space-y-4">
          <Select label="Matéria" value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })} error={errors.subjectId}>
            <option value="">Escolha a matéria</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Dia" value={String(form.day)} onChange={(e) => setForm({ ...form, day: Number(e.target.value) })}>
              {Array.from({ length: 7 }, (_, i) => (
                <option key={i} value={i}>
                  {WEEKDAY_SHORT[i]}
                </option>
              ))}
            </Select>
            <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="pendente">Pendente</option>
              <option value="em andamento">Em andamento</option>
              <option value="concluida">Concluída</option>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Início" type="time" value={form.start} onChange={(e) => setForm({ ...form, start: e.target.value })} error={errors.times} />
            <Input label="Término" type="time" value={form.end} onChange={(e) => setForm({ ...form, end: e.target.value })} error={errors.times} />
          </div>
          <Input label="Descrição da atividade" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ex.: Revisão de capítulos" />
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">Salvar</Button>
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={Boolean(deletingId)} onClose={() => setDeletingId(null)} title="Excluir sessão" size="sm">
        <p className="text-sm text-muted">Deseja realmente excluir esta sessão do cronograma?</p>
        <div className="mt-5 flex gap-3">
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Excluir</Button>
          <Button variant="ghost" className="flex-1" onClick={() => setDeletingId(null)}>Cancelar</Button>
        </div>
      </Modal>
    </div>
  );
}
