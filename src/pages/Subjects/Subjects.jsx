import { useState } from "react";
import { Plus, Pencil, Trash2, Info, BookOpen } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Textarea from "../../components/common/Textarea";
import ProgressBar from "../../components/common/ProgressBar";
import SubjectIcon from "../../components/common/SubjectIcon";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { SUBJECTS_SEED, TASKS_SEED, EXAMS_SEED } from "../../services/seed";
import { SUBJECT_COLORS, SUBJECT_ICONS } from "../../lib/utils";
import { createItem, updateItem, deleteItem, newId } from "../../services/data";

const emptyForm = { name: "", color: SUBJECT_COLORS[0], icon: SUBJECT_ICONS[0], description: "" };

export default function Subjects() {
  const [subjects, setSubjects] = useLocalStorageState("subjects", SUBJECTS_SEED);
  const [tasks] = useLocalStorageState("tasks", TASKS_SEED);
  const [exams] = useLocalStorageState("exams", EXAMS_SEED);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const editingSubject = subjects.find((s) => s.id === editingId) || null;
  const detailSubject = subjects.find((s) => s.id === detailId) || null;

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(subject) {
    setEditingId(subject.id);
    setForm({ name: subject.name, color: subject.color, icon: subject.icon, description: subject.description || "" });
    setErrors({});
    setModalOpen(true);
  }

  function handleSave(e) {
    e.preventDefault();
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = "O nome da matéria é obrigatório.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (editingId) {
      setSubjects(updateItem(subjects, editingId, { ...form, name: form.name.trim(), id: editingId }));
    } else {
      setSubjects(createItem(subjects, { ...form, id: newId(), progress: 0, createdAt: new Date().toISOString() }));
    }
    setModalOpen(false);
    setEditingId(null);
  }

  function handleDelete() {
    if (deletingId) setSubjects(deleteItem(subjects, deletingId));
    setDeletingId(null);
  }

  const deletingSubject = subjects.find((s) => s.id === deletingId);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-12 pt-0 md:pt-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h-study-display text-2xl font-semibold text-ink sm:text-3xl">Matérias</h1>
          <p className="mt-1 text-sm text-muted">Seu jardim de saberes 🌸</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={18} /> Nova matéria
        </Button>
      </div>

      {subjects.length === 0 ? (
        <div className="h-study-card p-8 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-petal" />
          <p className="font-display text-lg font-semibold text-ink">Nenhuma matéria ainda</p>
          <p className="mt-1 text-sm text-muted">Crie sua primeira disciplina para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => {
            const subjectTasks = tasks.filter((t) => t.subjectId === subject.id);
            const doneTasks = subjectTasks.filter((t) => t.status === "concluida");
            const progress = subjectTasks.length ? Math.round((doneTasks.length / subjectTasks.length) * 100) : Number(subject.progress) || 0;
            return (
              <Card key={subject.id} className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: subject.color }}>
                    <SubjectIcon icon={subject.icon} size={22} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-display text-lg font-semibold text-ink">{subject.name}</h2>
                    <p className="text-xs text-muted">{subjectTasks.length} tarefas · {progress}% concluídas</p>
                  </div>
                </div>
                <p className="min-h-[2.5rem] text-sm text-muted">{subject.description || "Sem descrição."}</p>
                <ProgressBar value={progress} />
                <div className="mt-auto flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setDetailId(subject.id)}>
                    <Info size={15} /> Detalhes
                  </Button>
                  <span className="flex-1" />
                  <button onClick={() => openEdit(subject)} aria-label={`Editar ${subject.name}`} className="rounded-full p-2 text-muted transition hover:bg-sakura hover:text-petal">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setDeletingId(subject.id)} aria-label={`Excluir ${subject.name}`} className="rounded-full p-2 text-muted transition hover:bg-rose/30 hover:text-petal">
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar matéria" : "Nova matéria"} size="sm">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} placeholder="Ex.: Física" />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Cor" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}>
              {SUBJECT_COLORS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
            <Select label="Ícone" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
              {SUBJECT_ICONS.map((i) => (
                <option key={i} value={i}>
                  {i}
                </option>
              ))}
            </Select>
          </div>
          <Textarea label="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Um pouco sobre a disciplina" />
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">Salvar</Button>
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>Cancelar</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={Boolean(deletingId)} onClose={() => setDeletingId(null)} title="Excluir matéria" size="sm">
        <p className="text-sm text-muted">Deseja realmente excluir esta matéria? Suas tarefas e anotações relacionadas serão mantidas.</p>
        <div className="mt-5 flex gap-3">
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Excluir</Button>
          <Button variant="ghost" className="flex-1" onClick={() => setDeletingId(null)}>Cancelar</Button>
        </div>
      </Modal>

      <Modal isOpen={Boolean(detailSubject)} onClose={() => setDetailId(null)} title={detailSubject?.name || ""} size="md">
        {detailSubject ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: detailSubject.color }}>
                <SubjectIcon icon={detailSubject.icon} size={22} />
              </span>
              <div>
                <p className="text-sm text-muted">{detailSubject.description || "Sem descrição."}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">Progresso</p>
              <ProgressBar value={subjects.find((s) => s.id === detailSubject.id)?.progress || 0} />
            </div>
            <p className="text-sm text-muted">{tasks.filter((t) => t.subjectId === detailSubject.id).length} tarefas vinculadas e {exams.filter((e) => e.subjectId === detailSubject.id).length} avaliações.</p>
            <Button variant="ghost" onClick={() => setDetailId(null)}>Fechar</Button>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
