function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  let statusCode = 500;
  let message = 'Internal server error';
  let details = null;

  // JOI or custom validation
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
    details = err.errors || err.details || null;
  }

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Validation error';
    details = err.errors.map(e => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'Duplicate entry';
    details = err.errors.map(e => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Custom application error with statusCode
  if (err.message && err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Stock or resource specific errors
  if (['Insufficient stock', 'Product not found', 'Order not found'].includes(err.message)) {
    statusCode = err.message === 'Insufficient stock' ? 400 : 404;
    message = err.message;
  }

  res.status(statusCode).json({
    error: message,
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}

export default errorHandler;
