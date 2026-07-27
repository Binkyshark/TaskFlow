const express = require('express');
const boardController = require('./board.controller');
const { protect } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validation.middleware');
const {
  validateUpdateBoard
} = require('./board.validation');

const router = express.Router();

router.use(protect);

router.get('/:boardId', boardController.getBoardById);

router.patch(
  '/:boardId',
  validate(validateUpdateBoard),
  boardController.updateBoard
);

router.delete('/:boardId', boardController.deleteBoard);

module.exports = router;