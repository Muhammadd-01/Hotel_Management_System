import React from 'react';
import { HiOutlineClock, HiOutlineExclamation, HiOutlineCheckCircle } from 'react-icons/hi';
import { HiOutlineWrench } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const MaintenanceDashboard = ({ stats }) => {
  const navigate = useNavigate();

  return (
    <div className="maintenance-dashboard animate-fade-in">
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}><HiOutlineWrench size={26} /></div>
          <div className="stat-info">
            <p>Urgent Repairs</p>
            <h3>{stats?.pendingMaintenance || 0}</h3>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}><HiOutlineClock size={26} /></div>
          <div className="stat-info">
            <p>Active Tickets</p>
            <h3>{stats?.activeRepairs || 0}</h3>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}><HiOutlineCheckCircle size={26} /></div>
          <div className="stat-info">
            <p>Resolved Today</p>
            <h3>{stats?.resolvedToday || 0}</h3>
          </div>
        </div>
      </div>

      <div className="card glass-card mt-24">
        <div className="card-header"><h3>Active Maintenance Control</h3></div>
        <div className="p-24">
          {stats?.pendingMaintenance > 0 ? (
            <div className="alert alert-error">
              <HiOutlineExclamation /> <strong>Alert:</strong> There are {stats.pendingMaintenance} pending technical requests in the system.
            </div>
          ) : (
            <div className="alert alert-success">
              <HiOutlineCheckCircle /> <strong>System Status:</strong> All critical maintenance systems are currently reported operational.
            </div>
          )}
          
          <div className="empty-state-v mt-24 text-center">
            <p className="text-muted">Live synchronization with room diagnostic reports and guest service requests.</p>
            <button className="btn btn-primary btn-full mt-16" onClick={() => navigate('/maintenance')}>
              <HiOutlineWrench /> View Full Ticket Queue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;
