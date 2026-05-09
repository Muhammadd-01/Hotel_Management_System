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
          <div key={n._id} className={`card notification-item glass-card ${!n.isRead ? 'unread-notif' : ''}`}>
            <div className="notif-content">
              <div className="notif-title-row">
                <h3>{n.title}</h3>
                <span className={`status-badge badge-${n.type === 'alert' ? 'danger' : 'info'}`}>{n.type}</span>
              </div>
              <p className="notif-message">{n.message}</p>
              <small className="notif-time">{new Date(n.createdAt).toLocaleString()}</small>
            </div>
            
            <div className="action-buttons">
              {!n.isRead && <button className="btn-icon btn-success-light" onClick={() => markAsRead(n._id)} title="Mark as read"><HiCheck /></button>}
              <button className="btn-icon btn-danger-light" onClick={() => deleteNotification(n._id)} title="Delete"><HiTrash /></button>
            </div>
          </div>
        )) : <div className="card glass-card empty-notif"><p className="text-muted">Koi notification nahi hai</p></div>}
      </div>
    </div>
  );
};

export default Notifications;
