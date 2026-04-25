import { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username, password
      });
      localStorage.setItem('crm_token', res.data.token);
      onLogin();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="7" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="14" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M9.5 9L12 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="brand-name">LeadFlow</span>
        </div>
        <h1 className="login-title">Admin Login</h1>
        <p className="login-subtitle">Sign in to access your CRM dashboard</p>
        {error && (
          <div className="alert alert-error">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label className="field-label">Username</label>
            <input
              type="text"
              className="field-input"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label className="field-label">Password</label>
            <input
              type="password"
              className="field-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="login-hint">Default: admin / admin123</p>
      </div>
    </div>
  );
}

export default Login;