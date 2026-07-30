const listService = require('./list.service');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/response');

class ListController {
  createList = catchAsync(async (req, res) => {
    const list = await listService.createList(
      req.params.boardId,
      req.user.id,
      req.body
    );
    return sendResponse(res, {
      statusCode: 201,
      message: 'List created successfully',
      data: { list }
    });
  });

  getListsByBoard = catchAsync(async (req, res) => {
    const lists = await listService.getListsByBoard(
      req.params.boardId,
      req.user.id
    );
    return sendResponse(res, {
      statusCode: 200,
      message: 'Lists retrieved successfully',
      data: { lists }
    });
  });

  getListById = catchAsync(async (req, res) => {
    const list = await listService.getListById(req.params.id, req.user.id);
    return sendResponse(res, {
      statusCode: 200,
      message: 'List retrieved successfully',
      data: { list }
    });
  });

  updateList = catchAsync(async (req, res) => {
    const list = await listService.updateList(req.params.id, req.user.id, req.body);
    return sendResponse(res, {
      statusCode: 200,
      message: 'List updated successfully',
      data: { list }
    });
  });

  deleteList = catchAsync(async (req, res) => {
    const result = await listService.deleteList(req.params.id, req.user.id);
    return sendResponse(res, {
      statusCode: 200,
      message: result.message
    });
  });
}

module.exports = new ListController();
