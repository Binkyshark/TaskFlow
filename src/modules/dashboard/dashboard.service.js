const { Project } = require('../projects/project.model');
const Board = require('../boards/board.model');
const List = require('../lists/list.model');
const { Task } = require('../tasks/task.model');
const { Comment } = require('../comments/comment.model');
const { Attachment } = require('../attachments/attachment.model');
const { Notification } = require('../notifications/notification.model');
const { Activity } = require('../activities/activity.model');

const {
  DASHBOARD_LIMITS,
  DASHBOARD_DEFAULTS,
  ACTIVITY_SORT_OPTIONS
} = require('./dashboard.constants');

/*
|--------------------------------------------------------------------------
| Priority weight map for sorting (higher = more urgent)
|--------------------------------------------------------------------------
*/

const PRIORITY_WEIGHT = Object.freeze({
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1
});

class DashboardService {
  /*
  |--------------------------------------------------------------------------
  | Public Methods
  |--------------------------------------------------------------------------
  */

  /**
   * Get full dashboard payload for the authenticated user
   * @param {String|ObjectId} userId
   * @returns {Promise<Object>}
   */
  async getDashboard(userId) {
    // Resolve workspace scope once and share across all sections
    const scope = await this._resolveWorkspaceScope(userId);

    const [overview, recentActivities, myTasks, dueSoon] =
      await Promise.all([
        this._getOverviewWithScope(userId, scope),
        this._getRecentActivitiesWithScope(userId, scope),
        this.getMyTasks(userId),
        this.getDueSoon(userId)
      ]);

    return {
      overview,
      recentActivities,
      myTasks,
      dueSoon
    };
  }

  /**
   * Get aggregated statistics for the authenticated user
   * @param {String|ObjectId} userId
   * @returns {Promise<Object>}
   */
  async getOverview(userId) {
    const scope = await this._resolveWorkspaceScope(userId);
    return this._getOverviewWithScope(userId, scope);
  }

  /**
   * Get recent activity entries for the authenticated user
   * @param {String|ObjectId} userId
   * @returns {Promise<Array>}
   */
  async getRecentActivities(userId) {
    const scope = await this._resolveWorkspaceScope(userId);
    return this._getRecentActivitiesWithScope(userId, scope);
  }

  /**
   * Get tasks assigned to the authenticated user
   * @param {String|ObjectId} userId
   * @returns {Promise<Array>}
   */
  async getMyTasks(userId) {
    const tasks = await Task.find({
      assignees: userId,
      isArchived: false
    })
      .select('title description priority dueDate list labels position isCompleted createdAt')
      .populate('list', 'title')
      .sort({
        dueDate: 1,
        priority: 1
      })
      .limit(DASHBOARD_LIMITS.MY_TASKS_LIMIT)
      .lean();

    // Re-sort in memory: dueDate ASC (nulls last), priority DESC
    return tasks.sort((a, b) => {
      // dueDate ASC — nulls pushed to end
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;

      if (dateA !== dateB) return dateA - dateB;

      // priority DESC — higher weight first
      const weightA = PRIORITY_WEIGHT[a.priority] || 0;
      const weightB = PRIORITY_WEIGHT[b.priority] || 0;

      return weightB - weightA;
    });
  }

  /**
   * Get tasks due within the configured window for the authenticated user
   * @param {String|ObjectId} userId
   * @returns {Promise<Array>}
   */
  async getDueSoon(userId) {
    const now = new Date();
    const dueSoonDate = new Date(now);
    dueSoonDate.setDate(
      dueSoonDate.getDate() + DASHBOARD_DEFAULTS.DEFAULT_DUE_SOON_DAYS
    );

    return Task.find({
      assignees: userId,
      isArchived: false,
      isCompleted: { $ne: true },
      dueDate: {
        $gte: now,
        $lte: dueSoonDate
      }
    })
      .select('title priority dueDate list labels')
      .populate('list', 'title')
      .sort({ dueDate: 1 })
      .limit(DASHBOARD_LIMITS.DUE_SOON_LIMIT)
      .lean();
  }

  /*
  |--------------------------------------------------------------------------
  | Scoped Internal Methods
  |--------------------------------------------------------------------------
  */

