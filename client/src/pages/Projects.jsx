import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api/axios';
import Alert from '../components/Alert';

const empty = { title: '', description: '' };
export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const flash = (type, text) => setMsg({ type, text });

  const load = async () => {
    try { setProjects((await api.get('/projects')).data); }
    catch (e) { flash('error', errMsg(e)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return flash('error', 'Title is required');
    setSaving(true);
    try {
      editId ? await api.put(`/projects/${editId}`, form) : await api.post('/projects', form);
      flash('success', editId ? 'Project updated' : 'Project created');
      setForm(empty); setEditId(null); load();
    } catch (ex) { flash('error', errMsg(ex)); }
    finally { setSaving(false); }
  };
  const remove = async (p) => {
    if (!confirm(`Delete "${p.title}" and all its tasks?`)) return;
    try { await api.delete(`/projects/${p._id}`); flash('success', 'Project deleted'); load(); }
    catch (ex) { flash('error', errMsg(ex)); }
  };

  return (
    <>
      <div className="page-head">
        <div><h1>Projects</h1><p className="muted">{projects.length} {projects.length === 1 ? 'project' : 'projects'}</p></div>
      </div>
      <Alert msg={msg} onClose={() => setMsg(null)} />
      <form className="card form" onSubmit={submit}>
        <input placeholder="Project title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Short description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button disabled={saving}>{saving ? 'Saving…' : editId ? 'Save changes' : 'Add project'}</button>
        {editId && <button type="button" className="ghost" onClick={() => { setEditId(null); setForm(empty); }}>Cancel</button>}
      </form>
      {loading ? (
        <div className="grid"><div className="skeleton" /><div className="skeleton" /><div className="skeleton" /></div>
      ) : projects.length === 0 ? (
        <div className="empty">No projects yet. Add your first one above.</div>
      ) : (
        <div className="grid">
          {projects.map((p) => (
            <div className="card pcard" key={p._id}>
              <div className="pbadge">{p.title[0]?.toUpperCase()}</div>
              <h3><Link to={`/projects/${p._id}`}>{p.title}</Link></h3>
              <p className="muted">{p.description || 'No description'}</p>
              <div className="row">
                <button className="ghost" onClick={() => { setEditId(p._id); setForm({ title: p.title, description: p.description || '' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</button>
                <button className="ghost danger" onClick={() => remove(p)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
