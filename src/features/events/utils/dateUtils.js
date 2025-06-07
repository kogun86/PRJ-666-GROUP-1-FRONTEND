/**
 * Converts a date string to a standardized date key format (YYYY-MM-DD)
 * @param {string} dateString - Date string to convert
 * @returns {string} Date in YYYY-MM-DD format
 */
export const getDateKey = (dateString) => {
  try {
    if (!dateString) {
      console.warn('Invalid or empty date provided to getDateKey:', dateString);
      return 'unknown-date';
    }

    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date provided to getDateKey:', dateString);
      return 'invalid-date';
    }

    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error in getDateKey:', error, 'for dateString:', dateString);
    return 'error-date';
  }
};

/**
 * Groups tasks by their due date
 * @param {Array} tasks - Array of task objects with dueDate property
 * @returns {Array} Array of grouped task objects by date
 */
export const groupTasksByDate = (tasks) => {
  const groups = {};
  tasks.forEach((task) => {
    // Skip task if dueDate is not provided
    if (!task.dueDate) {
      console.warn('Task without dueDate:', task);
      return;
    }

    const dateKey = getDateKey(task.dueDate);
    if (!groups[dateKey]) {
      groups[dateKey] = { date: dateKey, tasks: [] };
    }
    groups[dateKey].tasks.push(task);
  });
  return Object.values(groups);
};
