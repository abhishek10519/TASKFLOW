import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './styles/variables.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/pages.css';

// apply saved theme before first paint to avoid a flash
document.documentElement.dataset.theme = localStorage.getItem('theme') || 'light';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter><AuthProvider><App /></AuthProvider></BrowserRouter>
);
