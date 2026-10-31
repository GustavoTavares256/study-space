import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import Input from "../../components/common/Input";
import Select from "../../components/common/Select";
import Textarea from "../../components/common/Textarea";
import SubjectIcon from "../../components/common/SubjectIcon";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { NOTES_SEED, SUBJECTS_SEED } from "../../services/seed";
import { createItem, updateItem, deleteItem, newId } from "../../services/data";
import { formatLongDate } from "../../lib/utils";

const emptyForm = { title: "", subjectId: "", content: "" };

export default function Notes() {
  const [notes, setNotes] = useLocalStorageState("notes", NOTES_SEED);
  const [subjects] = useLocalStorageState("subjects", SUBJECTS_SEED);
  const [query, setQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const filtered = useMemo(
    () =>
      notes
        .filter((n) => (subjectFilter === "all" ? true : n.subjectId === subjectFilter))
        .filter((n) => n.title.toLowerCase().includes(query.trim().toLowerCase()))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [notes, subjectFilter, query]
  );

  const deletingNote = notes.find((n) => n.id === deletingId);

  function openCreate() {
    setEditingId(null);
    setForm({ ...emptyForm, subjectId: subjects[0]?.id || "" });
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(note) {
    setEditingId(note.id);
    setForm({ title: note.title, subjectId: note.subjectId, content: note.content });
    setErrors({});
    setModalOpen(true);
  }

  function handleSave(e) {
    e.preventDefault();
    const nextErrors = {};
    if (form.title.trim().length < 2) nextErrors.title = "O título é obrigatório.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = { ...form, title: form.title.trim() };
    if (editingId) {
      setNotes(updateItem(notes, editingId, { ...payload, id: editingId }));
    } else {
      setNotes(createItem(notes, { ...payload, id: newId(), createdAt: new Date().toISOString() }));
    }
    setModalOpen(false);
    setEditingId(null);
  }

  function handleDelete() {
    if (deletingId) setNotes(deleteItem(notes, deletingId));
    setDeletingId(null);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-12 pt-0 md:pt-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="h-study-display text-2xl font-semibold text-ink sm:text-3xl">Anotações</h1>
          <p className="mt-1 text-sm text-muted">Seu caderno digital minimalista 📓</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={18} /> Nova anotação
        </Button>
      </div>

      <Card className="mb-6 space-y-3">
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-petal" />
          <input className="h-study-input pl-11" placeholder="Pesquisar por título..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Select label="Matéria" value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
          <option value="all">Todas as matérias</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <p className="py-8 text-center text-sm text-muted">Nenhuma anotação encontrada. Escreva algo precioso! 🌸</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((note) => {
            const subject = subjects.find((s) => s.id === note.subjectId);
            return (
              <Card key={note.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-display text-lg font-semibold text-ink">{note.title}</h2>
                    {subject ? (
                      <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-petal">
                        <SubjectIcon icon={subject.icon} size={12} /> {subject.name}
                      </span>
                    ) : null}
                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted">{note.content}</p>
                    <p className="mt-2 text-[11px] text-muted">Criada em {formatLongDate(note.createdAt)}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button onClick={() => openEdit(note)} aria-label={`Editar ${note.title}`} className="rounded-full p-2 text-muted transition hover:bg-sakura hover:text-petal">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => setDeletingId(note.id)} aria-label={`Excluir ${note.title}`} className="rounded-full p-2 text-muted transition hover:bg-rose/30 hover:text-petal">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Editar anotação" : "Nova anotação"} size="sm">
        <form onSubmit={handleSave} className="space-y-4">
          <Input label="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} error={errors.title} placeholder="Ex.: Ideias de estudo" />
          <Select label="Matéria" value={form.subjectId} onChange={(e) => setForm({ ...form, subjectId: e.target.value })}>
            <option value="">Sem matéria</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </Select>
          <Textarea label="Conteúdo" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Anotações, ideias, reflexões..." />
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">Salvar</Button>
            <Button type="button" variant="ghost" className="flex-1" onClick={() => setModalOpen(false)}>Cancelar</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={Boolean(deletingId)} onClose={() => setDeletingId(null)} title="Excluir anotação" size="sm">
        <p className="text-sm text-muted">Deseja realmente excluir esta anotação?</p>
        <div className="mt-5 flex gap-3">
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Excluir</Button>
          <Button variant="ghost" className="flex-1" onClick={() => setDeletingId(null)}>Cancelar</Button>
        </div>
      </Modal>
    </div>
  );
}
