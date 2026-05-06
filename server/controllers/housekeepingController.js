// housekeepingController.js - yeh controller housekeeping tasks handle karta hai
const Housekeeping = require('../models/Housekeeping');
const Room = require('../models/Room');
const Notification = require('../models/Notification');

// GET /api/housekeeping - saare tasks ki list
const getAllTasks = async (req, res) => {
  try {
    const tasks = await Housekeeping.find()
      .populate('room', 'roomNumber type status')
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: tasks.length, tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Tasks fetch mein error' });
  }
};

// POST /api/housekeeping - naya task banao
const createTask = async (req, res) => {
  try {
    const task = await Housekeeping.create(req.body);
    // notification banao
    await Notification.create({
      title: 'New Housekeeping Task',
      message: `${req.body.taskType} task assign hua hai Room ke liye`,
      type: 'housekeeping',
      forUser: req.body.assignedTo || null
    });
    const populated = await Housekeeping.findById(task._id)
      .populate('room', 'roomNumber type status')
      .populate('assignedTo', 'name');
    res.status(201).json({ success: true, message: 'Task ban gaya!', task: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Task create mein error: ' + error.message });
  }
};

// PUT /api/housekeeping/:id - task update karo
const updateTask = async (req, res) => {
  try {
    // agar status Completed ho raha hai to completedAt set karo
    if (req.body.status === 'Completed') {
      req.body.completedAt = new Date();
    }
    const task = await Housekeeping.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('room', 'roomNumber type status')
      .populate('assignedTo', 'name');
    if (!task) return res.status(404).json({ success: false, message: 'Task nahi mila' });

    // agar cleaning complete ho gayi to room status Available karo
    if (req.body.status === 'Completed' && task.taskType === 'Cleaning') {
      await Room.findByIdAndUpdate(task.room._id, { status: 'Available' });
    }
    res.json({ success: true, message: 'Task update ho gaya!', task });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Task update mein error' });
  }
};

// DELETE /api/housekeeping/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Housekeeping.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Task nahi mila' });
    res.json({ success: true, message: 'Task delete ho gaya!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Task delete mein error' });
  }
};

module.exports = { getAllTasks, createTask, updateTask, deleteTask };
