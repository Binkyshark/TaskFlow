const taskService = require('./task.service');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/response');

class TaskController {
  createTask = catchAsync(async (req, res) => {
    const task = await taskService.createTask(
      req.params.listId,
      req.user.id,
      req.body
    );

    return sendResponse(res, {
      statusCode: 201,
      message: 'Task created successfully',
      data: { task }
    });
  });

  getTasks = catchAsync(async (req, res) => {
    const { tasks, meta } = await taskService.getTasks(
      req.params.listId,
      req.user.id,
      req.query
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Tasks retrieved successfully',
      data: { tasks },
      meta
    });
  });

  getTaskById = catchAsync(async (req, res) => {
    const task = await taskService.getTaskById(
      req.params.id,
      req.user.id
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Task retrieved successfully',
      data: { task }
    });
  });

  updateTask = catchAsync(async (req, res) => {
    const task = await taskService.updateTask(
      req.params.id,
      req.user.id,
      req.body
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Task updated successfully',
      data: { task }
    });
  });

  deleteTask = catchAsync(async (req, res) => {
    const result = await taskService.deleteTask(
      req.params.id,
      req.user.id
    );

    return sendResponse(res, {
      statusCode: 200,
      message: result.message
    });
  });
}

module.exports = new TaskController();
