import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';
import { ArrowIcon, PlusIcon, ListIcon } from '../components/Icons';

const SEGMENTS = [['todo', 'To Do'], ['in-progress', 'In Progress'], ['done', 'Done']];
const TONE = { high: 'tone-rose', medium: 'tone-amber', low: 'tone-green' };

function AreaChart({ data }) {
  const W = 420, H = 130, P = 10;
  const max = Math.max(1, ...data.map((d) => d.count));
  const pts = data.map((d, i) => [P + (i * (W - 2 * P)) / (data.length - 1), H - P - (d.count / max) * (H - 2 * P - 12)]);
  const line = pts.map(([x, y], i) => {
    if (!i) return `M${x},${y}`;
    const [px, py] = pts[i - 1], mx = px + (x - px) / 2;
    return `C${mx},${py} ${mx},${y} ${x},${y}`;
  }).join(' ');
  const area = `${line} L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z`;
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H + 22}`} role="img" aria-label="Tasks completed per day, last 7 days">
      <defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7c5cf0" stopOpacity=".35" /><stop offset="1" stopColor="#7c5cf0" stopOpacity="0" /></linearGradient></defs>
      <path d={area} fill="url(#areaFill)" />
      <path d={line} fill="none" stroke="#7c5cf0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke="#7c5cf0" strokeWidth="2"><title>{`${data[i].date}: ${data[i].count} completed`}</title></circle>)}
      {data.map((d, i) => <text key={i} x={pts[i][0]} y={H + 17} textAnchor="middle" className="chart-label">{d.day}</text>)}
    </svg>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    api.get('/dashboard/stats').then((r) => setStats(r.data)).catch((e) => setMsg({ type: 'error', text: errMsg(e) }));
  }, []);

  const total = stats?.totalTasks || 0;
  const pct = (n) => (total ? (n / total) * 100 : 0);

  return (
    <>
      <div className="dash-head">
        <div>
          <h1>Hi, {user?.name?.split(' ')[0]}</h1>
          <p className="muted">Plan, prioritize and finish your tasks with ease.</p>
        </div>
        <Link className="btn" to="/projects"><PlusIcon size={18} />Add project</Link>
      </div>
      <Alert msg={msg} onClose={() => setMsg(null)} />
      {!stats ? (
        <><div className="skeleton" style={{ height: 150 }} /><div className="skeleton" style={{ height: 220, marginTop: '1rem' }} /></>
      ) : (
        <>
          <div className="gtiles">
            {[['Total tasks', total, 'g1'], ['Completed', stats.byStatus.done, 'g2'], ['In progress', stats.byStatus['in-progress'], 'g3'], ['To do', stats.byStatus.todo, 'g4']].map(([label, n, cls]) => (
              <Link key={label} to="/projects" className={`gstat ${cls}`}><span>{label}</span><b>{n}</b><i className="arrow"><ArrowIcon size={16} /></i></Link>
            ))}
          </div>

          <div className="dash-grid">
            <div className="card">
              <p className="card-title">Project analytics</p>
              <div className="big-num">{stats.byStatus.done} / {total}<small>completed</small></div>
              <p className="muted" style={{ margin: '.2rem 0 .8rem' }}>Tasks completed in the last 7 days</p>
              <AreaChart data={stats.weekly} />
            </div>
            <div className="card">
              <p className="card-title">Upcoming deadlines</p>
              {stats.upcoming.length === 0 ? <p className="muted">Nothing due yet. Add due dates to your tasks to see them here.</p> : (
                <ul className="todo">
                  {stats.upcoming.map((t) => {
                    const late = new Date(t.dueDate) < new Date();
                    return (
                      <li key={t._id}>
                        <span className={`chip ${TONE[t.priority]}`}><ListIcon size={18} /></span>
                        <div><Link to={`/projects/${t.project}`}>{t.title}</Link><small className={late ? 'danger' : 'muted'}>{late ? 'Overdue · ' : 'Due '}{new Date(t.dueDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</small></div>
                        <span className={`tag ${t.priority}`}>{t.priority}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <div className="dash-grid" style={{ gridTemplateColumns: '1.6fr 1fr' }}>
            <div className="card">
              <p className="card-title">Task status</p>
              {total === 0 ? <p className="muted">No tasks yet. Create a project and add your first task.</p> : (
                <>
                  <div className="bar" role="img" aria-label="Tasks by status">{SEGMENTS.map(([k]) => <span key={k} className={`s-${k}`} style={{ width: `${pct(stats.byStatus[k])}%` }} />)}</div>
                  <div className="legend">{SEGMENTS.map(([k, l]) => <span key={k}><i className={`s-${k}`} />{l}: {stats.byStatus[k]}</span>)}</div>
                </>
              )}
              <p className="muted" style={{ marginBottom: 0 }}>{stats.totalProjects} {stats.totalProjects === 1 ? 'project' : 'projects'} in total</p>
            </div>
            <div className="dark-card">
              <h3>Overdue tasks</h3>
              <b>{stats.overdue}</b>
              <p>{stats.overdue ? 'These need your attention first.' : 'You are all caught up.'}</p>
              <Link className="btn light" to="/projects">Review projects</Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
