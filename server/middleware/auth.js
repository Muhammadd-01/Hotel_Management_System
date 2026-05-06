// auth.js - yeh middleware JWT token verify karta hai aur role check karta hai
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ============ PROTECT MIDDLEWARE ============
// yeh middleware check karta hai ke user logged in hai ya nahi
const protect = async (req, res, next) => {
  let token;

  // Authorization header se token nikalo
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // "Bearer TOKEN_VALUE" mein se sirf token nikalo
    token = req.headers.authorization.split(' ')[1];
  }

  // agar token nahi mila to unauthorized response do
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Login karna zaroori hai - token nahi mila'
    });
  }

  try {
    // token verify karo JWT_SECRET ke saath
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // user ko database se find karo decoded id se
    req.user = await User.findById(decoded.id);

    // agar user nahi mila to error do
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User nahi mila - invalid token'
      });
    }

    next();
  } catch (error) {
    // token invalid ya expired hai
    return res.status(401).json({
      success: false,
      message: 'Token invalid hai ya expire ho gaya hai'
    });
  }
};

// ============ AUTHORIZE MIDDLEWARE ============
// yeh middleware check karta hai ke user ka role allowed hai ya nahi
const authorize = (...roles) => {
  return (req, res, next) => {
    // agar user ka role allowed roles mein nahi hai to access deny karo
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' ko yeh action karne ki ijazat nahi hai`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
