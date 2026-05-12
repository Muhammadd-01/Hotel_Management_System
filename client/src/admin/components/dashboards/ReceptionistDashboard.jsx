import React from 'react';
import { HiOutlineKey, HiOutlineCalendar, HiOutlineUsers, HiOutlinePlus, HiOutlineCash } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const ReceptionistDashboard = ({ stats }) => {
  const navigate = useNavigate();

  return (
    <div className="receptionist-dashboard animate-fade-in">
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}><HiOutlineCalendar size={26} /></div>
          <div className="stat-info">
            <p>Today's Arrivals</p>
            <h3>{stats?.totalBookings || 0}</h3>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}><HiOutlineKey size={26} /></div>
          <div className="stat-info">
            <p>Available Rooms</p>
            <h3>{stats?.availableRooms || 0}</h3>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}><HiOutlineUsers size={26} /></div>
          <div className="stat-info">
            <p>Active Guests</p>
            <h3>{stats?.totalGuests || 0}</h3>
          </div>
        </div>
      </div>

      <div className="card glass-card mt-24">
        <div className="card-header"><h3>Front Desk Operations</h3></div>
        <div className="p-24">
          <p className="text-muted mb-16">Quickly manage guest check-ins, reservations, and billing.</p>
          <div className="quick-actions-row">
            <button className="btn btn-primary" onClick={() => navigate('/bookings')}>
              <HiOutlinePlus /> New Reservation
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/guests')}>
              <HiOutlineUsers /> Guest Directory
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/invoices')}>
              <HiOutlineCash /> Generate Invoice
            </button>
            <button className="btn btn-outline" style={{ border: '1.5px solid var(--border)' }} onClick={() => navigate('/rooms')}>
              <HiOutlineKey /> Check Room Status
            </button>
          </div>
        </div>
      </div>

      <div className="grid-2 mt-24">
        <div className="card glass-card">
          <div className="card-header"><h3>Recent Check-ins</h3></div>
          <div className="p-0 table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Room</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentBookings?.slice(0, 5).map(b => (
                  <tr key={b._id}>
                    <td><strong>{b.guestName}</strong></td>
                    <td>{b.room?.roomNumber}</td>
                    <td><span className="status-badge badge-success">Active</span></td>
                  </tr>
                )) || <tr><td colSpan="3" className="empty-state">No recent check-ins</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
