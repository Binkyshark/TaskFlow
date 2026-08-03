const Board = require('./board.model');
const projectService = require('../projects/project.service');
const activityService = require('../activities/activity.service');

const BOARD_POPULATE = [
  {
    path: 'createdBy',
    select: 'fullName email'
  },
  {
    path: 'project',
    select: 'name'
  }
];

class BoardService {
  /**
   * Create a new board
   */
  async createBoard(projectId, userId, data) {
    const { title, description } = data;

    // Verify user access to the project
    await projectService.getProjectById(projectId, userId);

    // Prevent duplicate board titles in the same project
    const existingBoard = await Board.findOne({
      project: projectId,
      title
    });

    if (existingBoard) {
      const error = new Error('Board title already exists');
      error.statusCode = 409;
      throw error;
    }

    // Get next board position
    const lastBoard = await Board.findOne({
      project: projectId
    }).sort({ position: -1 });

    const position = lastBoard ? lastBoard.position + 1 : 0;

    const board = await Board.create({
      title,
      description,
      project: projectId,
      createdBy: userId,
      position
    });

    const populatedBoard = await board.populate(BOARD_POPULATE);

    await activityService.logBoardCreated(
      userId,
      populatedBoard
    );

    return populatedBoard;
  }

  /**
   * Get all boards for a project
   */
  async getBoardsByProject(projectId, userId) {
    // Verify user access
    await projectService.getProjectById(projectId, userId);

    return Board.find({
      project: projectId
    })
      .populate(BOARD_POPULATE)
      .sort({
        position: 1,
        createdAt: 1
      });
  }

  /**
   * Get board by id
   */
  async getBoardById(boardId, userId) {
    const board = await Board.findById(boardId)
      .populate([
        ...BOARD_POPULATE,
        {
          path: 'project',
          select: 'name owner members'
        }
      ]);

    if (!board) {
      const error = new Error('Board not found');
      error.statusCode = 404;
      throw error;
    }

    // Verify user access to the project
    await projectService.getProjectById(board.project.id, userId);

    return board;
  }

  /**
   * Update board
   */
  async updateBoard(boardId, userId, updateData) {
    const board = await this.getBoardById(boardId, userId);

    if (updateData.title !== undefined) {
      board.title = updateData.title;
    }

    if (updateData.description !== undefined) {
      board.description = updateData.description;
    }

    if (updateData.position !== undefined) {
      board.position = updateData.position;
    }

    if (updateData.isArchived !== undefined) {
      board.isArchived = updateData.isArchived;
    }

    await board.save();

    await activityService.logBoardUpdated(
      userId,
      board,
      updateData
    );

    return board.populate(BOARD_POPULATE);
  }

  /**
   * Delete board
   */
  async deleteBoard(boardId, userId) {
    const board = await this.getBoardById(boardId, userId);

    await board.deleteOne();
  }
}

module.exports = new BoardService();