const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const winston = require('winston');

// System-level ObjectIds for hardcoded accounts
const SYSTEM_ADMIN_ID = new mongoose.Types.ObjectId('000000000000000000000001');
const SYSTEM_SOC_ID = new mongoose.Types.ObjectId('000000000000000000000002');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired token' });
    }
    
    let user;
    if (decoded.id === 'ADMIN_SESSION') {
      user = await User.findOne({ username: process.env.ADMIN_USERNAME });
      if (!user) {
        // Fallback for hardcoded admin if not in DB
        user = { 
          _id: SYSTEM_ADMIN_ID, 
          role: 'admin', 
          name: 'System Admin', 
          username: process.env.ADMIN_USERNAME || 'admin' 
        };
      }
    } else if (decoded.id === 'SOC_SESSION') {
      user = await User.findOne({ username: process.env.SOC_USERNAME });
      if (!user) {
        // Fallback for hardcoded SOC if not in DB
        user = { 
          _id: SYSTEM_SOC_ID, 
          role: 'soc', 
          name: 'SOC Lead', 
          username: process.env.SOC_USERNAME || 'soc' 
        };
      }
    } else {
      user = await User.findById(decoded.id);
    }

    if (!user) {
      winston.warn(`Auth failed: User not found for ID ${decoded.id}`);
      return res.status(401).json({ success: false, error: 'Unauthorized: User not found' });
    }

    // Attach to request
    req.user = user;
    next();
  } catch (error) {
    winston.error(`Auth Middleware Error: ${error.message}`);
    return res.status(500).json({ success: false, error: 'Internal server error in auth pipeline' });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ success: false, error: 'Forbidden: Admin access required' });
  }
};

const verifySOC = (req, res, next) => {
  if (req.user && (req.user.role === 'soc' || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ success: false, error: 'Forbidden: SOC access required' });
  }
};

module.exports = { 
  verifyToken, 
  verifyAdmin, 
  verifySOC,
  SYSTEM_ADMIN_ID,
  SYSTEM_SOC_ID
};

