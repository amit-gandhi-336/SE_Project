function errorHandler(err, req, res, next) {
  console.error('API Error:', err);

  const statusCode = err.statusCode || (err.message && err.message.includes('not found') ? 404 : 400);

  res.status(statusCode).json({
    success: false,
    error: err.name || 'Error',
    message: err.message || 'An unexpected error occurred',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = errorHandler;
