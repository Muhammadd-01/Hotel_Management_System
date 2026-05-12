import React from 'react';
import { HiOutlineExclamation, HiOutlineCheckCircle, HiOutlineClock } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const HousekeepingDashboard = ({ stats }) => {
  const navigate = useNavigate();

  return (
    <div className="housekeeping-dashboard animate-fade-in">
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}><HiOutlineExclamation size={26} /></div>
          <div className="stat-info">
            <p>Rooms to Clean</p>
            <h3>{stats?.pendingHousekeeping || 0}</h3>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}><HiOutlineCheckCircle size={26} /></div>
          <div className="stat-info">
            <p>Inspection Ready</p>
            <h3>{stats?.readyForInspection || 0}</h3>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}><HiOutlineClock size={26} /></div>
          <div className="stat-info">
            <p>Completed Tasks</p>
            <h3>{stats?.completedHousekeeping || 0}</h3>
          </div>
        </div>
      </div>

      <div className="card glass-card mt-24">
        <div className="card-header"><h3>Priority Housekeeping Tasks</h3></div>
        <div className="p-24">
          {stats?.pendingHousekeeping > 0 ? (
            <div className="alert alert-error">
              <HiOutlineExclamation /> <strong>Operational Alert:</strong> {stats.pendingHousekeeping} rooms are currently flagged for immediate cleaning.
            </div>
          ) : (
            <div className="alert alert-success">
              <HiOutlineCheckCircle /> <strong>Status Clean:</strong> All scheduled room cleanings are currently up to date.
            </div>
          )}
          
          <div className="empty-state-v mt-24">
            <p className="text-muted">Dynamic task assignment is synchronized with the live room inventory.</p>
            <button className="btn btn-primary btn-full mt-16" onClick={() => navigate('/housekeeping')}>
              Open Full Task Manager
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HousekeepingDashboard;
