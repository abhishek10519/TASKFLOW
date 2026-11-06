import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { GridIcon, FolderIcon, MoonIcon, SunIcon, LogoutIcon } from './Icons';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [theme, setTheme] = useState(document.documentElement.dataset.theme || 'light');
  const [stats, setStats] = useState(null);

  // refresh the badges and progress card whenever the user moves between pages
  useEffect(() => {
    api.get('/dashboard/stats').then((r) => setStats(r.data)).catch(() => {});
  }, [pathname]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch { /* storage unavailable */ }
    setTheme(next);
  };
  const done = stats?.byStatus.done || 0;
  const total = stats?.totalTasks || 0;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <aside className="sidebar">
      <div className="brand"><i>✓</i>TaskFlow</div>

      <div className="side-scroll">
        <p className="side-label">Menu</p>
        <nav className="side-nav">
          <NavLink to="/" end><GridIcon />Dashboard{stats?.overdue > 0 && <em className="badge danger" title="Overdue tasks">{stats.overdue}</em>}</NavLink>
          <NavLink to="/projects"><FolderIcon />Projects{stats && <em className="badge" title="Total projects">{stats.totalProjects}</em>}</NavLink>
        </nav>

        <p className="side-label">General</p>
        <nav className="side-nav">
          <button onClick={toggleTheme}>{theme === 'light' ? <MoonIcon /> : <SunIcon />}<span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span></button>
          <button onClick={() => { logout(); nav('/login'); }}><LogoutIcon /><span>Log out</span></button>
        </nav>
      </div>

      {stats && (
        <div className="side-promo">
          <strong>{total ? 'Keep going' : 'Get started'}</strong>
          <span>{total ? `${done} of ${total} tasks done` : 'Create your first project'}</span>
          {total > 0 && <div className="mini-bar"><i style={{ width: `${pct}%` }} /></div>}
          <Link className="btn light" to="/projects">Add project</Link>
        </div>
      )}

      <div className="side-user">
        <div className="avatar">{user?.name?.[0]?.toUpperCase()}</div>
        <div className="who"><strong>{user?.name}</strong><small>{user?.email}</small></div>
      </div>
    </aside>
  );
}
