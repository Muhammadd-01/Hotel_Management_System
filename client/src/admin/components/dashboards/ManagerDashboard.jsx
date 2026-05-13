import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { HiOutlineCash, HiOutlineUsers, HiOutlineTrendingUp, HiOutlineStar } from 'react-icons/hi';

const CHART_COLORS = ['#00D1FF', '#10B981', '#F59E0B', '#8B5CF6'];

const ManagerDashboard = ({ stats }) => {
  return (
    <div className="manager-dashboard animate-fade-in">
      {/* Executive Overview */}
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}><HiOutlineCash size={26} /></div>
          <div className="stat-info">
            <p>Total Revenue</p>
            <h3>Rs. {stats?.totalRevenue?.toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}><HiOutlineUsers size={26} /></div>
          <div className="stat-info">
            <p>Total Guests</p>
            <h3>{stats?.totalGuests}</h3>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#FFAB00' }}><HiOutlineTrendingUp size={26} /></div>
          <div className="stat-info">
            <p>Active Bookings</p>
            <h3>{stats?.totalBookings}</h3>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6' }}><HiOutlineStar size={26} /></div>
          <div className="stat-info">
            <p>Guest Rating</p>
            <h3>{stats?.averageRating || 4.8} / 5</h3>
          </div>
        </div>
      </div>

      <div className="charts-grid mt-24">
        {/* Revenue Area Chart */}
        <div className="chart-card glass-card">
          <div className="card-header"><h3>Revenue Performance</h3></div>
          <div className="p-24">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={stats?.roomsByType?.map(i => ({ name: i._id, value: i.count * 7500 })) || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="var(--text-secondary)" fontSize={12} />
                <YAxis axisLine={false} tickLine={false} stroke="var(--text-secondary)" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-lg)' }} />
                <Area type="monotone" dataKey="value" stroke="var(--accent)" fill="var(--accent-soft)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Room Distribution Pie */}
        <div className="chart-card glass-card">
          <div className="card-header"><h3>Room Allocation</h3></div>
          <div className="p-24">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats?.roomsByType?.map(i => ({ name: i._id, value: i.count })) || []}
                  cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value"
                >
                  {stats?.roomsByType?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Operational Summary & Quick Actions */}
      <div className="grid-2 mt-24" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        <div className="card glass-card">
          <div className="card-header"><h3>Recent Bookings Summary</h3></div>
          <div className="p-0 table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Guest Name</th>
                  <th>Room Type</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentBookings?.length > 0 ? stats.recentBookings.map(b => (
                  <tr key={b._id}>
                    <td><strong>{b.guestName}</strong></td>
                    <td><span className="badge-default status-badge">{b.room?.type || 'Standard'}</span></td>
                    <td><span className="badge-success-light">Rs. {b.totalAmount}</span></td>
                  </tr>
                )) : (
                  <tr><td colSpan="3" className="empty-state">No recent bookings found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card glass-card">
          <div className="card-header"><h3>Managerial Quick Actions</h3></div>
          <div className="p-24 flex flex-col gap-12">
            <p className="text-muted mb-8">Review critical operational areas.</p>
            <button className="btn btn-primary btn-full" style={{ padding: '14px' }} onClick={() => window.location.href='/bookings'}>Review All Bookings</button>
            <button className="btn btn-secondary btn-full" style={{ padding: '14px' }} onClick={() => window.location.href='/rooms'}>Update Room Pricing</button>
            <button className="btn btn-outline btn-full" style={{ padding: '14px', border: '1.5px solid var(--border)' }} onClick={() => window.location.href='/housekeeping'}>Inspect Cleanliness</button>
            
            <div className="nav-divider" style={{ background: 'var(--border)', margin: '12px 0' }}></div>
            
            <div className="grid-2" style={{ gap: '10px', display: 'grid' }}>
              <div className="operation-item" style={{ padding: '12px' }}>
                <h4 style={{ fontSize: '1.2rem' }}>{stats?.pendingHousekeeping || 0}</h4>
                <p style={{ fontSize: '0.7rem' }}>Tasks</p>
              </div>
              <div className="operation-item" style={{ padding: '12px' }}>
                <h4 style={{ fontSize: '1.2rem' }}>{stats?.pendingServices || 0}</h4>
                <p style={{ fontSize: '0.7rem' }}>Orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
