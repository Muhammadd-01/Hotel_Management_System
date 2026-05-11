// staffController.js - yeh controller staff management handle karta hai (admin only)
const User = require('../models/User');

// GET /api/staff - saare staff members ki list (admin aur staff roles only)
const getAllStaff = async (req, res) => {
  try {
    // Sirf admin aur staff roles ko fetch karein, guests ko nahi
    const staff = await User.find({ role: { $in: ['admin', 'staff'] } })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: staff.length, staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Staff fetch mein error' });
  }
};

// PUT /api/staff/:id - staff profile update karo
const updateStaff = async (req, res) => {
  try {
    // password update na karo yahan se - security ke liye
    const { name, email, role } = req.body;
    const staff = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true, runValidators: true }
    ).select('-password');
    if (!staff) return res.status(404).json({ success: false, message: 'Staff nahi mila' });
    res.json({ success: true, message: 'Staff update ho gaya!', staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Staff update mein error' });
  }
};

// PUT /api/staff/:id/deactivate - staff deactivate karo
const deactivateStaff = async (req, res) => {
  try {
    // admin apne aap ko deactivate nahi kar sakta
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Aap apne aap ko deactivate nahi kar sakte' });
    }
    const staff = await User.findByIdAndDelete(req.params.id);
    if (!staff) return res.status(404).json({ success: false, message: 'Staff nahi mila' });
    res.json({ success: true, message: 'Staff deactivate ho gaya!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Staff deactivate mein error' });
  }
};

module.exports = { getAllStaff, updateStaff, deactivateStaff };
