// StaffManagement.jsx - Yeh page sirf Admin ke liye hai taake staff accounts manage karein
import { useState, useEffect } from 'react';
import API from '../services/api';
import { HiPencil, HiTrash, HiX } from 'react-icons/hi';

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]); // Saare staff members ki list
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Edit karne ke liye form state
  const [form, setForm] = useState({ name: '', email: '', role: 'staff' });

  // ============ STAFF LOAD KARNE KA FUNCTION ============
  const fetchStaff = async () => {
    try {
      const res = await API.get('/staff');
      if (res.data.success) setStaffList(res.data.staff);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStaff(); }, []);

  // ============ EDIT MODAL OPEN KARNA ============
  const openEdit = (staff) => {
    setEditing(staff);
    setForm({ name: staff.name, email: staff.email, role: staff.role });
    setShowModal(true);
  };

  // ============ UPDATE STAFF DETAILS ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/staff/${editing._id}`, form);
      setSuccess('Staff details update ho gayin!');
      setShowModal(false);
      fetchStaff();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError('Update nahi ho saka'); }
  };

  // ============ DEACTIVATE STAFF (DELETE) ============
  const handleDeactivate = async (id, name) => {
    if (!window.confirm(`Kya aap waqai "${name}" ka account deactivate karna chahte hain?`)) return;
    try {
      await API.delete(`/staff/${id}`);
      setSuccess('Account deactivate ho gaya.');
      fetchStaff();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError('Masla aa gaya'); }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="staff-page">
      <div className="page-header">
        <div><h1>👥 Staff Management</h1><p className="page-subtitle">Hotel ke staff accounts aur roles yahan se control karein (Admin Only)</p></div>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {staffList.map(s => (
                <tr key={s._id}>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.email}</td>
                  <td><span className={`status-badge ${s.role === 'admin' ? 'badge-warning' : 'badge-info'}`}>{s.role}</span></td>
                  <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon btn-edit" onClick={() => openEdit(s)}><HiPencil /></button>
                      <button className="btn-icon btn-delete" onClick={() => handleDeactivate(s._id, s.name)} title="Deactivate"><HiTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Edit Staff Member</h2><button className="btn-close" onClick={() => setShowModal(false)}><HiX /></button></div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group"><label>Full Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div className="form-group"><label>Email Address</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
              <div className="form-group"><label>Role</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="staff">Staff</option><option value="admin">Admin Manager</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
