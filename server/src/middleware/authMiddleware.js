const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

exports.adminMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // You might want to fetch the user from database to check role
    // For now, we'll assume the role is in the token or check from DB
    const User = require('../models/User');
    User.findById(decoded.userId)
      .then(user => {
        if (!user || user.role !== 'admin') {
          return res.status(403).json({ message: 'Admin access required' });
        }
        req.userId = decoded.userId;
        req.user = user;
        next();
      })
      .catch(error => {
        console.error('Admin middleware error:', error);
        return res.status(500).json({ message: 'Server error' });
      });
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};