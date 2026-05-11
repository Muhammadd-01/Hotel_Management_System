// Guests.jsx - Yeh page hotel ke guests ki profiles aur preferences manage karta hai
import { useState, useEffect } from 'react';
import API from '../../services/api';
import { HiPlus, HiPencil, HiTrash, HiX, HiStar } from 'react-icons/hi';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../../context/ToastContext';

const Guests = () => {
  const [guests, setGuests] = useState([]); // List of guests
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [editing, setEditing] = useState(null); // Edit mode check
  const { addToast } = useToast();

  // Khali guest form ki initial state
  const emptyForm = {
    firstName: '', lastName: '', email: '', phone: '', idNumber: '', idType: 'CNIC',
    address: '', city: '', country: 'Pakistan', isVIP: false, notes: '',
    preferences: { roomType: '', floorPreference: 'Any', specialRequests: '' }
  };
  const [form, setForm] = useState(emptyForm);

  // ============ GUESTS LOAD KARNE KA FUNCTION ============
  const fetchGuests = async () => {
    try {
      const res = await API.get('/guests');
      if (res.data.success) setGuests(res.data.guests);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchGuests(); }, []);

  // ============ INPUT CHANGE HANDLE KARNA ============
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Agar preference wali field hai to nested object update karo
    if (name.startsWith('pref_')) {
      const key = name.replace('pref_', '');
      setForm({ ...form, preferences: { ...form.preferences, [key]: value } });
    } else {
      setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    }
  };

  // ============ MODAL OPEN KARNA ============
  const openModal = (guest = null) => {
    setError('');
    if (guest) {
      setEditing(guest);
      setForm({
        firstName: guest.firstName, lastName: guest.lastName, email: guest.email || '',
        phone: guest.phone, idNumber: guest.idNumber || '', idType: guest.idType || 'CNIC',
        address: guest.address || '', city: guest.city || '', country: guest.country || 'Pakistan',
        isVIP: guest.isVIP || false, notes: guest.notes || '',
        preferences: guest.preferences || { roomType: '', floorPreference: 'Any', specialRequests: '' }
      });
    } else { setEditing(null); setForm(emptyForm); }
    setShowModal(true);
  };

  // ============ FORM SUBMIT (ADD/EDIT) ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/guests/${editing._id}`, form);
        addToast('Updated', 'Guest profile updated successfully!', 'success');
      } else {
        await API.post('/guests', form);
        addToast('Registered', 'New guest profile created successfully!', 'success');
      }
      fetchGuests(); setShowModal(false); setEditing(null);
    } catch (err) { 
      addToast('Error', err.response?.data?.message || 'Could not save guest profile', 'error');
    }
  };

  // ============ DELETE GUEST ============
  const openDelete = (id) => {
    setTargetId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/guests/${targetId}`);
      addToast('Deleted', 'Guest profile has been removed.', 'success');
      fetchGuests();
      setShowConfirm(false);
    } catch (err) { 
      addToast('Error', 'Failed to delete profile.', 'error');
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="guests-page">
      <div className="page-header">
        <div><h1>Guest Management</h1><p className="page-subtitle">Manage guest information and VIP status here</p></div>
        <button className="btn btn-primary" onClick={() => openModal()}><HiPlus /> Add Guest</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Phone</th><th>Email</th><th>ID Details</th><th>City</th><th>VIP</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {guests.length > 0 ? guests.map(g => (
                <tr key={g._id}>
                  <td><strong>{g.firstName} {g.lastName}</strong></td>
                  <td>{g.phone}</td>
                  <td>{g.email || '-'}</td>
                  <td>{g.idNumber ? `${g.idType}: ${g.idNumber}` : '-'}</td>
                  <td>{g.city || '-'}</td>
                  <td>{g.isVIP ? <span className="status-badge badge-warning"><HiStar /> VIP</span> : '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon btn-edit" onClick={() => openModal(g)}><HiPencil /></button>
                      <button className="btn-icon btn-delete" onClick={() => openDelete(g._id)}><HiTrash /></button>
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan="7" className="empty-state">No guest profiles found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guest Modal Form */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Guest Details' : 'Register New Guest'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}><HiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group"><label>First Name</label><input name="firstName" value={form.firstName} onChange={handleChange} required /></div>
                <div className="form-group"><label>Last Name</label><input name="lastName" value={form.lastName} onChange={handleChange} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Phone</label><input name="phone" value={form.phone} onChange={handleChange} required /></div>
                <div className="form-group"><label>Email Address</label><input name="email" type="email" value={form.email} onChange={handleChange} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>ID Type</label>
                  <select name="idType" value={form.idType} onChange={handleChange}>
                    <option value="CNIC">CNIC</option><option value="Passport">Passport</option><option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group"><label>ID Number</label><input name="idNumber" value={form.idNumber} onChange={handleChange} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>City</label><input name="city" value={form.city} onChange={handleChange} /></div>
                <div className="form-group"><label>Country</label><input name="country" value={form.country} onChange={handleChange} /></div>
              </div>
              <div className="form-group" style={{display:'flex',alignItems:'center',gap:'8px'}}>
                <input type="checkbox" name="isVIP" checked={form.isVIP} onChange={handleChange} style={{width:'auto'}} />
                <label style={{margin:0}}>VIP Guest (Special Badge)</label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update Profile' : 'Save Guest'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Guest Profile"
        message="Are you sure you want to delete this guest profile? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Guests;
