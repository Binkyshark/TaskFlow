const Task = require('./task.model');
const listService = require('../lists/list.service');
const boardService = require('../boards/board.service');
const { getPagination, getPagingData } = require('../../utils/pagination');

class TaskService {
  /**
   * Create a task inside a list
   */
  async createTask(userId, data) {
    const { title, listId, description, priority, assignees, dueDate, position } = data;

    // Verify parent list exists and user has board/project access
    const list = await listService.getListById(listId, userId);

    let taskPosition = position;
    if (taskPosition === undefined || taskPosition === 0) {
      const count = await Task.countDocuments({ list: listId });
      taskPosition = count;
    }

    const task = await Task.create({
      title,
      description,
      list: listId,
      board: list.board,
      project: (await boardService.getBoardById(list.board, userId)).project._id,
      assignees,
      createdBy: userId,
      priority,
      dueDate,
      position: taskPosition
    });

    return task.populate([
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'assignees', select: 'name email avatar' }
    ]);
  }

  /**
   * Get tasks with filtering (by list, board, project, or assignee)
   */
  async getTasks(userId, query) {
    const { page, limit, skip } = getPagination(query);
    const filter = {};

    if (query.listId) filter.list = query.listId;
    if (query.boardId) filter.board = query.boardId;
    if (query.projectId) filter.project = query.projectId;
    if (query.assigneeId) filter.assignees = query.assigneeId;
    if (query.priority) filter.priority = query.priority;
    if (query.isCompleted !== undefined) filter.isCompleted = query.isCompleted === 'true';

    if (query.search) {
      filter.$or = [
        { title: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } }
      ];
    }

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('createdBy', 'name email avatar')
        .populate('assignees', 'name email avatar')
        .populate('list', 'title')
        .skip(skip)
        .limit(limit)
        .sort({ position: 1, createdAt: -1 }),
      Task.countDocuments(filter)
    ]);

    const meta = getPagingData(total, page, limit);
    return { tasks, meta };
  }

  /**
   * Get single task details
   */
  async getTaskById(taskId, userId) {
    const task = await Task.findById(taskId)
      .populate('createdBy', 'name email avatar')
      .populate('assignees', 'name email avatar')
      .populate('list', 'title board');

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    await boardService.getBoardById(task.board, userId);

    return task;
  }

  /**
   * Update task details or move list/position
   */
  async updateTask(taskId, userId, updateData) {
    const task = await this.getTaskById(taskId, userId);

    if (updateData.listId) {
      const newList = await listService.getListById(updateData.listId, userId);
      task.list = newList._id;
      task.board = newList.board;
    }

    delete updateData.listId;
    Object.assign(task, updateData);

    await task.save();
    return task.populate([
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'assignees', select: 'name email avatar' },
      { path: 'list', select: 'title' }
    ]);
  }

  /**
   * Delete task
   */
  async deleteTask(taskId, userId) {
    const task = await this.getTaskById(taskId, userId);

    await Task.findByIdAndDelete(task._id);
    return { message: 'Task deleted successfully' };
  }
}

module.exports = new TaskService();
