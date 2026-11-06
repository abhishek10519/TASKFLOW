import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { errMsg } from '../api/axios';
import Alert from '../components/Alert';
import { CheckIcon } from '../components/Icons';

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const { user, login, register } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const validate = () => {
    if (!isLogin && !form.name.trim()) return 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Enter a valid email';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
  };
  const submit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setMsg({ type: 'error', text: err });
    setBusy(true);
    try { await (isLogin ? login(form) : register(form)); nav('/'); }
    catch (ex) { setMsg({ type: 'error', text: errMsg(ex) }); }
    finally { setBusy(false); }
  };

  return (
    <div className="auth-wrap">
      <section className="auth-side">
        <div className="brand"><i>✓</i>TaskFlow</div>
        <h2>Every project and task your team owns, in one place.</h2>
        <p>Set priorities, track due dates and see what is overdue without digging through chats and spreadsheets.</p>
        <ul className="auth-points">
          <li><CheckIcon size={20} />Projects and tasks with priorities and due dates</li>
          <li><CheckIcon size={20} />Filter and search to find work fast</li>
          <li><CheckIcon size={20} />A dashboard that shows what is overdue</li>
        </ul>
      </section>
      <section className="auth-main">
        <form className="auth-card" onSubmit={submit} noValidate>
          <div>
            <h1>{isLogin ? 'Welcome back' : 'Create your account'}</h1>
            <p className="muted">{isLogin ? 'Log in to see your projects.' : 'It takes less than a minute.'}</p>
          </div>
          <Alert msg={msg} onClose={() => setMsg(null)} />
          {!isLogin && <label>Name<input value={form.name} onChange={set('name')} autoComplete="name" /></label>}
          <label>Email<input type="email" value={form.email} onChange={set('email')} autoComplete="email" /></label>
          <label>Password<input type="password" value={form.password} onChange={set('password')} autoComplete={isLogin ? 'current-password' : 'new-password'} /></label>
          <button disabled={busy}>{busy ? 'Please wait…' : isLogin ? 'Log in' : 'Sign up'}</button>
          <p className="muted">{isLogin ? <>New here? <Link to="/register">Create an account</Link></> : <>Already have an account? <Link to="/login">Log in</Link></>}</p>
        </form>
      </section>
    </div>
  );
}
