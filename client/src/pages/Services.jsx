// Services.jsx - Yeh page guest ki extra services (Room service, Laundry) manage karta hai
import { useState, useEffect } from 'react';
import API from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { HiPlus, HiX } from 'react-icons/hi';

const Services = () => {
  const [services, setServices] = useState([]); // Services requests ki list
  const [bookings, setBookings] = useState([]); // Active bookings (service assign karne ke liye)
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Nayi service request ka form
  const [form, setForm] = useState({ booking: '', serviceType: 'Room Service', description: '', amount: '' });

  // ============ DATA LOAD KARNE KA FUNCTION ============
  const fetchData = async () => {
    try {
      const [srvRes, bkRes] = await Promise.all([API.get('/services'), API.get('/bookings')]);
      if (srvRes.data.success) setServices(srvRes.data.services);
      // Sirf confirmed bookings dikhao jo abhi hotel mein hain
      if (bkRes.data.success) setBookings(bkRes.data.bookings.filter(b => b.status === 'confirmed'));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // ============ NAYI SERVICE REQUEST SUBMIT KARNA ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/services', { ...form, amount: Number(form.amount) });
      setSuccess('Service request register ho gayi!');
      setShowModal(false);
      setForm({ booking: '', serviceType: 'Room Service', description: '', amount: '' });
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError(err.response?.data?.message || 'Error'); }
  };

  // ============ SERVICE KA STATUS UPDATE KARNA ============
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/services/${id}`, { status });
      setSuccess(`Service status ab "${status}" hai.`);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { setError('Update nahi ho saka'); }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="services-page">
      <div className="page-header">
        <div><h1>🛎️ Guest Services</h1><p className="page-subtitle">Room service, laundry aur transport requests yahan manage karein</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><HiPlus /> New Request</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Type</th><th>Guest / Room</th><th>Description</th><th>Charges (Rs.)</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {services.length > 0 ? services.map(s => (
                <tr key={s._id}>
                  <td><strong>{s.serviceType}</strong></td>
                  <td>{s.booking?.guestName} (Room {s.booking?.room?.roomNumber})</td>
                  <td>{s.description}</td>
                  <td>{s.amount?.toLocaleString()}</td>
                  <td><StatusBadge status={s.status} /></td>
                  <td>
                    <div className="action-buttons">
                      {/* Workflow buttons */}
                      {s.status === 'Pending' && <button className="btn-sm btn-success" onClick={() => updateStatus(s._id, 'In Progress')}>Start</button>}
                      {s.status === 'In Progress' && <button className="btn-sm btn-success" onClick={() => updateStatus(s._id, 'Completed')}>Finish</button>}
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan="6" className="empty-state">Koi service request nahi hai</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Service Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>New Service Request</h2><button className="btn-close" onClick={() => setShowModal(false)}><HiX /></button></div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group"><label>Select Active Booking</label>
                <select value={form.booking} onChange={e => setForm({...form, booking: e.target.value})} required>
                  <option value="">-- Guest chunein --</option>
                  {bookings.map(b => <option key={b._id} value={b._id}>{b.guestName} - Room {b.room?.roomNumber}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Service Type</label>
                  <select value={form.serviceType} onChange={e => setForm({...form, serviceType: e.target.value})}>
                    <option>Room Service</option><option>Laundry</option><option>Transport</option><option>Spa</option><option>Other</option>
                  </select>
                </div>
                <div className="form-group"><label>Amount (Rs.)</label><input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required /></div>
              </div>
              <div className="form-group"><label>Description</label><input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="e.g. 2 Tea, 1 Sandwich" required /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
