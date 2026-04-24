import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LeadList({ refresh }) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/leads');
      setLeads(response.data);
    } catch (err) {
      setError('Failed to fetch leads');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [refresh]);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/leads/${leadId}`, {
        status: newStatus,
      });
      fetchLeads();
    } catch (err) {
      setError('Failed to update lead status');
      console.error(err);
    }
  };

  if (loading) return <p>Loading leads...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="lead-list">
      <h2>Leads</h2>
      {leads.length === 0 ? (
        <p>No leads found</p>
      ) : (
        leads.map((lead) => (
          <div key={lead.id} style={{ border: '1px solid black', margin: '10px', padding: '10px' }}>
            <p><strong>Name:</strong> {lead.name}</p>
            <p><strong>Email:</strong> {lead.email}</p>
            <p><strong>Source:</strong> {lead.source || 'N/A'}</p>

            <select
              value={lead.status}
              onChange={(e) => handleStatusChange(lead.id, e.target.value)}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
}

export default LeadList;