const mongoose = require('mongoose');
const { Task } = require('./task.model');
const listService = require('../lists/list.service');
const { getPagination, getPagingData } = require('../../utils/pagination');
const activityService = require('../activities/activity.service');

const TASK_POPULATE = [
  {
    path: 'createdBy',
    select: 'name email avatar'
  },
  {
    path: 'assignees',
    select: 'name email avatar'
  },
  {
    path: 'list',
    select: 'title'
  }
];

class TaskService {
  /**
   * Create Task
   */
  async createTask(listId, userId, data) {
    const {
      title,
      description,
      priority,
      assignees,
      dueDate,
      labels,
      position
    } = data;

    // Verify access to list
    await listService.getListById(listId, userId);

    const exists = await Task.findOne({
      list: listId,
      title
    });

    if (exists) {
      const error = new Error('Task title already exists');
      error.statusCode = 409;
      throw error;
    }

    let taskPosition = position;

    if (taskPosition === undefined) {
      taskPosition = await Task.countDocuments({
        list: listId
      });
    }

    const task = await Task.create({
      title,
      description,
      list: listId,
      createdBy: userId,
      assignees,
      priority,
      labels,
      dueDate,
      position: taskPosition
    });

    const populatedTask = await task.populate(TASK_POPULATE);

    await activityService.logTaskCreated(
      userId,
      populatedTask
    );

    return populatedTask;
  }

  /**
   * Get Tasks By List
   */
  async getTasks(listId, userId, query) {
    await listService.getListById(listId, userId);

    const { page, limit, skip } = getPagination(query);

    const filter = {
      list: listId
    };

    if (query.priority) {
      filter.priority = query.priority;
    }

    if (query.assigneeId) {
      filter.assignees = query.assigneeId;
    }

    if (query.isArchived !== undefined) {
      filter.isArchived = query.isArchived === 'true';
    }

    if (query.search) {
      filter.$or = [
        {
          title: {
            $regex: query.search,
            $options: 'i'
          }
        },
        {
          description: {
            $regex: query.search,
            $options: 'i'
          }
        }
      ];
    }

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate(TASK_POPULATE)
        .skip(skip)
        .limit(limit)
        .sort({
          position: 1,
          createdAt: -1
        }),
      Task.countDocuments(filter)
    ]);

    return {
      tasks,
      meta: getPagingData(total, page, limit)
    };
  }

  /**
   * Get Task By Id
   */
  async getTaskById(taskId, userId) {
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      const error = new Error('Invalid task ID');
      error.statusCode = 400;
      throw error;
    }

    const task = await Task.findById(taskId).populate(TASK_POPULATE);

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    await listService.getListById(task.list._id, userId);

    return task;
  }

  /**
   * Update Task
   */
  async updateTask(taskId, userId, updateData) {
    const task = await this.getTaskById(taskId, userId);

    const previousList = task.list ? (task.list._id || task.list) : null;
    const previousState = {
      list: previousList,
      title: task.title,
      priority: task.priority,
      assignees: Array.isArray(task.assignees)
        ? task.assignees.map(a => (a._id || a || a.id).toString())
        : [],
      isCompleted: Boolean(task.isCompleted)
    };

    if (updateData.listId) {
      const newList = await listService.getListById(
        updateData.listId,
        userId
      );

      task.list = newList._id;
    }

    if (updateData.title !== undefined) {
      const duplicate = await Task.findOne({
        _id: { $ne: task._id },
        list: task.list,
        title: updateData.title
      });

      if (duplicate) {
        const error = new Error('Task title already exists');
        error.statusCode = 409;
        throw error;
      }

      task.title = updateData.title;
    }

    if (updateData.description !== undefined) {
      task.description = updateData.description;
    }

    if (updateData.priority !== undefined) {
      task.priority = updateData.priority;
    }

    if (updateData.assignees !== undefined) {
      task.assignees = updateData.assignees;
    }

    if (updateData.labels !== undefined) {
      task.labels = updateData.labels;
    }

    if (updateData.dueDate !== undefined) {
      task.dueDate = updateData.dueDate;
    }

    if (updateData.position !== undefined) {
      task.position = updateData.position;
    }

    if (updateData.isArchived !== undefined) {
      task.isArchived = updateData.isArchived;
    }

    if (updateData.isCompleted !== undefined) {
      task.isCompleted = updateData.isCompleted;
    }

    await task.save();

    await activityService.logTaskUpdated(
      userId,
      task,
      updateData,
      previousState
    );

    const currentListStr = task.list ? (task.list._id || task.list).toString() : null;
    const previousListStr = previousState.list ? (previousState.list._id || previousState.list).toString() : null;

    if (previousListStr && currentListStr && previousListStr !== currentListStr) {
      await activityService.logTaskMoved(
        userId,
        task,
        previousState.list,
        task.list
      );
    }

    if (updateData.assignees !== undefined) {
      const currentAssigneesStr = Array.isArray(task.assignees)
        ? task.assignees.map(a => (a._id || a || a.id).toString())
        : [];
      const assigneesChanged =
        previousState.assignees.length !== currentAssigneesStr.length ||
        previousState.assignees.some(id => !currentAssigneesStr.includes(id));

      if (assigneesChanged) {
        await activityService.logTaskAssigned(
          userId,
          task,
          task.assignees
        );
      }
    }

    if (!previousState.isCompleted && task.isCompleted === true) {
      await activityService.logTaskCompleted(
        userId,
        task
      );
    }

    return task.populate(TASK_POPULATE);
  }

  /**
   * Delete Task
   */
  async deleteTask(taskId, userId) {
    const task = await this.getTaskById(taskId, userId);

    await task.deleteOne();

    return {
      message: 'Task deleted successfully'
    };
  }
}

module.exports = new TaskService();
