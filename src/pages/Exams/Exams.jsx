import { useState } from "react";
import { Plus, Pencil, Trash2, CalendarClock } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Textarea from "../../components/common/Textarea";
import Badge from "../../components/common/Badge";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { EXAMS_SEED, SUBJECTS_SEED } from "../../services/seed";
import { createItem, updateItem, deleteItem, newId } from "../../services/data";
import { DEFAULT_PREP_LEVEL, daysUntil, formatCountdown, formatLongDate, formatShortDate } from "../../lib/utils";

const emptyForm = { name: "", subjectId: "", date: "", content: "", prepLevel: DEFAULT_PREP_LEVEL };

export default function Exams() {
  const [exams, setExams] = useLocalStorageState("exams", EXAMS_SEED);
  const [subjects] = useLocalStorageState("subjects", SUBJECTS_SEED);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const upcoming = exams
    .filter((e) => new Date(e.date + "T00:00:00") > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const nextExam = upcoming[0] || null;
  const nextSubject = nextExam ? subjects.find((s) => s.id === nextExam.subjectId) : null;

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, subjectId: subjects[0]?.id || "" });
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(exam) {
    setEditingId(exam.id);
    setForm({ name: exam.name, subjectId: exam.subjectId, date: exam.date, content: (exam.content || []).join(", "), prepLevel: exam.prepLevel });
    setErrors({});
    setModalOpen(true);
  }

  function handleSave(e) {
    e.preventDefault();
    const nextErrors = {};
    if (form.name.trim().length < 3) nextErrors.name = "O nome da avaliação é obrigatório.";
    if (!form.date) nextErrors.date = "Escolha a data da avaliação.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = { ...form, name: form.name.trim(), subjectId: form.subjectId || null, content: form.content.split(",").map((c) => c.trim()).filter(Boolean) };

    if (editingId) {
      setExams(updateItem(exams, editingId, { ...payload, id: editingId }));
    } else {
      setExams(createItem(exams, { ...payload, id: newId() }));
    }
    setModalOpen(false);
    setEditingId(null);
  }

  function handleDelete() {
    if (deletingId) setExams(deleteItem(exams, deletingId));
    setDeletingId(null);
  }

  const deletingExam = exams.find((e) => e.id === deletingId);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-12 pt-0 md:pt-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h-study-display text-2xl font-semibold text-ink sm:text-3xl">Provas</h1>
          <p className="mt-1 text-sm text-muted">Painel de avaliações com contagem regressiva.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={18} /> Nova avaliação
        </Button>
      </div>

      {nextExam && nextSubject ? (
        <Card className="mb-6 bg-gradient-to-br from-sakura to-white">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: nextSubject.color }}>
              <CalendarClock size={24} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-petal">Próxima avaliação</p>
              <h2 className="h-study-display text-xl font-semibold text-ink">{nextExam.name}</h2>
              <p className="text-sm text-muted">{nextSubject.name}</p>
              <p className="mt-2 font-display text-3xl font-semibold text-petal">{formatCountdown(nextExam.date)}</p>
              <p className="text-xs text-muted">Em {formatLongDate(nextExam.date)}</p>
            </div>
          </div>
        </Card>
      ) : null}

      {upcoming.length === 0 ? (
        <Card>
          <p className="py-8 text-center text-sm text-muted">Nenhuma avaliação futura cadastrada.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {upcoming.map((exam) => {
            const subject = subjects.find((s) => s.id === exam.subjectId);
            const color = subject?.color || "#C58FA3";
            const days = daysUntil(exam.date);
            return (
              <Card key={exam.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink">{exam.name}</p>
                    <p className="text-xs text-muted">{subject?.name}</p>
                    <p className="mt-1 text-xs text-muted">{formatShortDate(exam.date)}</p>
                  </div>
                  <Badge tone={days < 7 ? "rose" : "neutral"}>{formatCountdown(exam.date)}</Badge>
                </div>
                {exam.content.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {exam.content.map((item) => (
                      <span key={item} className="rounded-full bg-sakura/70 px-2.5 py-1 text-[11px] font-medium text-petal">
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1">
                    <p className="mb-1 text-xs font-semibold text-ink">Preparação</p>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-sakura">
                      <div className="h-full rounded-full bg-petal" style={{ width: `${((exam.prepLevel || DEFAULT_PREP_LEVEL) / 3) * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-petal">{exam.prepLevel || DEFAULT_PREP_LEVEL}/3</span>
                </div>
                <div className="mt-3 flex justify-end gap-2">
                  <button onClick={() => openEdit(exam)} aria-label={`Editar ${exam.name}`} className="rounded-full p-2 text-muted transition hover:bg-sakura hover:text-petal">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setDeletingId(exam.id)} aria-label={`Excluir ${exam.name}`} className="rounded-full p-2 text-muted transition hover:bg-rose/30 hover:text-petal">
                    <Trash2 size={15} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar avaliação" : "Nova avaliação"} size="sm">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} placeholder="Ex.: Prova de Biologia" />
          <Select label="Matéria" value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}>
            <option value="">Escolha a matéria</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <Input label="Data" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} error={errors.date} />
          <Textarea label="Conteúdo que será cobrado" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Ex.: Células, Genética" />
          <Select label="Nível de preparação" value={String(form.prepLevel)} onChange={(e) => setForm({ ...form, prepLevel: Number(e.target.value) })}>
            {[1, 2, 3].map((n) => (
              <option key={n} value={n}>
                Nível {n}
              </option>
            ))}
          </Select>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">Salvar</Button>
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>Cancelar</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={Boolean(deletingId)} onClose={() => setDeletingId(null)} title="Excluir avaliação" size="sm">
        <p className="text-sm text-muted">Deseja realmente excluir esta avaliação?</p>
        <div className="mt-5 flex gap-3">
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Excluir</Button>
          <Button variant="ghost" className="flex-1" onClick={() => setDeletingId(null)}>Cancelar</Button>
        </div>
      </Modal>
    </div>
  );
}
