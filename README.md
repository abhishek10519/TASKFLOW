# TaskFlow – Project & Task Tracker (MERN)

Small team tool: sign up, create projects, add tasks with priority/due date, move them To Do → In Progress → Done, and watch a dashboard with overdue counts.

**Stack:** React 18 (Vite) · React Router · Axios · Context API · Node 18+/Express 5 · MongoDB/Mongoose · JWT + bcrypt · express-validator · Helmet · rate limiting

## Setup
```bash
# 1. Backend
cd server
cp .env.example .env        # fill in MONGO_URI and JWT_SECRET
npm install
npm run dev                 # http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
npm run dev                 # http://localhost:5173 (proxies /api to :5000)
```

## Environment variables (`server/.env`)
| Name | Purpose |
|---|---|
| PORT | API port (default 5000) |
| MONGO_URI | Local MongoDB or Atlas connection string |
| JWT_SECRET | Long random string used to sign tokens |
| CLIENT_URL | Allowed CORS origin (default http://localhost:5173) |

Optional client var: `VITE_API_URL` (set to your deployed API URL, e.g. `https://api.example.com/api`).

## API
| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| POST | /api/auth/register | Create account | No |
| POST | /api/auth/login | Login, returns JWT | No |
| GET | /api/auth/me | Current user | Yes |
| GET/POST | /api/projects | List / create projects | Yes |
| GET/PUT/DELETE | /api/projects/:id | Read / update / delete project (+ its tasks) | Yes |
| GET | /api/projects/:id/tasks?status=&priority=&search= | List + filter tasks | Yes |
| POST | /api/projects/:id/tasks | Create task | Yes |
| PUT | /api/tasks/:id | Update task | Yes |
| PATCH | /api/tasks/:id/status | Change status only | Yes |
| DELETE | /api/tasks/:id | Delete task | Yes |
| GET | /api/dashboard/stats | Dashboard counts | Yes |

## Design decisions
- **Ownership:** every project/task query includes `owner: req.user._id`, so another user's resource returns **404** (does not reveal it exists).
- **Cascade delete:** deleting a project runs `Task.deleteMany({ project })`.
- **PUT vs PATCH:** PUT replaces editable task fields; PATCH changes only `status` (used by the inline dropdown).
- **JWT storage:** localStorage (simple, works with a separate API origin). Trade-off: readable by JS, so XSS risk; httpOnly cookies avoid that but need CSRF care.
- **bcryptjs** is used (pure-JS, same hashing algorithm as bcrypt, no native build).

## Features
Done: all 7 core features, plus Helmet + rate limiting (bonus).
Not done: Kanban, pagination, admin role, tests, Docker, deployment, dark mode.
Known bugs: _(fill in after your own testing)_

## Screenshots
_(add screenshots of Login, Dashboard, Projects, Project detail, mobile view)_

## AI & Resources Used
_(Edit this honestly before submitting — the brief penalises vague or false declarations.)_
- **Claude** – generated the initial boilerplate for the backend and frontend. I then ___ (describe what you reviewed/changed).
- Example where AI was wrong / I changed its output: ___ (write one specific example you actually found while testing).
- Other resources: MongoDB/Mongoose/Express docs, ___
