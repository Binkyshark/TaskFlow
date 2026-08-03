const mongoose = require('mongoose');

const {
  Activity,
  ACTIVITY_ACTIONS,
  ENTITY_TYPES,
  ACTIVITY_SEVERITY
} = require('./activity.model');

const { getPagination, getPagingData } = require('../../utils/pagination');

const ACTIVITY_POPULATE = [
  {
    path: 'user',
    select: 'name email avatar'
  },
  {
    path: 'targetUser',
    select: 'name email avatar'
  },
  {
    path: 'project',
    select: 'name'
  },
  {
    path: 'board',
    select: 'title'
  },
  {
    path: 'list',
    select: 'title'
  },
  {
    path: 'task',
    select: 'title'
  },
  {
    path: 'comment',
    select: 'content'
  },
  {
    path: 'attachment',
    select: 'originalName'
  }
];

class ActivityService {
  /*
  |--------------------------------------------------------------------------
  | Generic Logger
  |--------------------------------------------------------------------------
  */

  /**
   * Log a new activity entry
   * @param {String|ObjectId} userId 
   * @param {Object} data 
   * @returns {Promise<Object>}
   */
  async logActivity(userId, data) {
    this.validateObjectId(userId, 'Invalid user ID');

    const activity = await Activity.create({
      user: userId,
      targetUser: data.targetUser,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      project: data.project,
      board: data.board,
      list: data.list,
      task: data.task,
      comment: data.comment,
      attachment: data.attachment,
      description: data.description,
      metadata: data.metadata || {},
      severity: data.severity || ACTIVITY_SEVERITY.INFO
    });

    return activity.populate(ACTIVITY_POPULATE);
  }

  /*
  |--------------------------------------------------------------------------
  | Retrieval
  |--------------------------------------------------------------------------
  */

  /**
   * Get activity details by ID
   * @param {String|ObjectId} activityId 
   * @param {String|ObjectId} userId 
   * @returns {Promise<Object>}
   */
  async getActivityById(activityId, userId) {
    this.validateObjectId(activityId, 'Invalid activity ID');

    const activity = await Activity.findById(activityId).populate(
      ACTIVITY_POPULATE
    );

    if (!activity) {
      const error = new Error('Activity not found');
      error.statusCode = 404;
      throw error;
    }

    // Centralized access authorization with lazy-loaded services
    if (activity.project) {
      const projectService = require('../projects/project.service');
      await projectService.getProjectById(
        this.getId(activity.project),
        userId
      );
    } else if (activity.board) {
      const boardService = require('../boards/board.service');
      await boardService.getBoardById(
        this.getId(activity.board),
        userId
      );
    } else if (activity.task) {
      const taskService = require('../tasks/task.service');
      await taskService.getTaskById(
        this.getId(activity.task),
        userId
      );
    } else if (
      activity.user &&
      this.getId(activity.user).toString() !== userId.toString()
    ) {
      const error = new Error('Not authorized to access this activity');
      error.statusCode = 403;
      throw error;
    }

    return activity;
  }

  /**
   * Get activities related to a specific user
   * @param {String|ObjectId} userId 
   * @param {Object} query 
   * @returns {Promise<Object>}
   */
  async getUserActivities(userId, query = {}) {
    this.validateObjectId(userId, 'Invalid user ID');

    const filter = this.buildFilter(
      {
        $or: [{ user: userId }, { targetUser: userId }]
      },
      query
    );

    return this.findPaginatedActivities(filter, query);
  }

  /**
   * Get activities for a specific project
   * @param {String|ObjectId} projectId 
   * @param {String|ObjectId} userId 
   * @param {Object} query 
   * @returns {Promise<Object>}
   */
  async getProjectActivities(projectId, userId, query = {}) {
    const projectService = require('../projects/project.service');
    await projectService.getProjectById(projectId, userId);

    const filter = this.buildFilter({ project: projectId }, query);

    return this.findPaginatedActivities(filter, query);
  }

  /**
   * Get activities for a specific board
   * @param {String|ObjectId} boardId 
   * @param {String|ObjectId} userId 
   * @param {Object} query 
   * @returns {Promise<Object>}
   */
  async getBoardActivities(boardId, userId, query = {}) {
    const boardService = require('../boards/board.service');
    await boardService.getBoardById(boardId, userId);

    const filter = this.buildFilter({ board: boardId }, query);

    return this.findPaginatedActivities(filter, query);
  }

  /**
   * Get activities for a specific task
   * @param {String|ObjectId} taskId 
   * @param {String|ObjectId} userId 
   * @param {Object} query 
   * @returns {Promise<Object>}
   */
  async getTaskActivities(taskId, userId, query = {}) {
    const taskService = require('../tasks/task.service');
    await taskService.getTaskById(taskId, userId);

    const filter = this.buildFilter({ task: taskId }, query);

    return this.findPaginatedActivities(filter, query);
  }

