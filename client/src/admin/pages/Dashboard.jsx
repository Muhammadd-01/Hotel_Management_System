// Dashboard.jsx - Yeh page hotel ki live summary dikhata hai
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import StatusBadge from '../components/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  HiOutlineKey, HiOutlineCalendar, HiOutlineCash, HiOutlineCheckCircle,
  HiOutlineUsers, HiOutlineCog, HiOutlineStar, HiOutlineBell
} from 'react-icons/hi';
import { HiOutlineWrench } from 'react-icons/hi2';

// Charts ke liye color palette define karna
const CHART_COLORS = ['#00C2A8', '#0A2A43', '#081F5C', '#6B7280'];

const Dashboard = () => {
  const { user } = useAuth(); // Logged-in user ka data
  const [stats, setStats] = useState(null); // Backend se aane wale stats
  const [loading, setLoading] = useState(true); // Loading state

  // ============ STATS FETCH KARNE KA LOGIC ============
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

  return (
    <div className="dashboard-page">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1>{isGuest ? 'Guest Portal' : `${user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} Dashboard`}</h1>
          <p className="page-subtitle">
            Welcome back, {user?.name}! 👋 
            {isGuest ? ' How is your royal stay progressing?' : 
             user?.role === 'manager' ? ' Oversee the hotel operations and executive analytics.' :
             user?.role === 'receptionist' ? ' Manage the check-ins and guest reservations.' :
             user?.role === 'housekeeping' ? ' Monitor room cleanliness and housekeeping tasks.' :
             ' Here is your operational summary for today.'}
          </p>
        </div>
      </div>

      {/* Guest Specific View */}
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
              <p className="text-secondary">AI suggests: Aap deluxe room amenities aur spa services try karein!</p>
              <button className="btn btn-primary mt-16" onClick={() => navigate('/ai-assistant')}>Explore with AI Assistant</button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Staff/Admin View - Core Metrics */}
          <div className="stats-grid">
            <div className="stat-card glass">
              <div className="stat-icon" style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}><HiOutlineKey size={24} /></div>
              <div className="stat-info"><h3>{stats?.totalRooms || 0}</h3><p>Total Rooms</p></div>
            </div>
            
            {/* Receptionist/Admin specific: Available Rooms */}
            {['admin', 'manager', 'receptionist'].includes(user?.role) && (
              <div className="stat-card glass">
                <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><HiOutlineCheckCircle size={24} /></div>
                <div className="stat-info"><h3>{stats?.availableRooms || 0}</h3><p>Available Now</p></div>
              </div>
            )}

            {/* Housekeeping specific: Rooms to Clean */}
            {['admin', 'manager', 'housekeeping'].includes(user?.role) && (
              <div className="stat-card glass">
                <div className="stat-icon" style={{ background: 'rgba(255, 171, 0, 0.1)', color: '#FFAB00' }}><HiOutlineCog size={24} /></div>
                <div className="stat-info"><h3>{stats?.roomsToClean || 0}</h3><p>Rooms to Clean</p></div>
              </div>
            )}

            {/* Admin/Manager specific: Revenue */}
            {['admin', 'manager'].includes(user?.role) && (
              <div className="stat-card glass">
                <div className="stat-icon" style={{ background: 'rgba(0, 209, 255, 0.1)', color: 'var(--accent)' }}><HiOutlineCash size={24} /></div>
                <div className="stat-info"><h3>Rs. {stats?.totalRevenue?.toLocaleString() || 0}</h3><p>Total Revenue</p></div>
              </div>
            )}

            {/* Maintenance specific: Pending Issues */}
            {['admin', 'manager', 'maintenance'].includes(user?.role) && (
              <div className="stat-card glass">
                <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><HiOutlineWrench size={24} /></div>
                <div className="stat-info"><h3>{stats?.pendingMaintenance || 0}</h3><p>Pending Issues</p></div>
              </div>
            )}
          </div>

          <div className="charts-grid">
            <div className="chart-card glass">
              <h3>Inventory Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats?.roomsByType?.map(i => ({ name: i._id, count: i.count })) || []}>
                  <XAxis dataKey="name" hide />
                  <Tooltip />
                  <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card glass">
              <h3>Maintenance Alerts</h3>
              <div className="alert-list">
                <div className="stat-info">
                  <h3 style={{ color: 'var(--error)' }}>{stats?.pendingMaintenance || 0}</h3>
                  <p>Pending Issues</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="card glass-card">
            <div className="card-header"><h3>Recent Activity</h3></div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr><th>Guest</th><th>Room</th><th>Status</th><th>Amount</th></tr>
                </thead>
                <tbody>
                  {stats?.recentBookings?.slice(0, 5).map(b => (
                    <tr key={b._id}>
                      <td><strong>{b.guestName}</strong></td>
                      <td>{b.room?.roomNumber}</td>
                      <td><StatusBadge status={b.status} /></td>
                      <td>Rs. {b.totalAmount?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
