import { useState } from "react";
import { Plus, Pencil, Trash2, Target } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Textarea from "../../components/common/Textarea";
import ProgressBar from "../../components/common/ProgressBar";
import Badge from "../../components/common/Badge";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { GOALS_SEED } from "../../services/seed";
import { createItem, updateItem, deleteItem, newId } from "../../services/data";
import { formatShortDate } from "../../lib/utils";

const emptyForm = { title: "", description: "", deadline: "", progress: 0, status: "em andamento" };

export default function Goals() {
  const [goals, setGoals] = useLocalStorageState("goals", GOALS_SEED);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const deletingGoal = goals.find((g) => g.id === deletingId);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(goal) {
    setEditingId(goal.id);
    setForm({ title: goal.title, description: goal.description || "", deadline: goal.deadline || "", progress: goal.progress, status: goal.status });
    setErrors({});
    setModalOpen(true);
  }

  function handleSave(e) {
    e.preventDefault();
    const nextErrors = {};
    if (form.title.trim().length < 3) nextErrors.title = "O título da meta é obrigatório.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = { ...form, title: form.title.trim(), progress: Number(form.progress) || 0 };
    const status = payload.progress >= 100 ? "concluida" : "em andamento";

    if (editingId) {
      setGoals(updateItem(goals, editingId, { ...payload, status, id: editingId }));
    } else {
      setGoals(createItem(goals, { ...payload, status, id: newId() }));
    }
    setModalOpen(false);
    setEditingId(null);
  }

  function handleDelete() {
    if (deletingId) setGoals(deleteItem(goals, deletingId));
    setDeletingId(null);
  }

  const sorted = [...goals].sort((a, b) => Number(b.progress || 0) - Number(a.progress || 0));

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-12 pt-0 md:pt-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h-study-display text-2xl font-semibold text-ink sm:text-3xl">Metas</h1>
          <p className="mt-1 text-sm text-muted">Objetivos pessoais e acadêmicos 🌸</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={18} /> Nova meta
        </Button>
      </div>

      {sorted.length === 0 ? (
        <Card>
          <div className="py-8 text-center">
            <Target className="mx-auto mb-3 h-10 w-10 text-petal" />
            <p className="font-display text-lg font-semibold text-ink">Sem metas ainda</p>
            <p className="mt-1 text-sm text-muted">Defina um objetivo para dar rumo ao seu estudo.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {sorted.map((goal) => (
            <Card key={goal.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-semibold text-ink">{goal.title}</h2>
                    <Badge tone={goal.status === "concluida" ? "sage" : "neutral"}>{goal.status === "concluida" ? "Concluída" : "Em andamento"}</Badge>
                  </div>
                  {goal.description ? <p className="mt-1 text-sm text-muted">{goal.description}</p> : null}
                  {goal.deadline ? (
                    <p className="mt-1 text-xs text-muted">Prazo: {formatShortDate(goal.deadline)}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => openEdit(goal)} aria-label={`Editar ${goal.title}`} className="rounded-full p-2 text-muted transition hover:bg-sakura hover:text-petal">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setDeletingId(goal.id)} aria-label={`Excluir ${goal.title}`} className="rounded-full p-2 text-muted transition hover:bg-rose/30 hover:text-petal">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div className="mt-4">
                <ProgressBar value={goal.progress} />
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted">Progresso: {Math.round(Number(goal.progress) || 0)}%</span>
                {goal.status === "concluida" ? <span className="text-xs font-semibold text-sage">Meta alcançada 🌸</span> : null}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar meta" : "Nova meta"} size="sm">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} error={errors.title} placeholder="Ex.: Estudar matemática 3x na semana" />
          <Textarea label="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Como medir o progresso" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Prazo" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
            <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="em andamento">Em andamento</option>
              <option value="concluida">Concluída</option>
            </Select>
          </div>
          <div>
            <label className="h-study-label">Progresso: {Number(form.progress) || 0}%</label>
            <input type="range" min={0} max={100} step={5} value={form.progress} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} className="h-2 w-full accent-[#C58FA3]" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">Salvar</Button>
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>Cancelar</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={Boolean(deletingId)} onClose={() => setDeletingId(null)} title="Excluir meta" size="sm">
        <p className="text-sm text-muted">Deseja realmente excluir esta meta?</p>
        <div className="mt-5 flex gap-3">
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Excluir</Button>
          <Button variant="ghost" className="flex-1" onClick={() => setDeletingId(null)}>Cancelar</Button>
        </div>
      </Modal>
    </div>
  );
}
