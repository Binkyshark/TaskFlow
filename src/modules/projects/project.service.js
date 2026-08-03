const { Project } = require('./project.model');
const { getPagination, getPagingData } = require('../../utils/pagination');
const { User } = require('../users/user.model');
const mongoose = require('mongoose');
const activityService = require('../activities/activity.service');

class ProjectService {
  /**
   * Create a new project
   */
  async createProject(userId, data) {
    const project = await Project.create({
      ...data,
      owner: userId,
      members: [{ user: userId, role: 'admin' }]
    });

    const populatedProject = await project.populate([
      { path: 'owner', select: 'name email avatar' },
      { path: 'members.user', select: 'name email avatar' }
    ]);

    await activityService.logProjectCreated(
      userId,
      populatedProject
    );

    return populatedProject;
  }

  /**
   * Get all projects accessible by user
   */
  async getProjectsForUser(userId, query) {
    const { page, limit, skip } = getPagination(query);
    const filter = {
      $or: [{ owner: userId }, { 'members.user': userId }]
    };

    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }

    if (query.isArchived !== undefined) {
      filter.isArchived = query.isArchived === 'true';
    }

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .populate('owner', 'name email avatar')
        .populate('members.user', 'name email avatar')
        .skip(skip)
        .limit(limit)
        .sort({ updatedAt: -1 }),
      Project.countDocuments(filter)
    ]);

    const meta = getPagingData(total, page, limit);
    return { projects, meta };
  }

  /**
   * Get project details by ID
   */
  async getProjectById(projectId, userId) {
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      const error = new Error('Invalid project ID');
      error.statusCode = 400;
      throw error;
    }

    const project = await Project.findById(projectId)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    // Check access
    const isMember =
      project.owner._id.toString() === userId.toString() ||
      project.members.some(
        m => m.user._id.toString() === userId.toString()
      );

    if (!isMember) {
      const error = new Error('Not authorized to access this project');
      error.statusCode = 403;
      throw error;
    }

    return project;
  }

  /**
   * Update project details
   */
  async updateProject(projectId, userId, updateData) {
    const project = await this.getProjectById(projectId, userId);

    // Check if owner or admin member
    const memberRole = project.members.find(m => m.user._id.toString() === userId.toString())?.role;
    if (project.owner._id.toString() !== userId.toString() && memberRole !== 'admin') {
      const error = new Error('Only project admins can modify project settings');
      error.statusCode = 403;
      throw error;
    }

    if (updateData.name !== undefined) {
      project.name = updateData.name;
    }

    if (updateData.description !== undefined) {
      project.description = updateData.description;
    }

    if (updateData.isArchived !== undefined) {
      project.isArchived = updateData.isArchived;
    }

    await project.save();

    await activityService.logProjectUpdated(
      userId,
      project,
      updateData
    );

    if (updateData.isArchived === true) {
      await activityService.logProjectArchived(
        userId,
        project
      );
    }

    return project;
  }

  /**
   * Delete project
   */
  async deleteProject(projectId, userId) {
    const project = await Project.findById(projectId);
    if (!project) {
      const error = new Error('Project not found');
      error.statusCode = 404;
      throw error;
    }

    if (project.owner.toString() !== userId.toString()) {
      const error = new Error('Only the project owner can delete this project');
      error.statusCode = 403;
      throw error;
    }

    await project.deleteOne();
    return { message: 'Project deleted successfully' };
  }

  /**
   * Add member to project
   */
  async addMember(projectId, userId, targetUserId, role = 'member') {
    const project = await this.getProjectById(projectId, userId);
    const memberRole = project.members.find(
      m => m.user._id.toString() === userId.toString()
    )?.role;

    if (
      project.owner._id.toString() !== userId.toString() &&
      memberRole !== 'admin'
    ) {
      const error = new Error('Only project admins can add members');
      error.statusCode = 403;
      throw error;
    }

    const user = await User.findById(targetUserId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    const isAlreadyMember = project.members.some(m => m.user._id.toString() === targetUserId.toString());
    if (isAlreadyMember) {
      const error = new Error('User is already a member of this project');
      error.statusCode = 400;
      throw error;
    }

    project.members.push({ user: targetUserId, role });
    await project.save();

    return project.populate([
      { path: 'owner', select: 'name email avatar' },
      { path: 'members.user', select: 'name email avatar' }
    ]);
  }

  /**
   * Remove member from project
   */
  async removeMember(projectId, userId, targetUserId) {
    const project = await this.getProjectById(projectId, userId);
    const memberRole = project.members.find(
      m => m.user._id.toString() === userId.toString()
    )?.role;

    if (
      project.owner._id.toString() !== userId.toString() &&
      memberRole !== 'admin'
    ) {
      const error = new Error('Only project admins can remove members');
      error.statusCode = 403;
      throw error;
    }
    if (project.owner._id.toString() === targetUserId.toString()) {
      const error = new Error('Cannot remove the project owner');
      error.statusCode = 400;
      throw error;
    }
    const memberExists = project.members.some(
      m => m.user._id.toString() === targetUserId.toString()
    );

    if (!memberExists) {
      const error = new Error('Member not found');
      error.statusCode = 404;
      throw error;
    }

    project.members = project.members.filter(m => m.user._id.toString() !== targetUserId.toString());
    await project.save();

    return project;
  }
}

module.exports = new ProjectService();
