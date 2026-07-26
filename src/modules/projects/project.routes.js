const express = require('express');
const projectController = require('./project.controller');
const { protect } = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validation.middleware');
const {
  validateCreateProject,
  validateUpdateProject,
  validateAddMember
} = require('./project.validation');

const router = express.Router();

router.use(protect);

router.post('/', validate(validateCreateProject), projectController.createProject);
router.get('/', projectController.getProjects);
router.get('/:id', projectController.getProjectById);
router.patch('/:id', validate(validateUpdateProject), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

router.post('/:id/members', validate(validateAddMember), projectController.addMember);
router.delete('/:id/members/:userId', projectController.removeMember);

module.exports = router;
