const express = require('express');
const attachmentController = require('./attachment.controller');
const { protect } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validation.middleware');
const { handleSingleUpload } = require('../../middlewares/upload.middleware');
const { validateUploadAttachment } = require('./attachment.validation');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  handleSingleUpload('file'),
  validate(validateUploadAttachment),
  attachmentController.uploadAttachment
);
router.get('/', attachmentController.getAttachmentsByTask);
router.delete('/:id', attachmentController.deleteAttachment);

module.exports = router;
