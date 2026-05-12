// Rooms.jsx - Comprehensive interface for managing hotel room inventory, pricing, and availability status
import { useState, useEffect } from 'react';
import API from '../../services/api';
import StatusBadge from '../components/StatusBadge';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../../context/ToastContext';

const Rooms = () => {
  const [rooms, setRooms] = useState([]); // Master list of all hotel rooms
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [editing, setEditing] = useState(null); // Track specific room being edited
  const { addToast } = useToast();

  // Initial structure for new room creation
  const [form, setForm] = useState({ roomNumber: '', type: 'Single', price: '', status: 'Available', images: [], description: '' });

  // ============ INVENTORY DATA ACQUISITION ============
  const fetchRooms = async () => {
    try {
      const res = await API.get('/rooms');
      if (res.data.success) setRooms(res.data.rooms);
    } catch (err) { 
      console.error('Inventory fetch failed:', err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  // ============ MODAL CONTROL LOGIC ============
  const openModal = (room = null) => {
    if (room) {
      setEditing(room);
      setForm({ 
        roomNumber: room.roomNumber, 
        type: room.type, 
        price: room.price, 
        status: room.status, 
        images: room.images || [], 
        description: room.description || '' 
      });
    } else {
      setEditing(null);
      setForm({ roomNumber: '', type: 'Single', price: '', status: 'Available', images: [], description: '' });
    }
    setShowModal(true);
  };

  // ============ IMAGE PROCESSING HANDLER ============
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

  // ============ INVENTORY SUBMISSION (ADD/UPDATE) ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await API.put(`/rooms/${editing._id}`, form);
        addToast('Updated', 'Room configurations successfully synchronized!', 'success');
      } else {
        await API.post('/rooms', form);
        addToast('Added', 'New unit successfully added to inventory!', 'success');
      }
      fetchRooms(); 
      setShowModal(false);
    } catch (err) {
      addToast('Error', err.response?.data?.message || 'Operational failure while saving room data.', 'error');
    }
  };

  // ============ ROOM REMOVAL LOGIC ============
  const openDelete = (id) => {
    setTargetId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/rooms/${targetId}`);
      addToast('Removed', 'Unit successfully purged from system inventory.', 'success');
      fetchRooms();
      setShowConfirm(false);
    } catch (err) { 
      addToast('Error', 'Failed to remove unit from inventory.', 'error');
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="rooms-page">
      <div className="page-header">
        <div><h1>🏨 Room Inventory</h1><p className="page-subtitle">Oversee hotel accommodation units, pricing tiers, and occupancy status</p></div>
        <button className="btn btn-primary" onClick={() => openModal()}><HiPlus /> Initialize New Room</button>
      </div>

      {/* Structured Inventory Ledger */}
      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Room Number</th><th>Classification</th><th>Nightly Rate (Rs.)</th><th>Operational Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {rooms.length > 0 ? rooms.map(room => (
                <tr key={room._id}>
                  <td><strong>{room.roomNumber}</strong></td>
                  <td>{room.type}</td>
                  <td><span className="badge-success-light">{room.price?.toLocaleString()}</span></td>
                  <td><StatusBadge status={room.status} /></td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon btn-edit" onClick={() => openModal(room)} title="Modify Configuration"><HiPencil /></button>
                      <button className="btn-icon btn-delete" onClick={() => openDelete(room._id)} title="Remove Unit"><HiTrash /></button>
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan="5" className="empty-state">No accommodation records found in inventory.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Room Configuration Interface Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Modify Unit Configuration' : 'Initialize New Accommodation'}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}><HiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Room Identification Number</label>
                  <input placeholder="e.g. 101" value={form.roomNumber} onChange={e => setForm({...form, roomNumber: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Accommodation Tier</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                    <option value="Single">Single Executive</option>
                    <option value="Double">Double Premium</option>
                    <option value="Deluxe">Royal Deluxe</option>
                    <option value="Suite">Presidential Suite</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Nightly Revenue Rate (PKR)</label>
                  <input type="number" placeholder="Enter amount" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Operational Status</label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option value="Available">Available for Guest</option>
                    <option value="Cleaning">In Housekeeping Queue</option>
                    <option value="Maintenance">Under Technical Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Property Description & Amenities</label>
                <textarea 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                  placeholder="Describe the unit's unique features, views, and premium amenities..."
                  style={{ width: '100%', minHeight: '100px', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)', color: '#fff' }}
                />
              </div>
              <div className="form-group">
                <label>Visual Documentation (Upload Multiple Images)</label>
                <div className="ws-upload-container" style={{ border: '2px dashed rgba(255,255,255,0.1)', padding: '30px', borderRadius: '16px', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    style={{ display: 'none' }} 
                    id="file-upload" 
                  />
                  <label htmlFor="file-upload" style={{ cursor: 'pointer', color: 'var(--accent)', fontWeight: 'bold', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                    <HiPlus size={24} />
                    <span>Upload High-Resolution Property Images</span>
                  </label>
                </div>
                
                {/* Visual Preview Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '20px' }}>
                  {form.images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative', height: '100px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                      <img src={img} alt="Property Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button" 
                        onClick={() => removeImage(idx)}
                        style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <HiX size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update Unit' : 'Confirm Initialization'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Removal Confirmation Dialog */}
      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Confirm Inventory Removal"
        message="Are you certain you wish to permanently remove this accommodation unit? All associated data will be purged."
        confirmText="Confirm Removal"
        cancelText="Abort"
      />
    </div>
  );
};

export default Rooms;
