const upload = require('../utils/upload');
const multer = require('multer');

/**
 * Handle single file upload with error handling
 * @param {String} fieldName 
 */
const handleSingleUpload = (fieldName) => {
  return (req, res, next) => {
    const singleUpload = upload.single(fieldName);

    singleUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size limit exceeded.'
          });
        }
        return res.status(400).json({
          success: false,
          message: `Upload error: ${err.message}`
        });
      } else if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }

      next();
    });
  };
};

module.exports = {
  handleSingleUpload
};
