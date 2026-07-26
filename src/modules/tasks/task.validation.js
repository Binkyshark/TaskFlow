const validateCreateTask = (data) => {
  const errors = [];
  const { title, listId, description, priority, assignees, dueDate, position } = data || {};

  if (!title || typeof title !== 'string' || !title.trim()) {
    errors.push('Task title is required');
  }

  if (!listId) {
    errors.push('listId is required');
  }

  if (priority && !['low', 'medium', 'high', 'urgent'].includes(priority)) {
    errors.push('Priority must be low, medium, high, or urgent');
  }

  if (errors.length > 0) {
    return { error: errors };
  }

  return {
    value: {
      body: {
        title: title.trim(),
        listId,
        description: description ? description.trim() : '',
        priority: priority || 'medium',
        assignees: Array.isArray(assignees) ? assignees : [],
        dueDate: dueDate ? new Date(dueDate) : undefined,
        position: position !== undefined ? Number(position) : 0
      }
    }
  };
};

const validateUpdateTask = (data) => {
  const errors = [];
  const { title, description, listId, priority, assignees, dueDate, position, isCompleted } = data || {};

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    errors.push('Task title cannot be empty');
  }

  if (priority !== undefined && !['low', 'medium', 'high', 'urgent'].includes(priority)) {
    errors.push('Priority must be low, medium, high, or urgent');
  }

  if (errors.length > 0) {
    return { error: errors };
  }

  const cleanBody = {};
  if (title !== undefined) cleanBody.title = title.trim();
  if (description !== undefined) cleanBody.description = description.trim();
  if (listId !== undefined) cleanBody.listId = listId;
  if (priority !== undefined) cleanBody.priority = priority;
  if (assignees !== undefined) cleanBody.assignees = Array.isArray(assignees) ? assignees : [];
  if (dueDate !== undefined) cleanBody.dueDate = dueDate ? new Date(dueDate) : null;
  if (position !== undefined) cleanBody.position = Number(position);
  if (isCompleted !== undefined) cleanBody.isCompleted = Boolean(isCompleted);

  return { value: { body: cleanBody } };
};

module.exports = {
  validateCreateTask,
  validateUpdateTask
};
