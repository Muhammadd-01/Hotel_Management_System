// Services.jsx - Manages supplementary guest requests including Room Service, Laundry, and Concierge services
import { useState, useEffect } from 'react';
import API from '../../services/api';
import StatusBadge from '../components/StatusBadge';
import { HiPlus, HiX } from 'react-icons/hi';

const Services = () => {
  const [services, setServices] = useState([]); // List of service orders
  const [bookings, setBookings] = useState([]); // List of currently active guest stays
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Initial structure for new service order registration
  const [form, setForm] = useState({ booking: '', serviceType: 'Room Service', description: '', amount: '' });

  // ============ DATA ACQUISITION LOGIC ============
  const fetchData = async () => {
    try {
      const [srvRes, bkRes] = await Promise.all([API.get('/services'), API.get('/bookings')]);
      if (srvRes.data.success) setServices(srvRes.data.services);
      
      // Filter inventory to show only active guests currently on premises
      if (bkRes.data.success) {
        setBookings(bkRes.data.bookings.filter(b => b.status === 'confirmed'));
      }
    } catch (err) { 
      console.error('Service data fetch failed:', err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  // ============ ORDER REGISTRATION LOGIC ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/services', { ...form, amount: Number(form.amount) });
      setSuccess('Service order successfully registered!');
      setShowModal(false);
      setForm({ booking: '', serviceType: 'Room Service', description: '', amount: '' });
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { 
      setError(err.response?.data?.message || 'Transaction failed. Could not process order.'); 
    }
  };

  // ============ STATUS WORKFLOW UPDATES ============
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/services/${id}`, { status });
      setSuccess(`Order status successfully updated to "${status}".`);
      fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { 
      setError('Failed to update service status.'); 
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="services-page">
      <div className="page-header">
        <div><h1>🛎️ Guest Service Orders</h1><p className="page-subtitle">Track and fulfill room service, laundry, and bespoke guest requests</p></div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}><HiPlus /> New Service Order</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Category</th><th>Guest / Allocation</th><th>Order Description</th><th>Fee (Rs.)</th><th>Operational Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {services.length > 0 ? services.map(s => (
                <tr key={s._id}>
                  <td><strong>{s.serviceType}</strong></td>
                  <td>{s.booking?.guestName} <br/><small className="text-muted">Room {s.booking?.room?.roomNumber}</small></td>
                  <td>{s.description}</td>
                  <td><span className="badge-success-light">{s.amount?.toLocaleString()}</span></td>
                  <td><StatusBadge status={s.status} /></td>
                  <td>
                    <div className="action-buttons">
                      {/* Operational workflow controls */}
                      {s.status === 'Pending' && <button className="btn-sm btn-success" onClick={() => updateStatus(s._id, 'In Progress')}>Begin Fulfillment</button>}
                      {s.status === 'In Progress' && <button className="btn-sm btn-success" onClick={() => updateStatus(s._id, 'Completed')}>Mark Completed</button>}
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan="6" className="empty-state">No active service orders found in the queue.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Order Registration Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h2>Register New Service Order</h2><button className="btn-close" onClick={() => setShowModal(false)}><HiX /></button></div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group"><label>Target Guest Session</label>
                <select value={form.booking} onChange={e => setForm({...form, booking: e.target.value})} required>
                  <option value="">-- Select Active Guest --</option>
                  {bookings.map(b => <option key={b._id} value={b._id}>{b.guestName} — Room {b.room?.roomNumber}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Service Classification</label>
                  <select value={form.serviceType} onChange={e => setForm({...form, serviceType: e.target.value})}>
                    <option>Room Service</option>
                    <option>Laundry & Dry Cleaning</option>
                    <option>Transport & Valet</option>
                    <option>Wellness & Spa</option>
                    <option>Bespoke Concierge</option>
                  </select>
                </div>
                <div className="form-group"><label>Service Fee (PKR)</label><input type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required placeholder="Enter charges" /></div>
              </div>
              <div className="form-group"><label>Order Specifications</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="e.g. 2 Espresso, 1 Club Sandwich (No onions)" style={{height:'80px'}} required /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Process Service Order</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
