const List = require('./list.model');
const boardService = require('../boards/board.service');

class ListService {
  /**
   * Create a new list in a board
   */
  async createList(userId, data) {
    const { title, boardId, position } = data;

    // Verify user access to the board
    await boardService.getBoardById(boardId, userId);

    // Calculate position if not provided
    let listPosition = position;
    if (listPosition === undefined || listPosition === 0) {
      const count = await List.countDocuments({ board: boardId });
      listPosition = count;
    }

    const list = await List.create({
      title,
      board: boardId,
      position: listPosition
    });

    return list;
  }

  /**
   * Get all lists for a board
   */
  async getListsByBoard(boardId, userId) {
    // Verify user access to the board
    await boardService.getBoardById(boardId, userId);

    return List.find({ board: boardId }).sort({ position: 1, createdAt: 1 });
  }

  /**
   * Get list by ID
   */
  async getListById(listId, userId) {
    const list = await List.findById(listId);
    if (!list) {
      const error = new Error('List not found');
      error.statusCode = 404;
      throw error;
    }

    await boardService.getBoardById(list.board, userId);

    return list;
  }

  /**
   * Update list
   */
  async updateList(listId, userId, updateData) {
    const list = await this.getListById(listId, userId);

    Object.assign(list, updateData);
    await list.save();
    return list;
  }

  /**
   * Delete list
   */
  async deleteList(listId, userId) {
    const list = await this.getListById(listId, userId);

    await List.findByIdAndDelete(list._id);
    return { message: 'List deleted successfully' };
  }
}

module.exports = new ListService();
