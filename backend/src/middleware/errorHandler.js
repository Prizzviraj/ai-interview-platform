const env = require('../config/env');

module.exports = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || 'Server error';
  let code = typeof err.code === 'string' ? err.code : 'SERVER_ERROR';

  if (err.name === 'ValidationError') { status = 400; code = 'VALIDATION_ERROR'; }
  if (err.name === 'CastError') { status = 400; message = 'Invalid id'; code = 'INVALID_ID'; }
  if (err.code === 11000) { status = 409; message = 'Already exists'; code = 'DUPLICATE'; }
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    status = 401; message = 'Invalid or expired token'; code = 'UNAUTHORIZED';
  }

  if (status === 500) console.error(err);

  res.status(status).json({
    success: false,
    message: status === 500 && env.NODE_ENV === 'production' ? 'Server error' : message,
    code,
    ...(err.details && { details: err.details }),
  });
};