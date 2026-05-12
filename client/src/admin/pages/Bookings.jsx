// Bookings.jsx - Orchestrates hotel reservations, check-in/out workflows, and room availability management
import { useState, useEffect } from 'react';
import API from '../../services/api';
import StatusBadge from '../components/StatusBadge';
import { HiPlus, HiX, HiCheck } from 'react-icons/hi';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../../context/ToastContext';

const Bookings = () => {
  const [bookings, setBookings] = useState([]); // List of current reservations
  const [rooms, setRooms] = useState([]); // Filtered list of available rooms for new bookings
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  // Initial structure for new reservation form
  const [form, setForm] = useState({
    guestName: '', room: '', checkIn: '', checkOut: '', status: 'confirmed'
  });

  // ============ DATA SYNCHRONIZATION LOGIC ============
  const fetchData = async () => {
    try {
      // Execute parallel requests for bookings and room inventory
      const [bookRes, roomRes] = await Promise.all([
        API.get('/bookings'),
        API.get('/rooms')
      ]);
      if (bookRes.data.success) setBookings(bookRes.data.bookings);
      
      // Filter inventory to show only 'Available' rooms for selection
      if (roomRes.data.success) {
        setRooms(roomRes.data.rooms.filter(r => r.status === 'Available'));
      }
    } catch (err) { 
      console.error('Data sync failed:', err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ============ NEW RESERVATION PROCESSING ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/bookings', form);
      addToast('Success', 'Reservation has been successfully confirmed!', 'success');
      setShowModal(false);
      setForm({ guestName: '', room: '', checkIn: '', checkOut: '', status: 'confirmed' });
      fetchData(); // Refresh local dataset
    } catch (err) {
      addToast('Error', err.response?.data?.message || 'Transaction failed. Please verify stay dates.', 'error');
    }
  };

  // ============ GUEST CHECK-OUT WORKFLOW ============
  const openCheckOut = (id) => {
    setTargetId(id);
    setShowConfirm(true);
  };

  const confirmCheckOut = async () => {
    try {
      await API.put(`/bookings/${targetId}`, { status: 'checked-out' });
      addToast('Check-Out Successful', 'Guest session closed. Room assigned to housekeeping queue.', 'success');
      fetchData();
      setShowConfirm(false);
    } catch (err) { 
      addToast('Error', 'Operational failure during check-out process.', 'error');
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="bookings-page">
      <div className="page-header">
        <div><h1>📅 Reservations</h1><p className="page-subtitle">Monitor guest stays, manage check-ins, and oversee room occupancy</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><HiPlus /> New Reservation</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Primary Guest</th><th>Room Allocation</th><th>Stay Duration</th><th>Revenue</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? bookings.map(b => (
                <tr key={b._id}>
                  <td><strong>{b.guestName}</strong></td>
                  <td>{b.room?.roomNumber} <span className="text-muted" style={{fontSize: '0.8rem'}}>({b.room?.type})</span></td>
                  <td>{new Date(b.checkIn).toLocaleDateString()} — {new Date(b.checkOut).toLocaleDateString()}</td>
                  <td><span className="badge-success-light">Rs. {b.totalAmount?.toLocaleString()}</span></td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>
                    {b.status === 'confirmed' && (
                      <button className="btn-sm btn-success" onClick={() => openCheckOut(b._id)}>
                        <HiCheck /> Complete Stay
                      </button>
                    )}
                  </td>
                </tr>
              )) : <tr><td colSpan="6" className="empty-state">No active reservations detected in the system.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservation Creation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm New Booking</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}><HiX /></button>
            </div>
            {error && <div className="alert alert-error" style={{margin:'16px 24px 0'}}>{error}</div>}
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group"><label>Guest Identity</label><input placeholder="Full Legal Name" value={form.guestName} onChange={e => setForm({...form, guestName: e.target.value})} required /></div>
              <div className="form-group"><label>Available Room Selection</label>
                <select value={form.room} onChange={e => setForm({...form, room: e.target.value})} required>
                  <option value="">-- Choose a Vacant Room --</option>
                  {rooms.map(r => <option key={r._id} value={r._id}>Room {r.roomNumber} — {r.type} (Rs. {r.price})</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Arrival Date</label><input type="date" value={form.checkIn} onChange={e => setForm({...form, checkIn: e.target.value})} required /></div>
                <div className="form-group"><label>Departure Date</label><input type="date" value={form.checkOut} onChange={e => setForm({...form, checkOut: e.target.value})} required /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Authorize Stay</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Check-Out Confirmation Dialog */}
      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmCheckOut}
        title="Authorize Check-Out"
        message="Is the guest transaction complete? The room will be flagged for housekeeping immediately upon confirmation."
        confirmText="Finalize Check-Out"
        cancelText="Return"
      />
    </div>
  );
};

export default Bookings;
