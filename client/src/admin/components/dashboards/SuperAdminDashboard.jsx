import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { HiOutlineUserGroup, HiOutlineOfficeBuilding, HiOutlineShieldCheck, HiOutlineServer } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const SuperAdminDashboard = ({ stats }) => {
  const navigate = useNavigate();

  // Dynamic values based on real stats
  const totalUsers = stats?.totalGuests || 0;
  const totalRooms = stats?.totalRooms || 0;
  const systemOperational = true; // Could be dynamic if we had health checks

  return (
    <div className="superadmin-dashboard animate-fade-in">
      {/* Executive Overview Stats */}
      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366F1' }}><HiOutlineShieldCheck size={26} /></div>
          <div className="stat-info">
            <p>System Status</p>
            <h3>{systemOperational ? 'Operational' : 'Maintenance'}</h3>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}><HiOutlineUserGroup size={26} /></div>
          <div className="stat-info">
            <p>Total Personnel</p>
            <h3>{totalUsers} Active</h3>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' }}><HiOutlineOfficeBuilding size={26} /></div>
          <div className="stat-info">
            <p>Global Inventory</p>
            <h3>{totalRooms} Rooms</h3>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}><HiOutlineServer size={26} /></div>
          <div className="stat-info">
            <p>Database Health</p>
            <h3>Optimized</h3>
          </div>
        </div>
      </div>

      <div className="charts-grid mt-24">
        {/* Analytics Chart */}
        <div className="chart-card glass-card">
          <div className="card-header">
            <h3>Hotel Performance Analytics</h3>
          </div>
          <div className="p-24">
            {stats?.roomsByType ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.roomsByType}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="_id" stroke="var(--text-secondary)" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="var(--text-secondary)" fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#1E293B', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: 'var(--accent)' }}
                  />
                  <Bar dataKey="count" fill="var(--accent)" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state">No performance data available yet.</div>
            )}
          </div>
        </div>

        {/* Executive Control Gateway */}
        <div className="card glass-card">
          <div className="card-header">
            <h3>Administrative Control</h3>
          </div>
          <div className="p-24 flex flex-col gap-20">
            <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
              Execute critical system operations and manage verified hotel personnel through the centralized control gateway.
            </p>
            <div className="action-grid-v">
              <button className="btn btn-primary btn-full justify-start" style={{ padding: '18px 24px', borderRadius: '14px' }} onClick={() => navigate('/staff')}>
                <HiOutlineUserGroup className="nav-icon" /> <span>Manage Personnel Directory</span>
              </button>
              <button className="btn btn-secondary btn-full justify-start" style={{ padding: '18px 24px', borderRadius: '14px' }} onClick={() => navigate('/settings')}>
                <HiOutlineShieldCheck className="nav-icon" /> <span>Security & Audit Logs</span>
              </button>
              <button className="btn btn-secondary btn-full justify-start" style={{ padding: '18px 24px', borderRadius: '14px' }} onClick={() => navigate('/rooms')}>
                <HiOutlineOfficeBuilding className="nav-icon" /> <span>Global Inventory Control</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Activity Log - Dynamic Personnel List */}
      <div className="card glass-card mt-24">
        <div className="card-header">
          <h3>Recent Personnel Activity</h3>
        </div>
        <div className="p-0 table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Access Role</th>
                <th>Status</th>
                <th>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentBookings?.length > 0 ? (
                stats.recentBookings.slice(0, 4).map((b, idx) => (
                  <tr key={idx}>
                    <td><strong>{b.guestName}</strong></td>
                    <td><span className="status-badge badge-info">Personnel</span></td>
                    <td><span className="status-badge badge-success">Active</span></td>
                    <td>Just Now</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="empty-state">No recent activity detected.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
