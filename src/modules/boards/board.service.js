const Board = require('./board.model');
const projectService = require('../projects/project.service');

class BoardService {
  /**
   * Create a new board in a project
   */
  async createBoard(userId, data) {
    const { title, projectId, description } = data;

    // Verify user access to the project
    await projectService.getProjectById(projectId, userId);

    const board = await Board.create({
      title,
      description,
      project: projectId,
      createdBy: userId
    });

    return board.populate([
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'project', select: 'name' }
    ]);
  }

  /**
   * Get all boards for a specific project
   */
  async getBoardsByProject(projectId, userId) {
    // Verify user access to the project
    await projectService.getProjectById(projectId, userId);

    return Board.find({ project: projectId })
      .populate('createdBy', 'name email avatar')
      .sort({ position: 1, createdAt: 1 });
  }

  /**
   * Get single board details
   */
  async getBoardById(boardId, userId) {
    const board = await Board.findById(boardId)
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name owner members');

    if (!board) {
      const error = new Error('Board not found');
      error.statusCode = 404;
      throw error;
    }

    // Check user access to the project associated with this board
    await projectService.getProjectById(board.project._id, userId);

    return board;
  }

  /**
   * Update board
   */
  async updateBoard(boardId, userId, updateData) {
    const board = await this.getBoardById(boardId, userId);

    Object.assign(board, updateData);
    await board.save();
    return board;
  }

  /**
   * Delete board
   */
  async deleteBoard(boardId, userId) {
    const board = await this.getBoardById(boardId, userId);

    await Board.findByIdAndDelete(board._id);
    return { message: 'Board deleted successfully' };
  }
}

module.exports = new BoardService();
