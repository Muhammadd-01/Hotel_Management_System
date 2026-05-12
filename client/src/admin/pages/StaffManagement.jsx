// StaffManagement.jsx - Yeh page sirf Admin ke liye hai taake staff accounts manage karein
import { useState, useEffect } from 'react';
import API from '../../services/api';
import { HiPencil, HiTrash, HiX, HiPlus } from 'react-icons/hi';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../../context/ToastContext';

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]); // List of all staff members
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetStaff, setTargetStaff] = useState(null);
  const [editing, setEditing] = useState(null);
  const { addToast } = useToast();
  
  // Form state
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' });

  // ============ STAFF LOAD KARNE KA FUNCTION ============
  const fetchStaff = async () => {
    try {
      const res = await API.get('/staff');
      if (res.data.success) setStaffList(res.data.staff);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStaff(); }, []);

  // ============ MODAL LOGIC ============
  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', email: '', password: '', role: 'staff' });
    setShowModal(true);
  };

  const openEdit = (staff) => {
    setEditing(staff);
    setForm({ name: staff.name, email: staff.email, password: '', role: staff.role });
    setShowModal(true);
  };

  // ============ FORM SUBMIT (ADD/UPDATE) ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        // Update existing staff
        await API.put(`/staff/${editing._id}`, { name: form.name, email: form.email, role: form.role });
        addToast('Success', 'Staff details updated successfully!', 'success');
      } else {
        // Create new staff
        await API.post('/auth/register', form);
        addToast('Success', 'New staff member added successfully!', 'success');
      }
      setShowModal(false);
      fetchStaff();
    } catch (err) { 
      addToast('Error', err.response?.data?.message || 'Could not save staff details.', 'error');
    }
  };

  // ============ DEACTIVATE STAFF (DELETE) ============
  const openDeactivate = (staff) => {
    setTargetStaff(staff);
    setShowConfirm(true);
  };

  const confirmDeactivate = async () => {
    try {
      await API.delete(`/staff/${targetStaff._id}`);
      addToast('Account Deactivated', `Account for ${targetStaff.name} has been closed.`, 'success');
      fetchStaff();
      setShowConfirm(false);
    } catch (err) { 
      addToast('Error', 'Failed to deactivate account.', 'error');
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="staff-page">
      <div className="page-header">
        <div><h1>👥 Staff Management</h1><p className="page-subtitle">Manage employee accounts and system roles (Admin Only)</p></div>
        <button className="btn btn-primary" onClick={openAdd}><HiPlus /> Add Staff</button>
      </div>

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
                      <button className="btn-icon btn-delete" onClick={() => openDeactivate(s)} title="Deactivate"><HiTrash /></button>
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
            <div className="modal-header"><h2>{editing ? 'Edit Staff Member' : 'Add New Staff'}</h2><button className="btn-close" onClick={() => setShowModal(false)}><HiX /></button></div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group"><label>Full Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div className="form-group"><label>Email Address</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
              {!editing && (
                <div className="form-group"><label>Initial Password</label><input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>
              )}
              <div className="form-group"><label>Role</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="housekeeping">Housekeeping</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update Account' : 'Register Staff'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Deactivate Confirmation Modal */}
      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDeactivate}
        title="Deactivate Account"
        message={`Are you sure you want to deactivate ${targetStaff?.name}'s account? This action will revoke their access.`}
        confirmText="Deactivate"
        cancelText="Cancel"
      />
    </div>
  );
};

export default StaffManagement;
