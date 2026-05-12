// Sidebar.jsx - Main navigation sidebar and user profile component
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineViewGrid, HiOutlineKey, HiOutlineCalendar, HiOutlineLightBulb,
  HiOutlineLogout, HiOutlineUserAdd, HiOutlineUsers, HiOutlineDocumentText,
  HiOutlineCog, HiOutlineStar, HiOutlineBell, HiOutlineUserGroup, HiOutlineHome,
  HiOutlinePlus, HiOutlineShieldCheck
} from 'react-icons/hi';
import { useState, useEffect } from 'react';
import API from '../../services/api';
import ConfirmModal from './ConfirmModal';
import { useToast } from '../../context/ToastContext';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth(); // Access auth state and functions
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0); // Track unread notifications count
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Toggle logout confirmation

  // ============ FETCH NOTIFICATION COUNT ============
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await API.get('/notifications');
        if (res.data.success) setUnread(res.data.unreadCount);
      } catch (err) { /* silent fail */ }
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // Auto-refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Logout handle karna
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    addToast('Logged Out', 'You have been successfully signed out. Have a pleasant day!', 'info');
    navigate('/login');
    setShowLogoutModal(false);
  };

  return (
    <aside className="sidebar">
      {/* Sidebar Header - Logo and Brand */}
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🏨</span>
          <h2>LuxuryStay</h2>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="sidebar-nav">
        {/* Navigation links always visible */}
        <NavLink to="/" className="nav-link">
          <HiOutlineHome className="nav-icon" /><span>Back to Website</span>
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <HiOutlineViewGrid className="nav-icon" /><span>Dashboard</span>
        </NavLink>
        {/* Role-Specific Links */}
        
        {/* Receptionist & Admin & Manager: Bookings, Guests, Invoices */}
        {(['superadmin', 'manager', 'receptionist'].includes(user?.role)) && (
          <>
            <NavLink to="/rooms" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <HiOutlineKey className="nav-icon" /><span>Rooms</span>
            </NavLink>
            <NavLink to="/guests" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <HiOutlineUsers className="nav-icon" /><span>Guest List</span>
            </NavLink>
            <NavLink to="/bookings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <HiOutlineCalendar className="nav-icon" /><span>Bookings</span>
            </NavLink>
            <NavLink to="/invoices" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <HiOutlineDocumentText className="nav-icon" /><span>Invoices</span>
            </NavLink>
          </>
        )}

        {/* Guest Only: My Bookings, Feedback, Profile */}
        {user?.role === 'guest' && (
          <>
            <NavLink to="/bookings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <HiOutlineCalendar className="nav-icon" /><span>My Bookings</span>
            </NavLink>
            <NavLink to="/feedback" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <HiOutlineStar className="nav-icon" /><span>My Feedback</span>
            </NavLink>
          </>
        )}
        
        {/* Housekeeping & Admin & Manager */}
        {(['superadmin', 'manager', 'housekeeping'].includes(user?.role)) && (
          <NavLink to="/housekeeping" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <HiOutlineCog className="nav-icon" /><span>Housekeeping</span>
          </NavLink>
        )}

        {/* Maintenance & Admin & Manager */}
        {(['superadmin', 'manager', 'maintenance'].includes(user?.role)) && (
          <NavLink to="/maintenance" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <HiOutlineCog className="nav-icon" /><span>Maintenance</span>
          </NavLink>
        )}
        
        {/* Universal Links */}
        <NavLink to="/services" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <HiOutlineBell className="nav-icon" /><span>{user?.role === 'guest' ? 'Request Service' : 'Services'}</span>
        </NavLink>

        {user?.role !== 'guest' && (
          <NavLink to="/feedback" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <HiOutlineStar className="nav-icon" /><span>Guest Reviews</span>
          </NavLink>
        )}
        
        <NavLink to="/ai-assistant" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <HiOutlineLightBulb className="nav-icon" /><span>AI Assistant</span>
        </NavLink>

        <NavLink to="/notifications" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <HiOutlineBell className="nav-icon" />
          <span>Notifications</span>
          {unread > 0 && <span className="notif-badge">{unread}</span>}
        </NavLink>

        {/* Management Links */}
        {(['superadmin', 'manager'].includes(user?.role)) && (
          <>
            <div className="nav-divider"></div>
            {user?.role === 'superadmin' && (
              <>
                <NavLink to="/staff" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <HiOutlineUserGroup className="nav-icon" /><span>Personnel Directory</span>
                </NavLink>
                <NavLink to="/create-user" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                  <HiOutlineUserAdd className="nav-icon" /><span>Enroll Personnel</span>
                </NavLink>
              </>
            )}
            <NavLink to="/addons" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <HiOutlinePlus className="nav-icon" /><span>Service Catalog</span>
            </NavLink>
            {user?.role === 'superadmin' && (
              <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                <HiOutlineCog className="nav-icon" /><span>System Settings</span>
              </NavLink>
            )}
          </>
        )}
      </nav>

      {/* Sidebar Footer - User profile and Logout */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <p className="user-name">{user?.name}</p>
            <span className="user-role">
              {user?.role === 'superadmin' && <HiOutlineShieldCheck style={{ verticalAlign: 'middle', marginRight: '4px' }} />}
              {user?.role?.toUpperCase()}
            </span>
          </div>
        </div>
        <button onClick={handleLogoutClick} className="logout-btn" title="Logout"><HiOutlineLogout /></button>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Logout Confirmation"
        message="Are you sure you want to sign out? Your current session will be ended."
        confirmText="Yes, Logout"
        cancelText="Cancel"
      />
    </aside>
  );
};

export default Sidebar;
