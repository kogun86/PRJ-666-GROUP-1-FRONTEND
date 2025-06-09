/**
 * Convert time string in format "HH:MM" to seconds
 * @param {string} timeStr - Time string in format "HH:MM"
 * @returns {number} - Time in seconds
 */
export function convertToSeconds(timeStr) {
  if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes(':')) {
    console.error('❌ Invalid time format:', timeStr);
    return 0;
  }
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 3600 + minutes * 60;
}

/**
 * Convert seconds to time string in format "HH:MM"
 * @param {number} seconds - Time in seconds
 * @returns {string} - Time string in format "HH:MM"
 */
export function secondsToTime(seconds) {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
    console.error('❌ Invalid seconds value:', seconds);
    return '00:00';
  }
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

/**
 * Get weekday name from index
 * @param {number} index - Weekday index (0-6, where 0 is Sunday)
 * @returns {string} - Weekday name
 */
export function getWeekday(index) {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  if (index < 0 || index > 6) {
    console.error('❌ Invalid weekday index:', index);
    return 'Unknown';
  }
  return days[index];
}

/**
 * Convert weekday name to index
 * @param {string} name - Weekday name
 * @returns {number} - Weekday index (0-6, where 0 is Sunday)
 */
export function weekdayToIndex(name) {
  const weekDayToIndex = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };
  return weekDayToIndex[name] || 0;
}
