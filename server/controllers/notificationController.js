// notificationController.js - yeh controller notifications handle karta hai
const Notification = require('../models/Notification');

// GET /api/notifications - user ki notifications
const getNotifications = async (req, res) => {
  try {
    // user ki specific notifications + sab ke liye wali (forUser = null)
    const notifications = await Notification.find({
      $or: [{ forUser: req.user._id }, { forUser: null }]
    }).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({
      $or: [{ forUser: req.user._id }, { forUser: null }],
      isRead: false
    });
    res.json({ success: true, notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Notifications fetch mein error' });
  }
};

// PUT /api/notifications/:id/read - notification read mark karo
const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true, message: 'Notification read ho gayi' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error marking notification' });
  }
};

// PUT /api/notifications/read-all - saari notifications read karo
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { $or: [{ forUser: req.user._id }, { forUser: null }], isRead: false },
      { isRead: true }
    );
    res.json({ success: true, message: 'Saari notifications read ho gayin' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error marking all read' });
  }
};

module.exports = { getNotifications, markAsRead, markAllRead };
