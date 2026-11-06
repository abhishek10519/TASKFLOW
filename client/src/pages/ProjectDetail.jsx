import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { errMsg } from '../api/axios';
import Alert from '../components/Alert';

const STATUS = [['todo', 'To Do'], ['in-progress', 'In Progress'], ['done', 'Done']];
const PRIORITY = ['low', 'medium', 'high'];
const empty = { title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' };

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const flash = (type, text) => setMsg({ type, text });

  useEffect(() => {
    api.get(`/projects/${id}`).then((r) => setProject(r.data)).catch((e) => flash('error', errMsg(e)));
  }, [id]);

  const load = useCallback(async () => {
    try { setTasks((await api.get(`/projects/${id}/tasks`, { params: filters })).data); }
    catch (e) { flash('error', errMsg(e)); }
    finally { setLoading(false); }
  }, [id, filters]);
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [load]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return flash('error', 'Title is required');
    setSaving(true);
    try {
      editId ? await api.put(`/tasks/${editId}`, form) : await api.post(`/projects/${id}/tasks`, form);
      flash('success', editId ? 'Task updated' : 'Task created');
      setForm(empty); setEditId(null); load();
    } catch (ex) { flash('error', errMsg(ex)); }
    finally { setSaving(false); }
  };
  const changeStatus = async (t, status) => {
    try { await api.patch(`/tasks/${t._id}/status`, { status }); load(); }
    catch (ex) { flash('error', errMsg(ex)); }
  };
  const remove = async (t) => {
    if (!confirm(`Delete "${t.title}"?`)) return;
    try { await api.delete(`/tasks/${t._id}`); flash('success', 'Task deleted'); load(); }
    catch (ex) { flash('error', errMsg(ex)); }
  };
  const edit = (t) => {
    setEditId(t._id);
    setForm({ title: t.title, description: t.description || '', status: t.status, priority: t.priority, dueDate: t.dueDate ? t.dueDate.slice(0, 10) : '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const overdue = (t) => t.dueDate && t.status !== 'done' && new Date(t.dueDate) < new Date();
  const setF = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setFilter = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });

  return (
    <>
      <div className="page-head">
        <div>
          <Link to="/projects">← All projects</Link>
          <h1>{project?.title || 'Project'}</h1>
          {project?.description && <p className="muted">{project.description}</p>}
        </div>
      </div>
      <Alert msg={msg} onClose={() => setMsg(null)} />

      <form className="card" onSubmit={submit}>
        <p className="card-title">{editId ? 'Edit task' : 'Add a task'}</p>
        <div className="form" style={{ marginBottom: 0 }}>
          <input placeholder="Task title" value={form.title} onChange={setF('title')} />
          <input placeholder="Description" value={form.description} onChange={setF('description')} />
          <select value={form.status} onChange={setF('status')}>{STATUS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          <select value={form.priority} onChange={setF('priority')}>{PRIORITY.map((p) => <option key={p} value={p}>{p[0].toUpperCase() + p.slice(1)} priority</option>)}</select>
          <input type="date" value={form.dueDate} onChange={setF('dueDate')} />
          <button disabled={saving}>{saving ? 'Saving…' : editId ? 'Save task' : 'Add task'}</button>
          {editId && <button type="button" className="ghost" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
        </div>
      </form>

      <div className="form filters" style={{ marginTop: '1rem' }}>
        <input placeholder="Search tasks by title" value={filters.search} onChange={setFilter('search')} />
        <select value={filters.status} onChange={setFilter('status')}><option value="">All statuses</option>{STATUS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        <select value={filters.priority} onChange={setFilter('priority')}><option value="">All priorities</option>{PRIORITY.map((p) => <option key={p} value={p}>{p[0].toUpperCase() + p.slice(1)}</option>)}</select>
      </div>

      {loading ? (
        <><div className="skeleton" /><div className="skeleton" /></>
      ) : tasks.length === 0 ? (
        <div className="empty">No tasks match. Add one above or clear the filters.</div>
      ) : (
        <>
          <p className="count">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</p>
          <ul className="tasks">
            {tasks.map((t) => (
              <li className={`card task ${t.priority} ${t.status === 'done' ? 'done' : ''}`} key={t._id}>
                <div>
                  <strong>{t.title}</strong><span className={`tag ${t.priority}`}>{t.priority}</span>
                  {t.description && <p className="muted">{t.description}</p>}
                  {t.dueDate && <small className={overdue(t) ? 'danger' : 'muted'}>Due {new Date(t.dueDate).toLocaleDateString()}{overdue(t) && ' · overdue'}</small>}
                </div>
                <div className="row">
                  <select className={`pill ${t.status}`} value={t.status} onChange={(e) => changeStatus(t, e.target.value)} aria-label="Change status">{STATUS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                  <button className="ghost" onClick={() => edit(t)}>Edit</button>
                  <button className="ghost danger" onClick={() => remove(t)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
