// Services.jsx - Manages guest requests and extra services assigned to rooms
import { useState, useEffect } from 'react';
import API from '../../services/api';
import StatusBadge from '../components/StatusBadge';
import { HiPlus, HiX, HiOutlineHome, HiOutlineSearch } from 'react-icons/hi';
import { useToast } from '../../context/ToastContext';

const Services = () => {
  const [services, setServices] = useState([]); 
  const [bookings, setBookings] = useState([]); 
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToast } = useToast();

  const [form, setForm] = useState({ 
    booking: '', 
    serviceType: '', 
    description: '', 
    amount: '' 
  });

  const fetchData = async () => {
    try {
      const [srvRes, bkRes, rmRes] = await Promise.all([
        API.get('/services'), 
        API.get('/bookings'),
        API.get('/rooms')
      ]);
      
      if (srvRes.data.success) setServices(srvRes.data.services);
      if (bkRes.data.success) {
        setBookings(bkRes.data.bookings.filter(b => b.status === 'confirmed'));
      }
      if (rmRes.data.success) setRooms(rmRes.data.rooms);
    } catch (err) { 
      console.error('Data fetch failed:', err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/services', { ...form, amount: Number(form.amount) });
      addToast('Success', 'Extra service successfully added to room!', 'success');
      setShowModal(false);
      setForm({ booking: '', serviceType: '', description: '', amount: '' });
      fetchData();
    } catch (err) { 
      addToast('Error', err.response?.data?.message || 'Failed to process service order.', 'error'); 
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/services/${id}`, { status });
      addToast('Status Updated', `Order is now ${status}`, 'info');
      fetchData();
    } catch (err) { 
      addToast('Error', 'Failed to update status.', 'error'); 
    }
  };

  const openAddForBooking = (bookingId) => {
    setForm({ ...form, booking: bookingId });
    setShowModal(true);
  };

  // Filtered rooms for the "Add by Room" section
  const filteredRooms = rooms.filter(r => 
    r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="services-page">
      <div className="page-header">
        <div>
          <h1>🛎️ Room & Guest Services</h1>
          <p className="page-subtitle">Add extra services and manage requests for active rooms</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <HiPlus /> New Service Order
        </button>
      </div>

      {/* Room Quick-Add Section */}
      <div className="card mb-24" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><HiOutlineHome /> Quick Add to Room</h3>
          <div className="search-box" style={{ width: '250px', position: 'relative' }}>
            <HiOutlineSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search Room Number..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '8px 12px 8px 35px', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'white' }}
            />
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          {filteredRooms.map(room => {
            const activeBooking = bookings.find(b => b.room?._id === room._id || b.room === room._id);
            return (
              <div key={room._id} className="glass-card" style={{ padding: '12px', textAlign: 'center', border: activeBooking ? '1px solid var(--accent-soft)' : '1px solid rgba(255,255,255,0.05)' }}>
                <h4 style={{ fontSize: '1.1rem' }}>Room {room.roomNumber}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 10px' }}>
                  {activeBooking ? (
                    <span style={{ color: 'var(--accent)' }}>👤 {activeBooking.guestName}</span>
                  ) : (
                    'Empty / Not Confirmed'
                  )}
                </p>
                <button 
                  className={`btn-sm ${activeBooking ? 'btn-primary' : 'btn-secondary'}`} 
                  disabled={!activeBooking}
                  onClick={() => openAddForBooking(activeBooking._id)}
                  style={{ width: '100%' }}
                >
                  <HiPlus /> Add Service
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h3 className="p-20" style={{ borderBottom: '1px solid var(--border)' }}>Active Service Queue</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Room</th><th>Guest</th><th>Service</th><th>Description</th><th>Fee (Rs.)</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {services.length > 0 ? services.map(s => (
                <tr key={s._id}>
                  <td><strong>Room {s.booking?.room?.roomNumber || 'N/A'}</strong></td>
                  <td>{s.booking?.guestName}</td>
                  <td><span className="badge-info-light">{s.serviceType}</span></td>
                  <td>{s.description}</td>
                  <td><strong>{s.amount?.toLocaleString()}</strong></td>
                  <td><StatusBadge status={s.status} /></td>
                  <td>
                    <div className="action-buttons">
                      {s.status === 'Pending' && <button className="btn-sm btn-success" onClick={() => updateStatus(s._id, 'In Progress')}>Start</button>}
                      {s.status === 'In Progress' && <button className="btn-sm btn-success" onClick={() => updateStatus(s._id, 'Completed')}>Finish</button>}
                    </div>
                  </td>
                </tr>
              )) : <tr><td colSpan="7" className="empty-state">No service orders in the queue.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* Service Order Registration Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Extra Service to Room</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}><HiX /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group"><label>Target Guest / Room</label>
                <select value={form.booking} onChange={e => setForm({...form, booking: e.target.value})} required>
                  <option value="">-- Select Active Booking --</option>
                  {bookings.map(b => <option key={b._id} value={b._id}>Room {b.room?.roomNumber} — {b.guestName}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Service Type</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Breakfast, Spa, Mini-bar" 
                    value={form.serviceType} 
                    onChange={e => setForm({...form, serviceType: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Service Fee (Rs.)</label>
                  <input 
                    type="number" 
                    value={form.amount} 
                    onChange={e => setForm({...form, amount: e.target.value})} 
                    required 
                    placeholder="Amount to bill" 
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Service Description</label>
                <textarea 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                  placeholder="Details of the extra service provided..." 
                  style={{height:'80px'}} 
                  required 
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add to Bill</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .mb-24 { margin-bottom: 24px; }
        .p-20 { padding: 20px; }
        .badge-info-light {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          padding: 4px 8px;
          borderRadius: 6px;
          fontSize: 0.85rem;
          fontWeight: 600;
        }
      `}</style>
    </div>
  );
};

export default Services;
