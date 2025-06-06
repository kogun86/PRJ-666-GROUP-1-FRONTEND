/**
 * Converts a date string to a standardized date key format (YYYY-MM-DD)
 * @param {string} dateString - Date string to convert
 * @returns {string} Date in YYYY-MM-DD format
 */
export const getDateKey = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Groups tasks by their due date
 * @param {Array} tasks - Array of task objects with dueDate property
 * @returns {Array} Array of grouped task objects by date
 */
export const groupTasksByDate = (tasks) => {
  const groups = {};
  tasks.forEach((task) => {
    const dateKey = getDateKey(task.dueDate);
    if (!groups[dateKey]) {
      groups[dateKey] = { date: dateKey, tasks: [] };
    }
    groups[dateKey].tasks.push(task);
  });
  return Object.values(groups);
};