  /*
  |--------------------------------------------------------------------------
  | Helper Methods
  |--------------------------------------------------------------------------
  */

  /**
   * Log project created
   */
  async logProjectCreated(userId, project) {
    return this.logActivity(userId, {
      action: ACTIVITY_ACTIONS.PROJECT_CREATED,
      entityType: ENTITY_TYPES.PROJECT,
      entityId: this.getId(project),
      project: this.getId(project),
      description: `Project "${project.name || 'Untitled'}" was created`,
      severity: ACTIVITY_SEVERITY.INFO
    });
  }

  /**
   * Log project updated
   */
  async logProjectUpdated(userId, project, metadata = {}) {
    return this.logActivity(userId, {
      action: ACTIVITY_ACTIONS.PROJECT_UPDATED,
      entityType: ENTITY_TYPES.PROJECT,
      entityId: this.getId(project),
      project: this.getId(project),
      description: `Project "${project.name || 'Untitled'}" was updated`,
      metadata,
      severity: ACTIVITY_SEVERITY.INFO
    });
  }

  /**
   * Log project archived
   */
  async logProjectArchived(userId, project) {
    return this.logActivity(userId, {
      action: ACTIVITY_ACTIONS.PROJECT_ARCHIVED,
      entityType: ENTITY_TYPES.PROJECT,
      entityId: this.getId(project),
      project: this.getId(project),
      description: `Project "${project.name || 'Untitled'}" was archived`,
      severity: ACTIVITY_SEVERITY.WARNING
    });
  }

  /**
   * Log board created
   */
  async logBoardCreated(userId, board) {
    return this.logActivity(userId, {
      action: ACTIVITY_ACTIONS.BOARD_CREATED,
      entityType: ENTITY_TYPES.BOARD,
      entityId: this.getId(board),
      project: this.getId(board.project),
      board: this.getId(board),
      description: `Board "${board.title || 'Untitled'}" was created`,
      severity: ACTIVITY_SEVERITY.INFO
    });
  }

  /**
   * Log board updated
   */
  async logBoardUpdated(userId, board, metadata = {}) {
    return this.logActivity(userId, {
      action: ACTIVITY_ACTIONS.BOARD_UPDATED,
      entityType: ENTITY_TYPES.BOARD,
      entityId: this.getId(board),
      project: this.getId(board.project),
      board: this.getId(board),
      description: `Board "${board.title || 'Untitled'}" was updated`,
      metadata,
      severity: ACTIVITY_SEVERITY.INFO
    });
  }

  /**
   * Log list created
   */
  async logListCreated(userId, list) {
    return this.logActivity(userId, {
      action: ACTIVITY_ACTIONS.LIST_CREATED,
      entityType: ENTITY_TYPES.LIST,
      entityId: this.getId(list),
      board: this.getId(list.board),
      list: this.getId(list),
      description: `List "${list.title || 'Untitled'}" was created`,
      severity: ACTIVITY_SEVERITY.INFO
    });
  }

  /**
   * Log list updated
   */
  async logListUpdated(userId, list, metadata = {}) {
    return this.logActivity(userId, {
      action: ACTIVITY_ACTIONS.LIST_UPDATED,
      entityType: ENTITY_TYPES.LIST,
      entityId: this.getId(list),
      board: this.getId(list.board),
      list: this.getId(list),
      description: `List "${list.title || 'Untitled'}" was updated`,
      metadata,
      severity: ACTIVITY_SEVERITY.INFO
    });
  }

  /**
   * Log task created
   */
  async logTaskCreated(userId, task) {
    return this.logActivity(userId, {
      action: ACTIVITY_ACTIONS.TASK_CREATED,
      entityType: ENTITY_TYPES.TASK,
      entityId: this.getId(task),
      project: this.getId(task.project),
      board: this.getId(task.board),
      list: this.getId(task.list),
      task: this.getId(task),
      description: `Task "${task.title || 'Untitled'}" was created`,
      severity: ACTIVITY_SEVERITY.INFO
    });
  }

  /**
   * Log task updated
   */
  async logTaskUpdated(userId, task, metadata = {}) {
    return this.logActivity(userId, {
      action: ACTIVITY_ACTIONS.TASK_UPDATED,
      entityType: ENTITY_TYPES.TASK,
      entityId: this.getId(task),
      project: this.getId(task.project),
      board: this.getId(task.board),
      list: this.getId(task.list),
      task: this.getId(task),
      description: `Task "${task.title || 'Untitled'}" was updated`,
      metadata,
      severity: ACTIVITY_SEVERITY.INFO
    });
  }

