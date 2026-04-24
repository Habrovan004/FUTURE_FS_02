import React, { useState, useEffect } from 'react';
import axios from 'axios';

const STATUS_CONFIG = {
  new:       { label: 'New',       color: 'status-new' },
  contacted: { label: 'Contacted', color: 'status-contacted' },
  converted: { label: 'Converted', color: 'status-converted' },
};

function LeadCard({ lead, onStatusChange }) {
  const [noteText, setNoteText] = useState('');
  const [notes, setNotes] = useState(lead.notes || []);
  const [showNotes, setShowNotes] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [noteError, setNoteError] = useState('');

  const cfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;

  const handleNoteSubmit = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setAddingNote(true);
    setNoteError('');
    try {
      const res = await axios.post(`http://localhost:5000/api/leads/${lead.id}/notes`, {
        text: noteText.trim(),
      });
      setNotes(res.data.notes || []);
      setNoteText('');
    } catch {
      setNoteError('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  return (
    <div className="lead-card">
      <div className="lead-card-top">
        <div className="lead-avatar">
          {lead.name.charAt(0).toUpperCase()}
        </div>
        <div className="lead-info">
          <div className="lead-name">{lead.name}</div>
          <div className="lead-email">{lead.email}</div>
          {lead.source && (
            <div className="lead-source">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M6 1l1.5 3h3l-2.5 2 1 3L6 7.5 3 9l1-3L1.5 4h3z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round"/>
              </svg>
              {lead.source}
            </div>
          )}
        </div>
        <div className="lead-actions">
          <span className={`status-badge ${cfg.color}`}>{cfg.label}</span>
          <select
            className="status-select"
            value={lead.status}
            onChange={(e) => onStatusChange(lead.id, e.target.value)}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </div>

      <div className="lead-card-footer">
        <button
          className="notes-toggle"
          onClick={() => setShowNotes(v => !v)}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M4 5h6M4 7.5h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {notes.length > 0 ? `${notes.length} note${notes.length > 1 ? 's' : ''}` : 'Notes'}
          <svg
            width="12" height="12" viewBox="0 0 12 12" fill="none"
            style={{ transform: showNotes ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          >
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {showNotes && (
        <div className="notes-panel">
          {notes.length === 0 && (
            <p className="notes-empty">No notes yet. Add one below.</p>
          )}
          <div className="notes-list">
            {notes.map((note, i) => (
              <div key={i} className="note-item">
                <div className="note-text">{note.text}</div>
                <div className="note-date">
                  {new Date(note.date).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
          </div>

          {noteError && <p className="notes-error">{noteError}</p>}

          <form className="note-form" onSubmit={handleNoteSubmit}>
            <input
              className="note-input"
              type="text"
              placeholder="Write a note..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <button className="note-submit" type="submit" disabled={addingNote}>
              {addingNote ? '...' : 'Add'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function LeadList({ refresh }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:5000/api/leads');
      setLeads(res.data);
    } catch {
      setError('Failed to fetch leads. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, [refresh]);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/leads/${leadId}`, { status: newStatus });
      fetchLeads();
    } catch {
      setError('Failed to update status');
    }
  };

  const filtered = filter === 'all' ? leads : leads.filter(l => l.status === filter);

  const counts = {
    all: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    contacted: leads.filter(l => l.status === 'contacted').length,
    converted: leads.filter(l => l.status === 'converted').length,
  };

  return (
    <section className="list-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">Leads Pipeline</h2>
          <p className="section-desc">{leads.length} total lead{leads.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="filter-tabs">
        {['all', 'new', 'contacted', 'converted'].map(tab => (
          <button
            key={tab}
            className={`filter-tab ${filter === tab ? 'active' : ''}`}
            onClick={() => setFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            <span className="tab-count">{counts[tab]}</span>
          </button>
        ))}
      </div>

      {error && (
        <div className="alert alert-error">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M8 5v3M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {error}
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner" />
          <span>Loading leads...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
            <path d="M14 20h12M20 14v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
          </svg>
          <p>{filter === 'all' ? 'No leads yet. Add your first lead above.' : `No ${filter} leads.`}</p>
        </div>
      ) : (
        <div className="leads-grid">
          {filtered.map(lead => (
            <LeadCard key={lead.id} lead={lead} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}
    </section>
  );
}

export default LeadList;