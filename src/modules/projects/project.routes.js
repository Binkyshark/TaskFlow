const express = require('express');
const projectController = require('./project.controller');
const boardController = require('../boards/board.controller');

const { protect } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validation.middleware');

const {
  validateCreateProject,
  validateUpdateProject,
  validateAddMember
} = require('./project.validation');

const {
  validateCreateBoard
} = require('../boards/board.validation');

const router = express.Router();

router.use(protect);

// Projects
router.post('/', validate(validateCreateProject), projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.patch('/:id', validate(validateUpdateProject), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

// Members
router.post('/:id/members', validate(validateAddMember), projectController.addMember);
router.delete('/:id/members/:userId', projectController.removeMember);

// Boards
router.post(
  '/:projectId/boards',
  validate(validateCreateBoard),
  boardController.createBoard
);

router.get(
  '/:projectId/boards',
  boardController.getBoardsByProject
);

module.exports = router;