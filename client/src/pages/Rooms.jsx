// Rooms.jsx - Yeh page hotel ke saare rooms manage karta hai
import { useState, useEffect } from 'react';
import API from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { HiPlus, HiPencil, HiTrash, HiX } from 'react-icons/hi';

const Rooms = () => {
  const [rooms, setRooms] = useState([]); // Rooms ki list store karne ke liye
  const [loading, setLoading] = useState(true); // Loading spinner ke liye
  const [showModal, setShowModal] = useState(false); // Add/Edit popup ke liye
  const [editing, setEditing] = useState(null); // Kis room ko edit kar rahe hain
  const [error, setError] = useState(''); // Error message dikhane ke liye
  const [success, setSuccess] = useState(''); // Success message ke liye

  // Naye room ka empty form
  const [form, setForm] = useState({ roomNumber: '', type: 'Single', price: '', status: 'Available' });

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
    setError('');
    if (room) {
      setEditing(room);
      setForm({ roomNumber: room.roomNumber, type: room.type, price: room.price, status: room.status });
    } else {
      setEditing(null);
      setForm({ roomNumber: '', type: 'Single', price: '', status: 'Available' });
    }
    setShowModal(true);
  };

  // ============ FORM SUBMIT (ADD/UPDATE) ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        // Purane room ko update karna
        await API.put(`/rooms/${editing._id}`, form);
        setSuccess('Room update ho gaya!');
      } else {
        // Naya room create karna
        await API.post('/rooms', form);
        setSuccess('Naya room add ho gaya!');
      }
      fetchRooms(); setShowModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Kuch galat ho gaya');
    }
  };

  // ============ DELETE ROOM ============
  const handleDelete = async (id) => {
    if (!window.confirm('Kya aap waqai is room ko delete karna chahte hain?')) return;
    try {
      await API.delete(`/rooms/${id}`);
      setSuccess('Room delete ho gaya!');
      fetchRooms();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Room delete nahi ho saka');
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="rooms-page">
      {/* Header section */}
      <div className="page-header">
        <div><h1>Room Management</h1><p className="page-subtitle">Hotel ke rooms ki inventory aur status yahan se manage karein</p></div>
        <button className="btn btn-primary" onClick={() => openModal()}><HiPlus /> Add New Room</button>
      </div>

      {/* Alerts */}
      {success && <div className="alert alert-success">{success}</div>}
      {error && !showModal && <div className="alert alert-error">{error}</div>}

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
                      <button className="btn-icon btn-delete" onClick={() => handleDelete(room._id)}><HiTrash /></button>
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan="5" className="empty-state">Koi room nahi mila</td></tr>}
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
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update Room' : 'Create Room'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