  /**
   * Get overview statistics using pre-resolved workspace scope
   * @param {String|ObjectId} userId
   * @param {Object} scope - { projectIds, boardIds, listIds }
   * @returns {Promise<Object>}
   */
  async _getOverviewWithScope(userId, scope) {
    const { projectIds, boardIds, listIds } = scope;

    // Resolve task IDs for comment/attachment workspace counts
    const taskIds = await this._getListTaskIds(listIds);

    const [
      projectsCount,
      boardsCount,
      listsCount,
      tasksCount,
      completedTasks,
      pendingTasks,
      overdueTasks,
      commentsCount,
      attachmentsCount,
      notificationsCount,
      unreadNotifications
    ] = await Promise.all([
      // Projects the user belongs to
      projectIds.length,

      // Boards across user's projects
      boardIds.length,

      // Lists across user's boards
      listIds.length,

      // Total tasks in user's lists
      Task.countDocuments({
        list: { $in: listIds },
        isArchived: false
      }),

      // Completed tasks
      Task.countDocuments({
        list: { $in: listIds },
        isArchived: false,
        isCompleted: true
      }),

      // Pending tasks (not completed)
      Task.countDocuments({
        list: { $in: listIds },
        isArchived: false,
        isCompleted: { $ne: true }
      }),

      // Overdue tasks
      Task.countDocuments({
        list: { $in: listIds },
        isArchived: false,
        isCompleted: { $ne: true },
        dueDate: { $lt: new Date(), $ne: null }
      }),

      // Comments across the user's workspace
      Comment.countDocuments({
        task: { $in: taskIds },
        isDeleted: false
      }),

      // Attachments across the user's workspace
      Attachment.countDocuments({
        task: { $in: taskIds },
        isDeleted: false
      }),

      // Total notifications for user
      Notification.countDocuments({
        recipient: userId
      }),

      // Unread notifications
      Notification.countDocuments({
        recipient: userId,
        isRead: false
      })
    ]);

    return {
      projectsCount,
      boardsCount,
      listsCount,
      tasksCount,
      completedTasks,
      pendingTasks,
      overdueTasks,
      commentsCount,
      attachmentsCount,
      notificationsCount,
      unreadNotifications
    };
  }

  /**
   * Get recent activities scoped to user's accessible projects
   * @param {String|ObjectId} userId
   * @param {Object} scope - { projectIds, boardIds, listIds }
   * @returns {Promise<Array>}
   */
  async _getRecentActivitiesWithScope(userId, scope) {
    const { projectIds } = scope;

    return Activity.find({
      $or: [
        // Activities within accessible projects
        { project: { $in: projectIds } },
        // User-level activities with no project context (e.g. profile events)
        { user: userId, project: { $exists: false } },
        { user: userId, project: null },
        { targetUser: userId, project: { $exists: false } },
        { targetUser: userId, project: null }
      ]
    })
      .populate('user', 'name email avatar')
      .populate('project', 'name')
      .populate('board', 'title')
      .populate('task', 'title')
      .sort({ [ACTIVITY_SORT_OPTIONS.CREATED_AT]: -1 })
      .limit(DASHBOARD_LIMITS.RECENT_ACTIVITIES_LIMIT)
      .lean();
  }

  /*
  |--------------------------------------------------------------------------
  | Private Helpers
  |--------------------------------------------------------------------------
  */

  /**
   * Resolve the full workspace scope chain once
   * @param {String|ObjectId} userId
   * @returns {Promise<Object>} { projectIds, boardIds, listIds }
   */
  async _resolveWorkspaceScope(userId) {
    const projectIds = await this._getUserProjectIds(userId);
    const boardIds = await this._getProjectBoardIds(projectIds);
    const listIds = await this._getBoardListIds(boardIds);

    return { projectIds, boardIds, listIds };
  }

  /**
   * Get all project IDs accessible by a user
   * @param {String|ObjectId} userId
   * @returns {Promise<Array<ObjectId>>}
   */
  async _getUserProjectIds(userId) {
    const projects = await Project.find({
      $or: [{ owner: userId }, { 'members.user': userId }],
      isArchived: false
    })
      .select('_id')
      .lean();

    return projects.map(p => p._id);
  }

  /**
   * Get all board IDs belonging to given projects
   * @param {Array<ObjectId>} projectIds
   * @returns {Promise<Array<ObjectId>>}
   */
  async _getProjectBoardIds(projectIds) {
    if (!projectIds.length) return [];

    const boards = await Board.find({
      project: { $in: projectIds }
    })
      .select('_id')
      .lean();

    return boards.map(b => b._id);
  }

  /**
   * Get all list IDs belonging to given boards
   * @param {Array<ObjectId>} boardIds
   * @returns {Promise<Array<ObjectId>>}
   */
  async _getBoardListIds(boardIds) {
    if (!boardIds.length) return [];

    const lists = await List.find({
      board: { $in: boardIds },
      isArchived: false
    })
      .select('_id')
      .lean();

    return lists.map(l => l._id);
  }

  /**
   * Get all task IDs belonging to given lists
   * @param {Array<ObjectId>} listIds
   * @returns {Promise<Array<ObjectId>>}
   */
  async _getListTaskIds(listIds) {
    if (!listIds.length) return [];

    const tasks = await Task.find({
      list: { $in: listIds },
      isArchived: false
    })
      .select('_id')
      .lean();

    return tasks.map(t => t._id);
  }
}

module.exports = new DashboardService();
