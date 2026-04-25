import React, { useState } from 'react';
import axios from 'axios';

function LeadForm({ setRefresh }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/leads', { name, email, source });
      setName('');
      setEmail('');
      setSource('');
      setSuccess(true);
      setRefresh(prev => !prev);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form-section">
      <div className="section-header">
        <h2 className="section-title">Add New Lead</h2>
        <p className="section-desc">Fill in the details to add a new lead to your pipeline</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">Lead added successfully!</div>}

      <form onSubmit={handleSubmit} className="lead-form">
        <div className="form-grid">
          <div className="form-field">
            <label className="field-label">Full Name</label>
            <input
              type="text"
              className="field-input"
              placeholder="e.g. Amara Osei"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label className="field-label">Email Address</label>
            <input
              type="email"
              className="field-input"
              placeholder="e.g. amara@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label className="field-label">Source</label>
            <input
              type="text"
              className="field-input"
              placeholder="e.g. Website, Referral"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Adding...' : '+ Add Lead'}
        </button>
      </form>
    </section>
  );
}

export default LeadForm;