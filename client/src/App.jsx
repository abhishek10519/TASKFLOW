import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';

const Page = ({ children }) => <ProtectedRoute><div className="shell"><Navbar /><main className="content">{children}</main></div></ProtectedRoute>;

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/" element={<Page><Dashboard /></Page>} />
      <Route path="/projects" element={<Page><Projects /></Page>} />
      <Route path="/projects/:id" element={<Page><ProjectDetail /></Page>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
