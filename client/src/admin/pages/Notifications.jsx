// Notifications.jsx - Displays system alerts, operational updates, and notification history
import { useState, useEffect } from 'react';
import API from '../../services/api';
import { HiOutlineBell, HiCheck, HiTrash } from 'react-icons/hi';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]); // List of system alerts
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');

  // ============ NOTIFICATION RETRIEVAL LOGIC ============
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

  // ============ MARK SINGLE NOTIFICATION AS READ ============
  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      fetchNotifications(); // Refresh the list to update status
    } catch (err) { console.error(err); }
  };

  // ============ BATCH MARK AS READ ============
  const markAllRead = async () => {
    try {
      await API.put('/notifications/read-all');
      setSuccess('All notifications marked as read!');
      fetchNotifications();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) { console.error(err); }
  };

  // ============ DELETE NOTIFICATION ============
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
        <div><h1><HiOutlineBell className="header-icon" /> Notifications</h1><p className="page-subtitle">View the latest system alerts and operational updates</p></div>
        {notifications.length > 0 && (
          <button className="btn btn-secondary" onClick={markAllRead}><HiCheck /> Mark All as Read</button>
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
        )) : (
          <div className="card glass-card empty-notif">
            <p className="text-muted">You have no new notifications.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
