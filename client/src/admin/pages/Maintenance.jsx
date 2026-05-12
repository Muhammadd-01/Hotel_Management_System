// Maintenance.jsx - Manages hotel facility repairs, technical requests, and maintenance logs
import { useState, useEffect } from 'react';
import API from '../../services/api';
import StatusBadge from '../components/StatusBadge';
import { HiPlus, HiX } from 'react-icons/hi';

const Maintenance = () => {
  const [requests, setRequests] = useState([]); // List of technical maintenance requests
  const [rooms, setRooms] = useState([]); // Room inventory list
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initial structure for new maintenance reporting
  const [form, setForm] = useState({ room: '', title: '', description: '', priority: 'Medium' });

  // ============ DATA SYNCHRONIZATION LOGIC ============
  const fetchData = async () => {
    try {
      const [reqRes, roomRes] = await Promise.all([API.get('/maintenance'), API.get('/rooms')]);
      if (reqRes.data.success) setRequests(reqRes.data.requests);
      if (roomRes.data.success) setRooms(roomRes.data.rooms);
    } catch (err) { 
      console.error('Data acquisition failed:', err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ============ REPORT SUBMISSION LOGIC ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/maintenance', form);
      setSuccess('Maintenance request successfully registered!');
      setShowModal(false);
      setForm({ room: '', title: '', description: '', priority: 'Medium' });
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { 
      setError(err.response?.data?.message || 'Transaction failed. Could not register request.'); 
    }
  };

  // ============ OPERATIONAL STATUS UPDATES ============
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/maintenance/${id}`, { status });
      setSuccess(`Issue status successfully updated to "${status}".`);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { 
      setError('Failed to update technical status.'); 
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="maintenance-page">
      <div className="page-header">
        <div><h1>🛠️ Facility Maintenance</h1><p className="page-subtitle">Monitor technical issues, manage repairs, and track room diagnostics</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><HiPlus /> Report New Issue</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Target Room</th><th>Technical Description</th><th>Priority</th><th>Current Status</th><th>Date Reported</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {requests.length > 0 ? requests.map(r => (
                <tr key={r._id}>
                  <td><strong>Room {r.room?.roomNumber}</strong></td>
                  <td>
                    <div style={{fontWeight: '600', color: 'var(--text-primary)'}}>{r.title}</div>
                    <small className="text-muted">{r.description}</small>
                  </td>
                  <td><span className={`status-badge ${r.priority === 'Critical' ? 'badge-danger' : 'badge-warning'}`}>{r.priority}</span></td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      {/* Workflow control based on current status */}
                      {r.status === 'Reported' && <button className="btn-sm btn-success" onClick={() => updateStatus(r._id, 'In Progress')}>Authorize Repair</button>}
                      {r.status === 'In Progress' && <button className="btn-sm btn-success" onClick={() => updateStatus(r._id, 'Resolved')}>Finalize & Close</button>}
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan="6" className="empty-state">No active maintenance requests detected.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technical Issue Documentation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Document Technical Issue</h2><button className="btn-close" onClick={() => setShowModal(false)}><HiX /></button></div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group"><label>Room Assignment</label>
                <select value={form.room} onChange={e => setForm({...form, room: e.target.value})} required>
                  <option value="">-- Select Room Number --</option>
                  {rooms.map(r => <option key={r._id} value={r._id}>Room {r.roomNumber}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Issue Overview</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. HVAC system failure" required /></div>
              <div className="form-group"><label>Detailed Observations</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Describe the technical fault in detail..." style={{height:'80px'}} required /></div>
              <div className="form-group"><label>Severity Level</label>
                <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                  <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Technical Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
