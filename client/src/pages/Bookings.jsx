// Bookings.jsx - Yeh page hotel ki bookings aur check-in/out handle karta hai
import { useState, useEffect } from 'react';
import API from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { HiPlus, HiX, HiCheck } from 'react-icons/hi';

const Bookings = () => {
  const [bookings, setBookings] = useState([]); // Bookings ki list
  const [rooms, setRooms] = useState([]); // Khali rooms ki list (booking ke liye)
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setError('');
    try {
      await API.post('/bookings', form);
      setSuccess('Booking kamyabi se ho gayi!');
      setShowModal(false);
      setForm({ guestName: '', room: '', checkIn: '', checkOut: '', status: 'confirmed' });
      fetchData(); // Data refresh karo
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking nahi ho saki');
    }
  };

  // ============ CHECK-OUT KARNE KA FUNCTION ============
  const handleCheckOut = async (id) => {
    if (!window.confirm('Kya guest check-out kar raha hai?')) return;
    try {
      await API.put(`/bookings/${id}`, { status: 'checked-out' });
      setSuccess('Guest check-out ho gaya! Room ab safai ke liye bhej diya gaya hai.');
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError('Check-out mein masla hua'); }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="bookings-page">
      <div className="page-header">
        <div><h1>Reservations</h1><p className="page-subtitle">Guest bookings aur stay details yahan se manage karein</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><HiPlus /> New Booking</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

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
                      <button className="btn-sm btn-success" onClick={() => handleCheckOut(b._id)}>
                        <HiCheck /> Check-Out
                      </button>
                    )}
                  </td>
                </tr>
              )) : <tr><td colSpan="6" className="empty-state">Koi booking nahi mili</td></tr>}
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
                  <option value="">-- Room chunein --</option>
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
    </div>
  );
};

export default Bookings;
