// feedbackController.js - yeh controller guest feedback handle karta hai
const Feedback = require('../models/Feedback');

// GET /api/feedback - saari feedback ki list
const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('guest', 'name email')
      .populate('booking', 'guestName room')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: feedbacks.length, feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Feedback fetch mein error' });
  }
};

// POST /api/feedback - nayi feedback submit karo
const createFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create(req.body);
    res.status(201).json({ success: true, message: 'Feedback submit ho gayi!', feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Feedback submit mein error: ' + error.message });
  }
};

// PUT /api/feedback/:id - feedback review karo ya respond karo
const updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('guest', 'firstName lastName');
    if (!feedback) return res.status(404).json({ success: false, message: 'Feedback nahi mili' });
    res.json({ success: true, message: 'Feedback update ho gayi!', feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Feedback update mein error' });
  }
};

// DELETE /api/feedback/:id
const deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Feedback delete ho gayi!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Feedback delete mein error' });
  }
};

module.exports = { getAllFeedback, createFeedback, updateFeedback, deleteFeedback };
