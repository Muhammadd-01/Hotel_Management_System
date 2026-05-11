// Rooms.jsx - Yeh page hotel ke saare rooms manage karta hai
import { useState, useEffect } from 'react';
import API from '../../services/api';
import StatusBadge from '../components/StatusBadge';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../../context/ToastContext';

const Rooms = () => {
  const [rooms, setRooms] = useState([]); // List of rooms
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [editing, setEditing] = useState(null); // Edit mode check
  const { addToast } = useToast();

  // Naye room ka empty form
  const [form, setForm] = useState({ roomNumber: '', type: 'Single', price: '', status: 'Available', images: [], description: '' });

  // ============ DATA FETCH KARNE KA FUNCTION ============
  const fetchRooms = async () => {
    try {
      const res = await API.get('/rooms');
      if (res.data.success) setRooms(res.data.rooms);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRooms(); }, []);

  // ============ MODAL OPEN KARNE KA LOGIC ============
  const openModal = (room = null) => {
    if (room) {
      setEditing(room);
      setForm({ roomNumber: room.roomNumber, type: room.type, price: room.price, status: room.status, images: room.images || [], description: room.description || '' });
    } else {
      setEditing(null);
      setForm({ roomNumber: '', type: 'Single', price: '', status: 'Available', images: [], description: '' });
    }
    setShowModal(true);
  };

  // ============ IMAGE UPLOAD HANDLER ============
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  // ============ FORM SUBMIT (ADD/UPDATE) ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/rooms/${editing._id}`, form);
        addToast('Updated', 'Room details updated successfully!', 'success');
      } else {
        await API.post('/rooms', form);
        addToast('Added', 'New room added to inventory!', 'success');
      }
      fetchRooms(); setShowModal(false);
    } catch (err) {
      addToast('Error', err.response?.data?.message || 'Could not save room details', 'error');
    }
  };

  // ============ DELETE ROOM ============
  const openDelete = (id) => {
    setTargetId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/rooms/${targetId}`);
      addToast('Deleted', 'Room removed from inventory.', 'success');
      fetchRooms();
      setShowConfirm(false);
    } catch (err) { 
      addToast('Error', 'Failed to delete room.', 'error');
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="rooms-page">
      {/* Header section */}
      <div className="page-header">
        <div><h1>Room Management</h1><p className="page-subtitle">Manage hotel room inventory and status here</p></div>
        <button className="btn btn-primary" onClick={() => openModal()}><HiPlus /> Add New Room</button>
      </div>

      {/* Rooms Table Card */}
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Room #</th><th>Type</th><th>Price (Rs.)</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {rooms.length > 0 ? rooms.map(room => (
                <tr key={room._id}>
                  <td><strong>{room.roomNumber}</strong></td>
                  <td>{room.type}</td>
                  <td>{room.price?.toLocaleString()}</td>
                  <td><StatusBadge status={room.status} /></td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon btn-edit" onClick={() => openModal(room)}><HiPencil /></button>
                      <button className="btn-icon btn-delete" onClick={() => openDelete(room._id)}><HiTrash /></button>
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan="5" className="empty-state">No rooms found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal Popup */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Room' : 'Add New Room'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}><HiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Room Number</label>
                <input value={form.roomNumber} onChange={e => setForm({...form, roomNumber: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Room Type</label>
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                  <option value="Single">Single</option><option value="Double">Double</option>
                  <option value="Deluxe">Deluxe</option><option value="Suite">Suite</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price per Night</label>
                <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Initial Status</label>
                <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                  <option value="Available">Available</option><option value="Cleaning">Cleaning</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
              <div className="form-group">
                <label>Room Description</label>
                <textarea 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                  placeholder="Enter a luxurious description for this room..."
                  style={{ width: '100%', minHeight: '80px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
              <div className="form-group">
                <label>Room Images (Upload from Device)</label>
                <div className="ws-upload-container" style={{ border: '2px dashed #ddd', padding: '20px', borderRadius: '12px', textAlign: 'center', background: '#f9f9f9' }}>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    style={{ display: 'none' }} 
                    id="file-upload" 
                  />
                  <label htmlFor="file-upload" style={{ cursor: 'pointer', color: 'var(--accent)', fontWeight: 'bold' }}>
                    Click to select images from your device
                  </label>
                </div>
                
                {/* Preview Gallery */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '15px' }}>
                  {form.images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', height: '80px' }}>
                      <img src={img} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                      <button 
                        type="button" 
                        onClick={() => removeImage(idx)}
                        style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '12px', cursor: 'pointer' }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update Room' : 'Create Room'}</button>
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
        title="Delete Room"
        message="Are you sure you want to delete this room? This action will permanently remove it from the system."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Rooms;
