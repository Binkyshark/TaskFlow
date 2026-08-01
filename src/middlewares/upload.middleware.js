const multer = require('multer');
const upload = require('../utils/upload');

/**
 * Handle single file upload with centralized error handling.
 *
 * @param {string} fieldName
 * @returns {Function}
 */
const handleSingleUpload = (fieldName = 'file') => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (!err) {
        return next();
      }

      if (err instanceof multer.MulterError) {
        switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            return res.status(400).json({
              success: false,
              message: 'File size exceeds the allowed limit.'
            });

          case 'LIMIT_UNEXPECTED_FILE':
            return res.status(400).json({
              success: false,
              message: 'Unexpected file field.'
            });

          case 'LIMIT_FILE_COUNT':
            return res.status(400).json({
              success: false,
              message: 'Too many files uploaded.'
            });

          default:
            return res.status(400).json({
              success: false,
              message: err.message
            });
        }
      }

      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed.'
      });
    });
  };
};

module.exports = {
  handleSingleUpload
};
