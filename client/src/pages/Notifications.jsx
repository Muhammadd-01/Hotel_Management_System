// Notifications.jsx - Yeh page system ke alerts aur alerts history dikhata hai
import { useState, useEffect } from 'react';
import API from '../services/api';
import { HiOutlineBell, HiCheck, HiTrash } from 'react-icons/hi';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]); // Alerts ki list
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');

  // ============ NOTIFICATIONS LOAD KARNA ============
  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNotifications(); }, []);

  // ============ EK NOTIFICATION KO "READ" MARK KARNA ============
  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      fetchNotifications(); // List refresh karo
    } catch (err) { console.error(err); }
  };

  // ============ SAARI NOTIFICATIONS KO "READ" MARK KARNA ============
  const markAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setSuccess('Sari notifications read ho gayin!');
      fetchNotifications();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
  };

  // ============ DELETE KARNA ============
  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div></div>;

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div><h1><HiOutlineBell className="header-icon" /> Notifications</h1><p className="page-subtitle">System ke latest alerts aur updates yahan dekhein</p></div>
        {notifications.length > 0 && (
          <button className="btn btn-secondary" onClick={markAllRead}><HiCheck /> Mark All Read</button>
        )}
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      <div className="notification-list">
        {notifications.length > 0 ? notifications.map((n) => (
          <div key={n._id} className={`card notification-item ${!n.isRead ? 'unread' : ''}`} style={{
            padding: '16px 20px', marginBottom: '12px',
            borderLeft: n.isRead ? 'none' : '4px solid var(--accent)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: n.isRead ? 'var(--card)' : 'rgba(0, 194, 168, 0.05)'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>{n.title}</h3>
                <span className={`status-badge badge-${n.type === 'alert' ? 'danger' : 'info'}`} style={{ fontSize: '0.7rem' }}>{n.type}</span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{n.message}</p>
              <small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small>
            </div>
            
            <div className="action-buttons">
              {!n.isRead && <button className="btn-icon" onClick={() => markAsRead(n._id)} title="Mark as read" style={{ color: 'var(--accent)' }}><HiCheck /></button>}
              <button className="btn-icon" onClick={() => deleteNotification(n._id)} title="Delete" style={{ color: 'var(--error)' }}><HiTrash /></button>
            </div>
          </div>
        )) : <div className="card" style={{ padding: '40px', textAlign: 'center' }}><p className="text-muted">Koi notification nahi hai</p></div>}
      </div>
    </div>
  );
};

export default Notifications;
