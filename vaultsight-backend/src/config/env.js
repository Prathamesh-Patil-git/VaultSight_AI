require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  EMBEDDING_SERVICE_URL: process.env.EMBEDDING_SERVICE_URL || 'http://localhost:8000',
  AUTO_LOCK_RISK_THRESHOLD: parseInt(process.env.AUTO_LOCK_RISK_THRESHOLD) || 75,
  AUTO_LOCK_AMOUNT_THRESHOLD: parseInt(process.env.AUTO_LOCK_AMOUNT_THRESHOLD) || 100000,
  NODE_ENV: process.env.NODE_ENV || 'development'
};