  /**
   * Log task moved
   */
  async logTaskMoved(userId, task, fromList, toList) {
    const toListTitle = toList?.title || 'another list';
    return this.logActivity(userId, {
      action: ACTIVITY_ACTIONS.TASK_MOVED,
      entityType: ENTITY_TYPES.TASK,
      entityId: this.getId(task),
      project: this.getId(task.project),
      board: this.getId(task.board),
      list: this.getId(toList),
      task: this.getId(task),
      description: `Task "${task.title || 'Untitled'}" was moved to list "${toListTitle}"`,
      metadata: {
        fromList: this.getId(fromList),
        toList: this.getId(toList)
      },
      severity: ACTIVITY_SEVERITY.INFO
    });
  }

  /**
   * Log task assigned
   */
  async logTaskAssigned(userId, task, targetUser) {
    return this.logActivity(userId, {
      action: ACTIVITY_ACTIONS.TASK_ASSIGNED,
      entityType: ENTITY_TYPES.TASK,
      entityId: this.getId(task),
      targetUser: this.getId(targetUser),
      project: this.getId(task.project),
      board: this.getId(task.board),
      list: this.getId(task.list),
      task: this.getId(task),
      description: `Task "${task.title || 'Untitled'}" was assigned`,
      severity: ACTIVITY_SEVERITY.INFO
    });
  }

  /**
   * Log task completed
   */
  async logTaskCompleted(userId, task) {
    return this.logActivity(userId, {
      action: ACTIVITY_ACTIONS.TASK_COMPLETED,
      entityType: ENTITY_TYPES.TASK,
      entityId: this.getId(task),
      project: this.getId(task.project),
      board: this.getId(task.board),
      list: this.getId(task.list),
      task: this.getId(task),
      description: `Task "${task.title || 'Untitled'}" was completed`,
      severity: ACTIVITY_SEVERITY.INFO
    });
  }

  /**
   * Log comment added
   */
  async logCommentAdded(userId, comment, task) {
    return this.logActivity(userId, {
      action: ACTIVITY_ACTIONS.COMMENT_ADDED,
      entityType: ENTITY_TYPES.COMMENT,
      entityId: this.getId(comment),
      project: this.getId(task?.project),
      board: this.getId(task?.board),
      list: this.getId(task?.list),
      task: this.getId(task),
      comment: this.getId(comment),
      description: `Comment added to task "${task?.title || 'Untitled'}"`,
      severity: ACTIVITY_SEVERITY.INFO
    });
  }

  /**
   * Log attachment uploaded
   */
  async logAttachmentUploaded(userId, attachment, task) {
    const fileName =
      attachment?.originalName || attachment?.fileName || 'file';
    return this.logActivity(userId, {
      action: ACTIVITY_ACTIONS.ATTACHMENT_UPLOADED,
      entityType: ENTITY_TYPES.ATTACHMENT,
      entityId: this.getId(attachment),
      project: this.getId(task?.project),
      board: this.getId(task?.board),
      list: this.getId(task?.list),
      task: this.getId(task),
      attachment: this.getId(attachment),
      description: `Attachment "${fileName}" uploaded to task "${task?.title || 'Untitled'}"`,
      severity: ACTIVITY_SEVERITY.INFO
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Utility Methods
  |--------------------------------------------------------------------------
  */

  /**
   * Validate MongoDB ObjectId
   * @param {String|ObjectId} id 
   * @param {String} message 
   */
  validateObjectId(id, message = 'Invalid ID') {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error(message);
      error.statusCode = 400;
      throw error;
    }
  }

  /**
   * Helper to safely extract ObjectId or String ID
   * @param {Object|String|ObjectId} item 
   * @returns {ObjectId|String|undefined}
   */
  getId(item) {
    if (!item) return undefined;
    return item._id ? item._id : item;
  }

  /**
   * Escape special characters for MongoDB regex search
   * @param {String} string 
   * @returns {String}
   */
  escapeRegex(string) {
    if (typeof string !== 'string') return '';
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Build activity query filter object
   * @param {Object} baseFilter 
   * @param {Object} query 
   * @returns {Object}
   */
  buildFilter(baseFilter = {}, query = {}) {
    const filter = { ...baseFilter };

    if (query.action) {
      filter.action = query.action;
    }

    if (query.entityType) {
      filter.entityType = query.entityType;
    }

    if (query.severity) {
      filter.severity = query.severity;
    }

    if (query.search) {
      filter.description = {
        $regex: this.escapeRegex(query.search),
        $options: 'i'
      };
    }

    return filter;
  }

  /**
   * Execute paginated activity query
   * @param {Object} filter 
   * @param {Object} query 
   * @returns {Promise<Object>}
   */
  async findPaginatedActivities(filter, query) {
    const pagination = getPagination(query);
    const limit = Math.min(pagination.limit, 100);
    const page = pagination.page;
    const skip = (page - 1) * limit;

    const [activities, total] = await Promise.all([
      Activity.find(filter)
        .populate(ACTIVITY_POPULATE)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Activity.countDocuments(filter)
    ]);

    return {
      activities,
      meta: getPagingData(total, page, limit)
    };
  }
}

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = new ActivityService();
