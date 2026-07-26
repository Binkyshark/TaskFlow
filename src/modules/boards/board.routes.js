const express = require('express');
const boardController = require('./board.controller');
const { protect } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validation.middleware');
const {
  validateCreateBoard,
  validateUpdateBoard
} = require('./board.validation');

const router = express.Router();

router.use(protect);

router.post('/', validate(validateCreateBoard), boardController.createBoard);
router.get('/', boardController.getBoardsByProject);
router.get('/:id', boardController.getBoardById);
router.patch('/:id', validate(validateUpdateBoard), boardController.updateBoard);
router.delete('/:id', boardController.deleteBoard);

module.exports = router;
