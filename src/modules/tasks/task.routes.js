const express = require('express');
const taskController = require('./task.controller');
const { protect } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validation.middleware');
const {
  validateCreateTask,
  validateUpdateTask
} = require('./task.validation');

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
  validate(validateCreateTask),
  taskController.createTask
);

router.get(
  '/',
  taskController.getTasks
);

/*
|--------------------------------------------------------------------------
| Standalone Routes
|--------------------------------------------------------------------------
*/

router.get(
  '/:id',
  taskController.getTaskById
);

router.patch(
  '/:id',
  validate(validateUpdateTask),
  taskController.updateTask
);

router.delete(
  '/:id',
  taskController.deleteTask
);

module.exports = router;
