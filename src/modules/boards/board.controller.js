
const boardService = require('./board.service');
const catchAsync = require('../../utils/catchAsync');
const { sendResponse } = require('../../utils/response');

class BoardController {
  createBoard = catchAsync(async (req, res) => {
    const board = await boardService.createBoard(
      req.params.projectId,
      req.user.id,
      req.body
    );

    return sendResponse(res, {
      statusCode: 201,
      message: 'Board created successfully',
      data: { board }
    });
  });

  getBoardsByProject = catchAsync(async (req, res) => {
    const boards = await boardService.getBoardsByProject(
      req.params.projectId,
      req.user.id
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Boards retrieved successfully',
      data: { boards }
    });
  });

  getBoardById = catchAsync(async (req, res) => {
    const board = await boardService.getBoardById(
      req.params.boardId,
      req.user.id
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Board retrieved successfully',
      data: { board }
    });
  });

  updateBoard = catchAsync(async (req, res) => {
    const board = await boardService.updateBoard(
      req.params.boardId,
      req.user.id,
      req.body
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Board updated successfully',
      data: { board }
    });
  });

  deleteBoard = catchAsync(async (req, res) => {
    await boardService.deleteBoard(
      req.params.boardId,
      req.user.id
    );

    return sendResponse(res, {
      statusCode: 200,
      message: 'Board deleted successfully'
    });
  });
}

module.exports = new BoardController();