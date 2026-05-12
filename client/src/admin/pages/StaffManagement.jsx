// StaffManagement.jsx - Admin page for managing personnel accounts and system roles
import { useState, useEffect } from 'react';
import API from '../../services/api';
import { HiPencil, HiTrash, HiX, HiPlus, HiEye, HiOutlineIdentification, HiOutlineLocationMarker, HiOutlinePhone } from 'react-icons/hi';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../../context/ToastContext';

const StaffManagement = () => {
  const [staffList, setStaffList] = useState([]); // List of all registered personnel
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [targetStaff, setTargetStaff] = useState(null);
  const [editing, setEditing] = useState(null);
  const { addToast } = useToast();
  
  // Form state
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'receptionist' });

  // ============ FETCH PERSONNEL DATA ============
  const fetchStaff = async () => {
    try {
      const res = await API.get('/staff');
      if (res.data.success) setStaffList(res.data.staff);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStaff(); }, []);

  // ============ MODAL CONTROLS ============
  const openAdd = () => {
    setEditing(null);
    setForm({ name: '', email: '', password: '', role: 'receptionist' });
    setShowModal(true);
  };

  const openEdit = (staff) => {
    setEditing(staff);
    setForm({ name: staff.name, email: staff.email, password: '', role: staff.role });
    setShowModal(true);
  };

  const openDetails = (staff) => {
    setSelectedStaff(staff);
    setShowDetailsModal(true);
  };

  // ============ FORM SUBMISSION (ADD/UPDATE) ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        // Update existing record
        await API.put(`/staff/${editing._id}`, { name: form.name, email: form.email, role: form.role });
        addToast('Success', 'Personnel details updated successfully!', 'success');
      } else {
        // Register new personnel
        await API.post('/auth/register', form);
        addToast('Success', 'New personnel member enrolled successfully!', 'success');
      }
      setShowModal(false);
      fetchStaff();
    } catch (err) { 
      addToast('Error', err.response?.data?.message || 'Could not save record.', 'error');
    }
  };

  // ============ DEACTIVATION LOGIC ============
  const openDeactivate = (staff) => {
    setTargetStaff(staff);
    setShowConfirm(true);
  };

  const confirmDeactivate = async () => {
    try {
      await API.delete(`/staff/${targetStaff._id}`);
      addToast('Account Deactivated', `The account for ${targetStaff.name} has been closed.`, 'success');
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
        <div><h1>👥 Personnel Management</h1><p className="page-subtitle">Manage employee accounts and system access roles (Admin Only)</p></div>
        <button className="btn btn-primary" onClick={openAdd}><HiPlus /> Add Personnel</button>
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
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {s.profileImage ? (
                        <img src={s.profileImage} alt={s.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                          {s.name.charAt(0)}
                        </div>
                      )}
                      <strong>{s.name}</strong>
                    </div>
                  </td>
                  <td>{s.email}</td>
                  <td>
                    <span className={`status-badge ${
                      s.role === 'superadmin' ? 'badge-warning' : 
                      s.role === 'manager' ? 'badge-success' : 
                      s.role === 'receptionist' ? 'badge-info' : 
                      s.role === 'housekeeping' ? 'badge-success-light' : 
                      s.role === 'maintenance' ? 'badge-warning-light' : 'badge-default'
                    }`}>
                      {s.role}
                    </span>
                  </td>
                  <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => openDetails(s)} title="View Profile"><HiEye /></button>
                      <button className="btn-icon btn-edit" onClick={() => openEdit(s)} title="Edit"><HiPencil /></button>
                      <button className="btn-icon btn-delete" onClick={() => openDeactivate(s)} title="Deactivate"><HiTrash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enrollment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>{editing ? 'Edit Personnel Member' : 'Enroll New Personnel'}</h2><button className="btn-close" onClick={() => setShowModal(false)}><HiX /></button></div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group"><label>Full Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div className="form-group"><label>Email Address</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
              {!editing && (
                <div className="form-group"><label>Initial Password</label><input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>
              )}
              <div className="form-group"><label>System Role</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                  <option value="manager">Manager</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="housekeeping">Housekeeping</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update Account' : 'Confirm Enrollment'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Personnel Details Modal (Profile View) */}
      {showDetailsModal && selectedStaff && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2>Personnel Profile</h2>
              <button className="btn-close" onClick={() => setShowDetailsModal(false)}><HiX /></button>
            </div>
            <div className="profile-details-content" style={{ padding: '20px' }}>
              <div className="profile-header" style={{ display: 'flex', gap: '30px', marginBottom: '30px', alignItems: 'center' }}>
                <div className="profile-avatar-large">
                  {selectedStaff.profileImage ? (
                    <img src={selectedStaff.profileImage} alt={selectedStaff.name} style={{ width: '120px', height: '120px', borderRadius: '24px', objectFit: 'cover', border: '3px solid var(--accent)' }} />
                  ) : (
                    <div style={{ width: '120px', height: '120px', borderRadius: '24px', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 'bold' }}>
                      {selectedStaff.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="profile-info">
                  <h2 style={{ fontSize: '2rem', marginBottom: '5px' }}>{selectedStaff.name}</h2>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>{selectedStaff.email}</p>
                  <span className={`status-badge ${
                    selectedStaff.role === 'superadmin' ? 'badge-warning' : 
                    selectedStaff.role === 'manager' ? 'badge-success' : 
                    selectedStaff.role === 'receptionist' ? 'badge-info' : 'badge-default'
                  }`}>
                    {selectedStaff.role.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div className="detail-item">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '5px' }}>
                    <HiOutlinePhone /> Contact Number
                  </label>
                  <p>{selectedStaff.phone || 'Not provided'}</p>
                </div>
                <div className="detail-item">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '5px' }}>
                    <HiOutlineIdentification /> CNIC Number
                  </label>
                  <p>{selectedStaff.cnicNumber || 'Not provided'}</p>
                </div>
                <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '5px' }}>
                    <HiOutlineLocationMarker /> Residential Address
                  </label>
                  <p>{selectedStaff.address || 'Not provided'}</p>
                </div>
              </div>

              <div className="cnic-images-section">
                <h4 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HiOutlineIdentification /> Identity Documents (CNIC)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="cnic-img-box">
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>FRONT SIDE</p>
                    <div style={{ height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {selectedStaff.cnicFrontImage ? (
                        <img src={selectedStaff.cnicFrontImage} alt="CNIC Front" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No image uploaded</p>
                      )}
                    </div>
                  </div>
                  <div className="cnic-img-box">
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>BACK SIDE</p>
                    <div style={{ height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {selectedStaff.cnicBackImage ? (
                        <img src={selectedStaff.cnicBackImage} alt="CNIC Back" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No image uploaded</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deactivation Confirmation Modal */}
      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDeactivate}
        title="Confirm Deactivation"
        message={`Are you sure you want to deactivate ${targetStaff?.name}'s account? Access will be revoked immediately.`}
        confirmText="Confirm"
        cancelText="Cancel"
      />
    </div>
  );
};

export default StaffManagement;
