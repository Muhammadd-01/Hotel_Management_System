// Sidebar.jsx - Yeh component navigation menu aur user info dikhata hai
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineViewGrid, HiOutlineKey, HiOutlineCalendar, HiOutlineLightBulb,
  HiOutlineLogout, HiOutlineUserAdd, HiOutlineUsers, HiOutlineDocumentText,
  HiOutlineCog, HiOutlineStar, HiOutlineBell, HiOutlineUserGroup
} from 'react-icons/hi';
import { useState, useEffect } from 'react';
import API from '../services/api';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth(); // Auth context se user details aur functions lena
  const navigate = useNavigate();
  const [unread, setUnread] = useState(0); // Unread notifications ka count

  // ============ NOTIFICATIONS COUNT FETCH KARNA ============
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await API.get('/notifications');
        if (res.data.success) setUnread(res.data.unreadCount);
      } catch (err) { /* ignore errors */ }
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // Har 30 seconds baad refresh karo
    return () => clearInterval(interval);
  }, []);

  // Logout handle karna
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {/* Sidebar Header - Logo aur Name */}
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-icon">🏨</span>
          <h2>LuxuryStay</h2>
        </div>
      </div>

      {/* Main Navigation Links */}
      <nav className="sidebar-nav">
        {/* Dashboard Link */}
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <HiOutlineViewGrid className="nav-icon" /><span>Dashboard</span>
        </NavLink>
        
        {/* Rooms Link */}
        <NavLink to="/rooms" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <HiOutlineKey className="nav-icon" /><span>Rooms</span>
        </NavLink>
        
        {/* Bookings Link */}
        <NavLink to="/bookings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <HiOutlineCalendar className="nav-icon" /><span>Bookings</span>
        </NavLink>
        
        {/* Guests Link */}
        <NavLink to="/guests" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <HiOutlineUsers className="nav-icon" /><span>Guests</span>
        </NavLink>
        
        {/* Invoices Link */}
        <NavLink to="/invoices" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <HiOutlineDocumentText className="nav-icon" /><span>Invoices</span>
        </NavLink>
        
        {/* Services Link */}
        <NavLink to="/services" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <HiOutlineBell className="nav-icon" /><span>Services</span>
        </NavLink>
        
        {/* Housekeeping Link */}
        <NavLink to="/housekeeping" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <HiOutlineCog className="nav-icon" /><span>Housekeeping</span>
        </NavLink>
        
        {/* Maintenance Link */}
        <NavLink to="/maintenance" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <HiOutlineCog className="nav-icon" /><span>Maintenance</span>
        </NavLink>
        
        {/* Feedback Link */}
        <NavLink to="/feedback" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <HiOutlineStar className="nav-icon" /><span>Feedback</span>
        </NavLink>
        
        {/* AI Assistant Link */}
        <NavLink to="/ai-assistant" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <HiOutlineLightBulb className="nav-icon" /><span>AI Assistant</span>
        </NavLink>

        {/* Notifications Link with Red Badge */}
        <NavLink to="/notifications" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <HiOutlineBell className="nav-icon" />
          <span>Notifications</span>
          {unread > 0 && <span className="notif-badge">{unread}</span>}
        </NavLink>

        {/* Admin Only Links (Sirf managers ko nazar aayenge) */}
        {isAdmin && (
          <>
            <div className="nav-divider"></div>
            <NavLink to="/staff" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <HiOutlineUserGroup className="nav-icon" /><span>Staff Members</span>
            </NavLink>
            <NavLink to="/create-user" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <HiOutlineUserAdd className="nav-icon" /><span>Register Staff</span>
            </NavLink>
            <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <HiOutlineCog className="nav-icon" /><span>System Settings</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* Sidebar Footer - User profile aur Logout button */}
      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div className="user-details">
            <p className="user-name">{user?.name}</p>
            <span className="user-role">{user?.role}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn" title="Logout"><HiOutlineLogout /></button>
      </div>
    </aside>
  );
};

export default Sidebar;
