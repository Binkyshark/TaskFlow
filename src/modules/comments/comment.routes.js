const express = require('express');
const commentController = require('./comment.controller');
const { protect } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validation.middleware');
const {
  validateCreateComment,
  validateUpdateComment
} = require('./comment.validation');

const router = express.Router({
  mergeParams: true
});

router.use(protect);

/*
|--------------------------------------------------------------------------
| Nested Routes
|--------------------------------------------------------------------------
*/

router.post(
  '/',
  validate(validateCreateComment),
  commentController.createComment
);

router.get(
  '/',
  commentController.getCommentsByTask
);

/*
|--------------------------------------------------------------------------
| Standalone Routes
|--------------------------------------------------------------------------
*/

router.get(
  '/:id',
  commentController.getCommentById
);

router.patch(
  '/:id',
  validate(validateUpdateComment),
  commentController.updateComment
);

router.delete(
  '/:id',
  commentController.deleteComment
);

module.exports = router;
