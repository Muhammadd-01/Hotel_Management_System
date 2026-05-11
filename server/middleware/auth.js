// auth.js - this middleware verifies JWT token and checks roles
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ============ PROTECT MIDDLEWARE ============
// this middleware checks if the user is logged in
const protect = async (req, res, next) => {
  let token;

  // extract token from authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // extract token value from "Bearer TOKEN_VALUE"
    token = req.headers.authorization.split(' ')[1];
  }

  // if no token found, return unauthorized response
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Login is required - token not found'
    });
  }

  try {
    // verify token with JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find user in database by decoded id
    req.user = await User.findById(decoded.id);

    // if user not found, return error
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not found - invalid token'
      });
    }

    next();
  } catch (error) {
    // token is invalid or expired
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or expired'
    });
  }
};

// ============ AUTHORIZE MIDDLEWARE ============
// this middleware checks if the user's role is allowed
const authorize = (...roles) => {
  return (req, res, next) => {
    // if user role is not in allowed roles, deny access
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not allowed to perform this action`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
