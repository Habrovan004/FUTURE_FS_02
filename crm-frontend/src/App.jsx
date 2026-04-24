import { useState, useEffect } from "react";
import LeadForm from "./components/LeadForm";
import LeadList from "./components/LeadList";
import Login from "./pages/Login";
import axios from "axios";
import "./App.css";

// Attach token to every axios request automatically
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('crm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function App() {
  const [refresh, setRefresh] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('crm_token'));

  const handleLogout = () => {
    localStorage.removeItem('crm_token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="7" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
                <circle cx="14" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M9.5 9L12 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="brand-name">LeadFlow</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="header-tag">Mini CRM</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </header>
      <main className="app-main">
        <div className="page-title-row">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Manage and track your leads</p>
          </div>
        </div>
        <LeadForm setRefresh={setRefresh} />
        <LeadList refresh={refresh} />
      </main>
    </div>
  );
}

export default App;