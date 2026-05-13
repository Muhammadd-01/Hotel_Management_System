// validate.js - yeh file input validation rules define karti hai
const { body, validationResult } = require('express-validator');

// ============ VALIDATION RESULT CHECK ============
// yeh middleware validation errors check karta hai
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  // agar validation errors hain to unko return karo
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => err.msg)
    });
  }
  next();
};

// ============ LOGIN VALIDATION RULES ============
// login ke liye email aur password zaroori hai
const loginRules = [
  body('email').isEmail().withMessage('Valid email dena zaroori hai'),
  body('password').notEmpty().withMessage('Password dena zaroori hai'),
  handleValidation
];

// ============ REGISTER VALIDATION RULES ============
// register ke liye naam, email, password, aur role zaroori hai
const registerRules = [
  body('name').notEmpty().withMessage('Naam dena zaroori hai').trim(),
  body('email').isEmail().withMessage('Valid email dena zaroori hai'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password kam se kam 6 characters ka hona chahiye'),
  body('role')
    .optional()
    .isIn(['superadmin', 'manager', 'receptionist', 'housekeeping', 'staff', 'guest'])
    .withMessage('Role valid hona chahiye (superadmin, manager, receptionist, housekeeping, staff, ya guest)'),
  handleValidation
];

// ============ ROOM VALIDATION RULES ============
// room create/update ke liye validation
const roomRules = [
  body('roomNumber').notEmpty().withMessage('Room number dena zaroori hai').trim(),
  body('type')
    .isIn(['Single', 'Double', 'Deluxe'])
    .withMessage('Room type Single, Double, ya Deluxe hona chahiye'),
  body('price')
    .isNumeric()
    .withMessage('Price ek number hona chahiye')
    .custom(val => val >= 0)
    .withMessage('Price 0 se kam nahi ho sakti'),
  handleValidation
];

// ============ BOOKING VALIDATION RULES ============
// booking create ke liye validation
const bookingRules = [
  body('guestName').notEmpty().withMessage('Guest ka naam dena zaroori hai').trim(),
  body('room').notEmpty().withMessage('Room select karna zaroori hai'),
  body('checkIn').notEmpty().withMessage('Check-in date dena zaroori hai'),
  body('checkOut').notEmpty().withMessage('Check-out date dena zaroori hai'),
  handleValidation
];

module.exports = {
  loginRules,
  registerRules,
  roomRules,
  bookingRules,
  handleValidation
};
