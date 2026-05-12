// Guests.jsx - Manages hotel guest profiles, identification details, and VIP preferences
import { useState, useEffect } from 'react';
import API from '../../services/api';
import { HiPlus, HiPencil, HiTrash, HiX, HiStar, HiEye, HiOutlineIdentification, HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail } from 'react-icons/hi';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../../context/ToastContext';

const Guests = () => {
  const [guests, setGuests] = useState([]); // List of registered guests
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [editing, setEditing] = useState(null); // Tracks if modal is in edit mode
  const { addToast } = useToast();

  // Initial structure for the guest registration form
  const emptyForm = {
    firstName: '', lastName: '', email: '', phone: '', idNumber: '', idType: 'CNIC',
    address: '', city: '', country: 'Pakistan', isVIP: false, notes: '',
    cnicFrontImage: '', cnicBackImage: '',
    preferences: { roomType: '', floorPreference: 'Any', specialRequests: '' }
  };
  const [form, setForm] = useState(emptyForm);

  // ============ GUEST DATA ACQUISITION ============
  const fetchGuests = async () => {
    try {
      const res = await API.get('/guests');
      if (res.data.success) setGuests(res.data.guests);
    } catch (err) { console.error('Failed to fetch guests:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchGuests(); }, []);

  // ============ FORM INPUT HANDLING ============
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Handle nested preference fields
    if (name.startsWith('pref_')) {
      const key = name.replace('pref_', '');
      setForm({ ...form, preferences: { ...form.preferences, [key]: value } });
    } else {
      setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // ============ MODAL CONTROL LOGIC ============
  const openModal = (guest = null) => {
    if (guest) {
      setEditing(guest);
      setForm({
        firstName: guest.firstName, lastName: guest.lastName, email: guest.email || '',
        phone: guest.phone, idNumber: guest.idNumber || '', idType: guest.idType || 'CNIC',
        address: guest.address || '', city: guest.city || '', country: guest.country || 'Pakistan',
        isVIP: guest.isVIP || false, notes: guest.notes || '',
        cnicFrontImage: guest.cnicFrontImage || '',
        cnicBackImage: guest.cnicBackImage || '',
        preferences: guest.preferences || { roomType: '', floorPreference: 'Any', specialRequests: '' }
      });
    } else { 
      setEditing(null); 
      setForm(emptyForm); 
    }
    setShowModal(true);
  };

  const openDetails = (guest) => {
    setSelectedGuest(guest);
    setShowDetailsModal(true);
  };

  // ============ FORM SUBMISSION (ADD/EDIT) ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/guests/${editing._id}`, form);
        addToast('Updated', 'Guest profile successfully updated!', 'success');
      } else {
        await API.post('/guests', form);
        addToast('Registered', 'New guest profile successfully created!', 'success');
      }
      fetchGuests(); 
      setShowModal(false); 
      setEditing(null);
    } catch (err) { 
      addToast('Error', err.response?.data?.message || 'Failed to save guest profile', 'error');
    }
  };

  // ============ GUEST DELETION LOGIC ============
  const openDelete = (id) => {
    setTargetId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/guests/${targetId}`);
      addToast('Deleted', 'Guest profile has been permanently removed.', 'success');
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
        <div><h1>👥 Guest Management</h1><p className="page-subtitle">Oversee guest records, identification, and VIP designations</p></div>
        <button className="btn btn-primary" onClick={() => openModal()}><HiPlus /> Register New Guest</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Full Name</th><th>Contact</th><th>Email</th><th>ID Details</th><th>City</th><th>VIP Status</th><th>Actions</th></tr>
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
                      <button className="btn-icon" onClick={() => openDetails(g)} title="View Documents"><HiEye /></button>
                      <button className="btn-icon btn-edit" onClick={() => openModal(g)} title="Edit Profile"><HiPencil /></button>
                      <button className="btn-icon btn-delete" onClick={() => openDelete(g._id)} title="Delete Record"><HiTrash /></button>
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan="7" className="empty-state">No guest records found in the database.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guest Record Modal (Add/Edit) */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Guest Profile' : 'Register New Guest'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}><HiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group"><label>First Name</label><input name="firstName" value={form.firstName} onChange={handleChange} required placeholder="e.g. John" /></div>
                <div className="form-group"><label>Last Name</label><input name="lastName" value={form.lastName} onChange={handleChange} required placeholder="e.g. Doe" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Phone Number</label><input name="phone" value={form.phone} onChange={handleChange} required placeholder="+92 300 1234567" /></div>
                <div className="form-group"><label>Email Address</label><input name="email" type="email" value={form.email} onChange={handleChange} placeholder="guest@email.com" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>ID Type</label>
                  <select name="idType" value={form.idType} onChange={handleChange}>
                    <option value="CNIC">CNIC / ID Card</option><option value="Passport">Passport</option><option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group"><label>ID Number</label><input name="idNumber" value={form.idNumber} onChange={handleChange} placeholder="Identification Number" /></div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>CNIC Front Image</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'cnicFrontImage')} />
                </div>
                <div className="form-group">
                  <label>CNIC Back Image</label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'cnicBackImage')} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group"><label>City</label><input name="city" value={form.city} onChange={handleChange} /></div>
                <div className="form-group"><label>Country</label><input name="country" value={form.country} onChange={handleChange} /></div>
              </div>
              <div className="form-group" style={{display:'flex',alignItems:'center',gap:'10px', marginTop: '10px'}}>
                <input type="checkbox" name="isVIP" checked={form.isVIP} onChange={handleChange} style={{width:'18px', height: '18px'}} />
                <label style={{margin:0, fontWeight: '600', cursor: 'pointer'}}>Designate as VIP Guest (Priority Status)</label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update Account' : 'Confirm Registration'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Guest Details Modal (View Documents) */}
      {showDetailsModal && selectedGuest && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2>Guest Identity Documents</h2>
              <button className="btn-close" onClick={() => setShowDetailsModal(false)}><HiX /></button>
            </div>
            <div className="profile-details-content" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <div>
                  <h2 style={{ fontSize: '1.8rem', color: 'white' }}>{selectedGuest.firstName} {selectedGuest.lastName}</h2>
                  <p style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{selectedGuest.isVIP ? 'VIP GUEST' : 'REGULAR GUEST'}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}><HiOutlineMail /> {selectedGuest.email || 'No email'}</p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}><HiOutlinePhone /> {selectedGuest.phone}</p>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Identification</label>
                    <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{selectedGuest.idType}: {selectedGuest.idNumber || 'Not provided'}</p>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Address</label>
                    <p>{selectedGuest.address || 'No address'}, {selectedGuest.city}, {selectedGuest.country}</p>
                  </div>
                </div>
              </div>

              <div className="cnic-images-section">
                <h4 style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <HiOutlineIdentification /> Verification Documents
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div className="cnic-img-box">
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>FRONT SIDE</p>
                    <div style={{ height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {selectedGuest.cnicFrontImage ? (
                        <img src={selectedGuest.cnicFrontImage} alt="CNIC Front" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      ) : (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No image uploaded</p>
                      )}
                    </div>
                  </div>
                  <div className="cnic-img-box">
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '8px' }}>BACK SIDE</p>
                    <div style={{ height: '200px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {selectedGuest.cnicBackImage ? (
                        <img src={selectedGuest.cnicBackImage} alt="CNIC Back" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Guest Record"
        message="Are you sure you want to permanently delete this guest profile? This action is irreversible."
        confirmText="Confirm Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Guests;
