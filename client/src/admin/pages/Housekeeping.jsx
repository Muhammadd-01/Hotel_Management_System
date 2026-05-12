// Housekeeping.jsx - Manages room cleaning tasks and staff assignments
import { useState, useEffect } from 'react';
import API from '../../services/api';
import StatusBadge from '../components/StatusBadge';
import { HiPlus, HiX, HiCheck } from 'react-icons/hi';

const Housekeeping = () => {
  const [tasks, setTasks] = useState([]); // List of cleaning tasks
  const [rooms, setRooms] = useState([]); // Room inventory for assignment
  const [staff, setStaff] = useState([]); // Available personnel list
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initial state for new task form
  const [form, setForm] = useState({ room: '', taskType: 'Cleaning', priority: 'Medium', assignedTo: '', notes: '' });

  // ============ DATA ACQUISITION LOGIC (Tasks, Rooms, Personnel) ============
  const fetchData = async () => {
    try {
      const [taskRes, roomRes, staffRes] = await Promise.all([
        API.get('/housekeeping'),
        API.get('/rooms'),
        API.get('/staff').catch(() => ({ data: { staff: [] } }))
      ]);
      if (taskRes.data.success) setTasks(taskRes.data.tasks);
      if (roomRes.data.success) setRooms(roomRes.data.rooms);
      if (staffRes.data?.staff) setStaff(staffRes.data.staff);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // ============ NEW TASK CREATION ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/housekeeping', form);
      setSuccess('Housekeeping task successfully assigned!');
      setShowModal(false);
      setForm({ room: '', taskType: 'Cleaning', priority: 'Medium', assignedTo: '', notes: '' });
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError(err.response?.data?.message || 'Failed to assign task'); }
  };

  // ============ STATUS UPDATE LOGIC ============
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/housekeeping/${id}`, { status });
      setSuccess(`Task status updated to "${status}".`);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError('Failed to update task status'); }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="housekeeping-page">
      <div className="page-header">
        <div><h1>🧹 Housekeeping</h1><p className="page-subtitle">Monitor room cleanliness and manage maintenance tasks</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><HiPlus /> New Assignment</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Room</th><th>Task Type</th><th>Priority</th><th>Assigned To</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {tasks.length > 0 ? tasks.map(t => (
                <tr key={t._id}>
                  <td><strong>Room {t.room?.roomNumber}</strong></td>
                  <td>{t.taskType}</td>
                  <td><span className={`status-badge ${t.priority === 'Urgent' ? 'badge-danger' : 'badge-warning'}`}>{t.priority}</span></td>
                  <td>{t.assignedTo?.name || 'Unassigned'}</td>
                  <td><StatusBadge status={t.status} /></td>
                  <td>
                    <div className="action-buttons">
                      {/* Workflow control: Start Pending, Complete In-Progress */}
                      {t.status === 'Pending' && <button className="btn-sm btn-success" onClick={() => updateStatus(t._id, 'In Progress')}>Start</button>}
                      {t.status === 'In Progress' && <button className="btn-sm btn-success" onClick={() => updateStatus(t._id, 'Completed')}><HiCheck /> Done</button>}
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan="6" className="empty-state">No housekeeping tasks found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Assignment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Assign New Task</h2><button className="btn-close" onClick={() => setShowModal(false)}><HiX /></button></div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group"><label>Target Room</label>
                <select value={form.room} onChange={e => setForm({...form, room: e.target.value})} required>
                  <option value="">-- Select Room --</option>
                  {rooms.map(r => <option key={r._id} value={r._id}>Room {r.roomNumber} ({r.status})</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Category</label>
                  <select value={form.taskType} onChange={e => setForm({...form, taskType: e.target.value})}>
                    <option>Cleaning</option><option>Deep Cleaning</option><option>Linen Change</option><option>Restocking</option>
                  </select>
                </div>
                <div className="form-group"><label>Priority Level</label>
                  <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                    <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Assign Personnel</label>
                <select value={form.assignedTo} onChange={e => setForm({...form, assignedTo: e.target.value})}>
                  <option value="">-- Select Member --</option>
                  {staff.map(s => <option key={s._id} value={s._id}>{s.name} ({s.role})</option>)}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Assign Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Housekeeping;
