exports.notFound = (req, res) => res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
exports.errorHandler = (err, req, res, next) => {
  let status = err.status || 500, message = err.message || 'Server error';
  if (err.name === 'ValidationError') { status = 400; message = Object.values(err.errors)[0].message; }
  else if (err.name === 'CastError') { status = 404; message = 'Resource not found'; }
  else if (err.code === 11000) { status = 400; message = 'Email already registered'; }
  if (status === 500) console.error(err);
  res.status(status).json({ message: status === 500 ? 'Internal server error' : message });
};
