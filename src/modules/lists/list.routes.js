const express = require('express');
const listController = require('./list.controller');
const { protect } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validation.middleware');
const {
  validateCreateList,
  validateUpdateList
} = require('./list.validation');

const router = express.Router({ mergeParams: true });

router.use(protect);

router.post('/', validate(validateCreateList), listController.createList);
router.get('/', listController.getListsByBoard);
router.get('/:id', listController.getListById);
router.patch('/:id', validate(validateUpdateList), listController.updateList);
router.delete('/:id', listController.deleteList);

module.exports = router;
