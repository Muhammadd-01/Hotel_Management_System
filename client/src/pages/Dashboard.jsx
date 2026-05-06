// Dashboard.jsx - Yeh page hotel ki live summary dikhata hai
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  HiOutlineKey, HiOutlineCalendar, HiOutlineCash, HiOutlineCheckCircle,
  HiOutlineUsers, HiOutlineCog, HiOutlineStar, HiOutlineBell, HiOutlineWrench
} from 'react-icons/hi';

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
        // Backend API ko call karna stats ke liye
        const res = await API.get('/dashboard/stats');
        if (res.data.success) {
          setStats(res.data.stats); // Data milne par state update karna
        }
      } catch (error) {
        console.error('Stats fetch error:', error);
      } finally {
        setLoading(false); // Loading khatam
      }
    };
    fetchStats();
  }, []);

  // Agar data load ho raha hai to spinner dikhao
  if (loading) {
    return <div className="page-loading"><div className="spinner"></div></div>;
  }

  // Pie chart ke liye data tayyar karna (Room availability)
  const roomStatusData = [
    { name: 'Available', value: stats?.availableRooms || 0 },
    { name: 'Booked', value: stats?.bookedRooms || 0 },
    { name: 'Cleaning', value: stats?.cleaningRooms || 0 },
  ].filter(d => d.value > 0);

  // Bar chart ke liye data (Room types distribution)
  const roomTypeData = stats?.roomsByType?.map(item => ({
    name: item._id,
    count: item.count
  })) || [];

  return (
    <div className="dashboard-page">
      {/* Page header - User ko welcome karna */}
      <div className="page-header">
        <div>
          <h1>Dashboard Overview</h1>
          <p className="page-subtitle">Welcome back, {user?.name}! 👋 Hotel mein aaj kya ho raha hai?</p>
        </div>
      </div>

      {/* Main Stats Cards - 4 bade metrics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(10, 42, 67, 0.1)', color: '#0A2A43' }}><HiOutlineKey size={24} /></div>
          <div className="stat-info"><h3>{stats?.totalRooms || 0}</h3><p>Total Rooms</p></div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(0, 194, 168, 0.1)', color: '#00C2A8' }}><HiOutlineCheckCircle size={24} /></div>
          <div className="stat-info"><h3>{stats?.availableRooms || 0}</h3><p>Available Now</p></div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(8, 31, 92, 0.1)', color: '#081F5C' }}><HiOutlineCalendar size={24} /></div>
          <div className="stat-info"><h3>{stats?.totalBookings || 0}</h3><p>Total Bookings</p></div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}><HiOutlineCash size={24} /></div>
          <div className="stat-info"><h3>Rs. {stats?.totalRevenue?.toLocaleString() || 0}</h3><p>Total Revenue</p></div>
        </div>
      </div>

      {/* Operational Stats - Maintenance aur Services ka status */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}><HiOutlineUsers size={24} /></div>
          <div className="stat-info"><h3>{stats?.totalGuests || 0}</h3><p>Guest Profiles</p></div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}><HiOutlineWrench size={24} /></div>
          <div className="stat-info"><h3>{stats?.pendingMaintenance || 0}</h3><p>Maintenance Alerts</p></div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}><HiOutlineStar size={24} /></div>
          <div className="stat-info"><h3>{stats?.averageRating || 0} / 5</h3><p>Avg Rating</p></div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(0, 194, 168, 0.1)', color: '#00C2A8' }}><HiOutlineBell size={24} /></div>
          <div className="stat-info"><h3>{stats?.pendingServices || 0}</h3><p>Pending Services</p></div>
        </div>
      </div>

      {/* Charts section - Data ko visualize karna */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Inventory Distribution (Room Types)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={roomTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip />
              <Bar dataKey="count" fill="#00C2A8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Current Occupancy (Live Status)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={roomStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {roomStatusData.map((entry, index) => (
                  <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bookings Table - Haal ki bookings ki list */}
      <div className="card">
        <div className="card-header"><h3>Recent Bookings</h3></div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Guest Name</th><th>Room</th><th>Type</th><th>Check In</th><th>Check Out</th><th>Amount</th><th>Status</th></tr>
            </thead>
            <tbody>
              {stats?.recentBookings?.length > 0 ? (
                stats.recentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td><strong>{booking.guestName}</strong></td>
                    <td>{booking.room?.roomNumber || 'N/A'}</td>
                    <td>{booking.room?.type || 'N/A'}</td>
                    <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                    <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                    <td>Rs. {booking.totalAmount?.toLocaleString()}</td>
                    <td><StatusBadge status={booking.status} /></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="empty-state">Koi nayi booking nahi mili</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
