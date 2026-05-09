import { AppError } from '../utils/errors.js';

export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      detail: err.message
    });
  }

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      detail: 'File too large (max 20MB)'
    });
  }

  // Default error
  res.status(500).json({
    detail: 'Internal server error'
  });
}
