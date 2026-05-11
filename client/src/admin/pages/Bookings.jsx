// Bookings.jsx - Yeh page hotel ki bookings aur check-in/out handle karta hai
import { useState, useEffect } from 'react';
import API from '../../services/api';
import StatusBadge from '../components/StatusBadge';
import { HiPlus, HiX, HiCheck } from 'react-icons/hi';
import ConfirmModal from '../components/ConfirmModal';
import { useToast } from '../../context/ToastContext';

const Bookings = () => {
  const [bookings, setBookings] = useState([]); // List of bookings
  const [rooms, setRooms] = useState([]); // List of available rooms
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetId, setTargetId] = useState(null);
  const { addToast } = useToast();

  // Nayi booking ka form data
  const [form, setForm] = useState({
    guestName: '', room: '', checkIn: '', checkOut: '', status: 'confirmed'
  });

  // ============ DATA FETCH KARNE KA LOGIC ============
  const fetchData = async () => {
    try {
      // Bookings aur available rooms dono saath lane ke liye Promise.all
      const [bookRes, roomRes] = await Promise.all([
        API.get('/bookings'),
        API.get('/rooms')
      ]);
      if (bookRes.data.success) setBookings(bookRes.data.bookings);
      // Sirf wo rooms dikhao jo "Available" hain
      if (roomRes.data.success) setRooms(roomRes.data.rooms.filter(r => r.status === 'Available'));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // ============ FORM SUBMIT (NEW BOOKING) ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/bookings', form);
      addToast('Success', 'Booking has been confirmed successfully!', 'success');
      setShowModal(false);
      setForm({ guestName: '', room: '', checkIn: '', checkOut: '', status: 'confirmed' });
      fetchData(); // Refresh data
    } catch (err) {
      addToast('Error', err.response?.data?.message || 'Could not process booking', 'error');
    }
  };

  // ============ CHECK-OUT KARNE KA FUNCTION ============
  const openCheckOut = (id) => {
    setTargetId(id);
    setShowConfirm(true);
  };

  const confirmCheckOut = async () => {
    try {
      await API.put(`/bookings/${targetId}`, { status: 'checked-out' });
      addToast('Checked Out', 'Guest has checked out. Room marked for cleaning.', 'success');
      fetchData();
      setShowConfirm(false);
    } catch (err) { 
      addToast('Error', 'Failed to process check-out.', 'error');
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="bookings-page">
      <div className="page-header">
        <div><h1>Reservations</h1><p className="page-subtitle">Manage guest bookings and stay details here</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><HiPlus /> New Booking</button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Guest Name</th><th>Room</th><th>Stay Dates</th><th>Total Amount</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? bookings.map(b => (
                <tr key={b._id}>
                  <td><strong>{b.guestName}</strong></td>
                  <td>{b.room?.roomNumber} ({b.room?.type})</td>
                  <td>{new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}</td>
                  <td>Rs. {b.totalAmount?.toLocaleString()}</td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>
                    {b.status === 'confirmed' && (
                      <button className="btn-sm btn-success" onClick={() => openCheckOut(b._id)}>
                        <HiCheck /> Check-Out
                      </button>
                    )}
                  </td>
                </tr>
              )) : <tr><td colSpan="6" className="empty-state">No bookings found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Booking</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}><HiX /></button>
            </div>
            {error && <div className="alert alert-error" style={{margin:'16px 24px 0'}}>{error}</div>}
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group"><label>Guest Full Name</label><input value={form.guestName} onChange={e => setForm({...form, guestName: e.target.value})} required /></div>
              <div className="form-group"><label>Select Available Room</label>
                <select value={form.room} onChange={e => setForm({...form, room: e.target.value})} required>
                  <option value="">-- Choose a Room --</option>
                  {rooms.map(r => <option key={r._id} value={r._id}>Room {r.roomNumber} - {r.type} (Rs. {r.price})</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Check-In Date</label><input type="date" value={form.checkIn} onChange={e => setForm({...form, checkIn: e.target.value})} required /></div>
                <div className="form-group"><label>Check-Out Date</label><input type="date" value={form.checkOut} onChange={e => setForm({...form, checkOut: e.target.value})} required /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Check-Out Confirmation Modal */}
      <ConfirmModal 
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmCheckOut}
        title="Confirm Check-Out"
        message="Is the guest ready to check out? The room will be marked for cleaning immediately."
        confirmText="Confirm Check-Out"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Bookings;
