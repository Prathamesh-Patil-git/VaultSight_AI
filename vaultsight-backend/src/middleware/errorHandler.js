const winston = require('winston');

const errorHandler = (err, req, res, next) => {
  winston.error(err.stack);

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ success: false, error: 'Validation Error', details });
  }

  // Mongoose Cast Error (Invalid ID)
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: 'Invalid ID format' });
  }

  // Duplicate Key Error
  if (err.code === 11000) {
    return res.status(409).json({ success: false, error: 'Resource already exists' });
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    details: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;
