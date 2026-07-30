const TASK_PRIORITIES = ['low', 'medium', 'high', 'urgent'];

const validateCreateTask = (data) => {
  const errors = [];

  const {
    title,
    description,
    priority,
    assignees,
    dueDate,
    position,
    labels
  } = data || {};

  if (!title || typeof title !== 'string' || !title.trim()) {
    errors.push('Task title is required');
  }

  if (
    priority &&
    !TASK_PRIORITIES.includes(priority)
  ) {
    errors.push('Priority must be low, medium, high, or urgent');
  }

  if (labels && !Array.isArray(labels)) {
    errors.push('Labels must be an array');
  }

  if (assignees && !Array.isArray(assignees)) {
    errors.push('Assignees must be an array');
  }

  if (errors.length) {
    return { error: errors };
  }

  return {
    value: {
      body: {
        title: title.trim(),
        description: description ? description.trim() : '',
        priority: priority || 'medium',
        assignees: assignees || [],
        labels: labels || [],
        dueDate: dueDate ? new Date(dueDate) : undefined,
        position:
          position !== undefined
            ? Number(position)
            : undefined
      }
    }
  };
};

const validateUpdateTask = (data) => {
  const errors = [];

  const {
    title,
    description,
    listId,
    priority,
    assignees,
    dueDate,
    position,
    labels,
    isArchived
  } = data || {};

  if (
    title !== undefined &&
    (typeof title !== 'string' || !title.trim())
  ) {
    errors.push('Task title cannot be empty');
  }

  if (
    priority !== undefined &&
    !TASK_PRIORITIES.includes(priority)
  ) {
    errors.push('Priority must be low, medium, high, or urgent');
  }

  if (
    labels !== undefined &&
    !Array.isArray(labels)
  ) {
    errors.push('Labels must be an array');
  }

  if (
    assignees !== undefined &&
    !Array.isArray(assignees)
  ) {
    errors.push('Assignees must be an array');
  }

  if (errors.length) {
    return { error: errors };
  }

  const cleanBody = {};

  if (title !== undefined)
    cleanBody.title = title.trim();

  if (description !== undefined)
    cleanBody.description = description.trim();

  if (listId !== undefined)
    cleanBody.listId = listId;

  if (priority !== undefined)
    cleanBody.priority = priority;

  if (assignees !== undefined)
    cleanBody.assignees = assignees;

  if (labels !== undefined)
    cleanBody.labels = labels;

  if (dueDate !== undefined)
    cleanBody.dueDate = dueDate ? new Date(dueDate) : null;

  if (position !== undefined)
    cleanBody.position = Number(position);

  if (isArchived !== undefined)
    cleanBody.isArchived = Boolean(isArchived);

  return {
    value: {
      body: cleanBody
    }
  };
};

module.exports = {
  validateCreateTask,
  validateUpdateTask
};
