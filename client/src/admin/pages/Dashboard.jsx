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
             ' Here is your operational summary for today.'}
          </p>
        </div>
      </div>



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
        </>
      ) : (
        <>
          {/* Dispatcher for Staff Dashboards */}
          {role === 'superadmin' && <SuperAdminDashboard stats={stats} />}
          {role === 'manager' && <ManagerDashboard stats={stats} />}
          {role === 'receptionist' && <ReceptionistDashboard stats={stats} />}
          {role === 'housekeeping' && <HousekeepingDashboard stats={stats} />}
          
          {/* Fallback for undefined staff roles */}
          {!['superadmin', 'manager', 'receptionist', 'housekeeping'].includes(role) && (
            <div className="stats-grid">
              <div className="stat-card glass">
                <div className="stat-icon" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}><HiOutlineKey size={24} /></div>
                <div className="stat-info"><h3>{stats?.totalRooms || 0}</h3><p>Total Rooms</p></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
