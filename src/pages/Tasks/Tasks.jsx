import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, CheckCircle2, Circle } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Textarea from "../../components/common/Textarea";
import Badge from "../../components/common/Badge";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { TASKS_SEED, SUBJECTS_SEED } from "../../services/seed";
import { createItem, updateItem, deleteItem, newId } from "../../services/data";
import { cx, formatShortDate, isOverdue } from "../../lib/utils";

const emptyForm = { title: "", description: "", subjectId: "", dueDate: "", priority: "media", status: "pendente" };

export default function Tasks() {
  const [tasks, setTasks] = useLocalStorageState("tasks", TASKS_SEED);
  const [subjects] = useLocalStorageState("subjects", SUBJECTS_SEED);

  const [subjectFilter, setSubjectFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const filtered = useMemo(
    () =>
      tasks.filter((t) => {
        if (subjectFilter !== "all" && t.subjectId !== subjectFilter) return false;
        if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
        if (statusFilter !== "all" && t.status !== statusFilter) return false;
        return true;
      }),
    [tasks, subjectFilter, priorityFilter, statusFilter]
  );

  const deletingTask = tasks.find((t) => t.id === deletingId);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, subjectId: subjects[0]?.id || "" });
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description || "",
      subjectId: task.subjectId,
      dueDate: task.dueDate || "",
      priority: task.priority,
      status: task.status,
    });
    setErrors({});
    setModalOpen(true);
  }

  function handleSave(e) {
    e.preventDefault();
    const nextErrors = {};
    if (form.title.trim().length < 3) nextErrors.title = "O título precisa ter pelo menos 3 caracteres.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = { ...form, title: form.title.trim(), subjectId: form.subjectId || null };

    if (editingId) {
      setTasks(updateItem(tasks, editingId, { ...payload, id: editingId }));
    } else {
      setTasks(createItem(tasks, { ...payload, id: newId(), createdAt: new Date().toISOString() }));
    }
    setModalOpen(false);
    setEditingId(null);
  }

  function toggleTask(task) {
    setTasks(tasks.map((t) => (t.id === task.id ? { ...t, status: t.status === "concluida" ? "pendente" : "concluida" } : t)));
  }

  function handleDelete() {
    if (deletingId) setTasks(deleteItem(tasks, deletingId));
    setDeletingId(null);
  }

  const deletingTaskData = tasks.find((t) => t.id === deletingId);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-12 pt-0 md:pt-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h-study-display text-2xl font-semibold text-ink sm:text-3xl">Tarefas</h1>
          <p className="mt-1 text-sm text-muted">Gerencie suas atividades com carinho.</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={18} /> Nova tarefa
        </Button>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Select label="Matéria" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
            <option value="all">Todas as matérias</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <Select label="Prioridade" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">Todas</option>
            <option value="alta">Alta</option>
            <option value="media">Média</option>
            <option value="baixa">Baixa</option>
          </Select>
          <Select label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Todos</option>
            <option value="pendente">Pendente</option>
            <option value="em andamento">Em andamento</option>
            <option value="concluida">Concluída</option>
          </Select>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <p className="py-8 text-center text-sm text-muted">Nenhuma tarefa encontrada com esses filtros. 🌸</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((task) => {
            const subject = subjects.find((s) => s.id === task.subjectId);
            const overdueTask = isOverdue(task);
            const dueSoon = task.dueDate && !overdueTask && task.dueDate <= new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10);
            return (
              <Card key={task.id} className="p-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTask(task)}
                    aria-label={task.status === "concluida" ? "Marcar como pendente" : "Marcar como concluída"}
                    className={cx(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition",
                      task.status === "concluida" ? "border-petal bg-petal text-white" : "border-rose/50 bg-white text-transparent hover:border-petal hover:text-petal"
                    )}
                  >
                    {task.status === "concluida" ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={cx("text-sm font-semibold", task.status === "concluida" && "text-muted line-through")}>{task.title}</p>
                    {task.description ? <p className="mt-0.5 text-xs text-muted">{task.description}</p> : null}
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {subject ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-sakura px-2.5 py-1 text-xs font-semibold text-petal">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: subject.color }} />
                          {subject.name}
                        </span>
                      ) : null}
                      <Badge tone={task.priority === "alta" ? "rose" : task.priority === "media" ? "neutral" : "sage"}>{task.priority}</Badge>
                      <Badge tone={task.status === "concluida" ? "sage" : overdueTask ? "rose" : dueSoon ? "amber" : "neutral"}>
                        {task.status === "concluida" ? "Concluída" : overdueTask ? "Atrasada" : dueSoon ? "Próxima" : task.status === "em andamento" ? "Em andamento" : "Pendente"}
                      </Badge>
                      {task.dueDate ? (
                        <span className={cx("inline-flex items-center gap-1 text-xs font-semibold", overdueTask ? "text-petal" : dueSoon ? "text-amber-600" : "text-muted")}>
                          {formatShortDate(task.dueDate)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-start gap-1">
                    <button onClick={() => openEdit(task)} aria-label="Editar tarefa" className="rounded-full p-2 text-muted transition hover:bg-sakura hover:text-petal">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setDeletingId(task.id)} aria-label="Excluir tarefa" className="rounded-full p-2 text-muted transition hover:bg-rose/30 hover:text-petal">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar tarefa" : "Nova tarefa"} size="sm">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} error={errors.title} placeholder="Ex.: Revisar capítulos" />
          <Textarea label="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Detalhes da atividade" />
          <Select label="Matéria" value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}>
            <option value="">Sem matéria</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Data de entrega" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            <Select label="Prioridade" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </Select>
          </div>
          <Select label="Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="pendente">Pendente</option>
            <option value="em andamento">Em andamento</option>
            <option value="concluida">Concluída</option>
          </Select>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">Salvar</Button>
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>Cancelar</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={Boolean(deletingId)} onClose={() => setDeletingId(null)} title="Excluir tarefa" size="sm">
        <p className="text-sm text-muted">Deseja realmente excluir esta tarefa?</p>
        <div className="mt-5 flex gap-3">
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Excluir</Button>
          <Button variant="ghost" className="flex-1" onClick={() => setDeletingId(null)}>Cancelar</Button>
        </div>
      </Modal>
    </div>
  );
}
