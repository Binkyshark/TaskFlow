const projectService = require('./project.service');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/response');

class ProjectController {
  createProject = catchAsync(async (req, res) => {
    const project = await projectService.createProject(req.user.id, req.body);
    return sendResponse(res, {
      statusCode: 201,
      message: 'Project created successfully',
      data: { project }
    });
  });

  getProjects = catchAsync(async (req, res) => {
    const { projects, meta } = await projectService.getProjectsForUser(req.user.id, req.query);
    return sendResponse(res, {
      statusCode: 200,
      message: 'Projects retrieved successfully',
      data: { projects },
      meta
    });
  });

  getProjectById = catchAsync(async (req, res) => {
    const project = await projectService.getProjectById(req.params.id, req.user.id);
    return sendResponse(res, {
      statusCode: 200,
      message: 'Project retrieved successfully',
      data: { project }
    });
  });

  updateProject = catchAsync(async (req, res) => {
    const project = await projectService.updateProject(req.params.id, req.user.id, req.body);
    return sendResponse(res, {
      statusCode: 200,
      message: 'Project updated successfully',
      data: { project }
    });
  });

  deleteProject = catchAsync(async (req, res) => {
    const result = await projectService.deleteProject(req.params.id, req.user.id);
    return sendResponse(res, {
      statusCode: 200,
      message: result.message
    });
  });

  addMember = catchAsync(async (req, res) => {
    const { userId, role } = req.body;
    const project = await projectService.addMember(req.params.id, req.user.id, userId, role);
    return sendResponse(res, {
      statusCode: 200,
      message: 'Member added successfully',
      data: { project }
    });
  });

  removeMember = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const project = await projectService.removeMember(req.params.id, req.user.id, userId);
    return sendResponse(res, {
      statusCode: 200,
      message: 'Member removed successfully',
      data: { project }
    });
  });
}

module.exports = new ProjectController();
