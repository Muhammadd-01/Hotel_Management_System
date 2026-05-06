// Maintenance.jsx - Yeh page hotel ke repairs aur maintenance requests ke liye hai
import { useState, useEffect } from 'react';
import API from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { HiPlus, HiX } from 'react-icons/hi';

const Maintenance = () => {
  const [requests, setRequests] = useState([]); // Maintenance requests ki list
  const [rooms, setRooms] = useState([]); // Rooms ki list
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Nayi request ka form data
  const [form, setForm] = useState({ room: '', title: '', description: '', priority: 'Medium' });

  // ============ DATA LOAD KARNE KA FUNCTION ============
  const fetchData = async () => {
    try {
      const [reqRes, roomRes] = await Promise.all([API.get('/maintenance'), API.get('/rooms')]);
      if (reqRes.data.success) setRequests(reqRes.data.requests);
      if (roomRes.data.success) setRooms(roomRes.data.rooms);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // ============ NAYI REQUEST SUBMIT KARNA ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/maintenance', form);
      setSuccess('Maintenance request submit ho gayi!');
      setShowModal(false);
      setForm({ room: '', title: '', description: '', priority: 'Medium' });
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError(err.response?.data?.message || 'Submit nahi ho saki'); }
  };

  // ============ REQUEST KA STATUS UPDATE KARNA ============
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/maintenance/${id}`, { status });
      setSuccess(`Issue ab "${status}" ho gaya hai.`);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError('Update nahi ho saka'); }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="maintenance-page">
      <div className="page-header">
        <div><h1>🔧 Maintenance</h1><p className="page-subtitle">Rooms ke technical masle aur repairs yahan se report karein</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><HiPlus /> Report Issue</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Room</th><th>Issue Title</th><th>Priority</th><th>Status</th><th>Date Reported</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {requests.length > 0 ? requests.map(r => (
                <tr key={r._id}>
                  <td><strong>Room {r.room?.roomNumber}</strong></td>
                  <td>{r.title} <br/><small className="text-muted">{r.description}</small></td>
                  <td><span className={`status-badge ${r.priority === 'Critical' ? 'badge-danger' : 'badge-warning'}`}>{r.priority}</span></td>
                  <td><StatusBadge status={r.status} /></td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      {/* Status ke hisaab se buttons dikhao */}
                      {r.status === 'Reported' && <button className="btn-sm btn-success" onClick={() => updateStatus(r._id, 'In Progress')}>Start Work</button>}
                      {r.status === 'In Progress' && <button className="btn-sm btn-success" onClick={() => updateStatus(r._id, 'Resolved')}>Resolve</button>}
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan="6" className="empty-state">Koi maintenance request nahi hai</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Issue Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Report Maintenance Issue</h2><button className="btn-close" onClick={() => setShowModal(false)}><HiX /></button></div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group"><label>Room</label>
                <select value={form.room} onChange={e => setForm({...form, room: e.target.value})} required>
                  <option value="">-- Room select karein --</option>
                  {rooms.map(r => <option key={r._id} value={r._id}>Room {r.roomNumber}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Issue Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. AC cooling nahi kar raha" required /></div>
              <div className="form-group"><label>Details</label><input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Masle ki tafseel likhein" required /></div>
              <div className="form-group"><label>Priority</label>
                <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                  <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
