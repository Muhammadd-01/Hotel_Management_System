// Dashboard.jsx - Main entry point for the hotel operational overview
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { 
  HiOutlineKey, HiOutlineCalendar, HiOutlineCash, HiOutlineCheckCircle,
  HiOutlineUsers, HiOutlineCog, HiOutlineStar, HiOutlineBell, HiOutlineExclamationCircle, HiOutlineIdentification
} from 'react-icons/hi';
import { HiOutlineWrench } from 'react-icons/hi2';

// Import Specialized Dashboards
import ManagerDashboard from '../components/dashboards/ManagerDashboard';
import ReceptionistDashboard from '../components/dashboards/ReceptionistDashboard';
import HousekeepingDashboard from '../components/dashboards/HousekeepingDashboard';
import MaintenanceDashboard from '../components/dashboards/MaintenanceDashboard';
import SuperAdminDashboard from '../components/dashboards/SuperAdminDashboard';

const Dashboard = () => {
  const { user } = useAuth(); // Logged-in user data
  const navigate = useNavigate();
  const [stats, setStats] = useState(null); // Real-time stats from backend
  const [loading, setLoading] = useState(true); // Loading state

  // ============ FETCH ANALYTICS LOGIC ============
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/dashboard/stats');
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (error) {
        console.error('Stats fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="page-loading"><div className="spinner"></div></div>;
  }

  // Role checking
  const isGuest = user?.role === 'guest';
  const role = user?.role;

  // Profile completeness check
  const isProfileIncomplete = !user?.cnicNumber || !user?.cnicFrontImage || !user?.cnicBackImage;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header-premium animate-fade-in">
        <div className="dashboard-header-content">
          <h1>
            <span className="header-icon">✨</span> {isGuest ? 'Guest Portal' : `${role === 'superadmin' ? 'System Control' : role?.charAt(0).toUpperCase() + role?.slice(1) + ' Dashboard'}`}
          </h1>
          <p className="page-subtitle">
            Welcome back, {user?.name}! 👋 
            {isGuest ? ' How is your royal stay progressing?' : 
             role === 'superadmin' ? ' Full system oversight and executive analytics.' :
             role === 'manager' ? ' Oversee the hotel operations and team performance.' :
             role === 'receptionist' ? ' Manage the check-ins and guest reservations.' :
             role === 'housekeeping' ? ' Monitor room cleanliness and housekeeping tasks.' :
             role === 'maintenance' ? ' Handle maintenance requests and technical repairs.' :
             ' Here is your operational summary for today.'}
          </p>
        </div>
      </div>

      {/* Profile Verification Alert */}
      {isProfileIncomplete && (
        <div className="alert-card glass animate-slide-up" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', background: 'rgba(0, 209, 255, 0.05)', border: '1px solid var(--accent-soft)', borderRadius: '16px', marginBottom: '30px' }}>
          <div className="alert-icon" style={{ background: 'var(--accent)', color: 'white', padding: '12px', borderRadius: '12px', display: 'flex' }}>
            <HiOutlineIdentification size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ color: 'white', marginBottom: '4px' }}>Verify Your Identity</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Please upload your CNIC front and back images to complete your profile verification.</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => isGuest ? navigate('/profile') : navigate('/settings')}>Complete Profile</button>
        </div>
      )}

      {/* Role-Specific Content */}
      {isGuest ? (
        <>
          <div className="stats-grid">
            <div className="stat-card glass">
              <div className="stat-icon" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}><HiOutlineCalendar size={24} /></div>
              <div className="stat-info"><h3>{stats?.myBookingsCount || 0}</h3><p>Active Bookings</p></div>
            </div>
            <div className="stat-card glass">
              <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}><HiOutlineBell size={24} /></div>
              <div className="stat-info"><h3>{stats?.myServicesCount || 0}</h3><p>Service Requests</p></div>
            </div>
            <div className="stat-card glass">
              <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><HiOutlineStar size={24} /></div>
              <div className="stat-info"><h3>Silver</h3><p>Loyalty Status</p></div>
            </div>
          </div>
          
          <div className="card glass-card">
            <div className="card-header"><h3>Recommended for You</h3></div>
            <div className="p-24">
              <p className="text-secondary">AI suggests: Try our premium deluxe room amenities and spa services for an enhanced experience!</p>
              <button className="btn btn-primary mt-16" onClick={() => navigate('/ai-assistant')}>Explore with AI Assistant</button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Dispatcher for Staff Dashboards */}
          {role === 'superadmin' && <SuperAdminDashboard stats={stats} />}
          {role === 'manager' && <ManagerDashboard stats={stats} />}
          {role === 'receptionist' && <ReceptionistDashboard stats={stats} />}
          {role === 'housekeeping' && <HousekeepingDashboard stats={stats} />}
          {role === 'maintenance' && <MaintenanceDashboard stats={stats} />}
          
          {/* Fallback for undefined staff roles */}
          {!['superadmin', 'manager', 'receptionist', 'housekeeping', 'maintenance'].includes(role) && (
            <div className="stats-grid">
              <div className="stat-card glass">
                <div className="stat-icon" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}><HiOutlineKey size={24} /></div>
                <div className="stat-info"><h3>{stats?.totalRooms || 0}</h3><p>Total Rooms</p></div>
              </div>
              <div className="stat-card glass">
                <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><HiOutlineWrench size={24} /></div>
                <div className="stat-info"><h3>{stats?.pendingMaintenance || 0}</h3><p>Maintenance Issues</p></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
