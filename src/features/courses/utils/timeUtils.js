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
 * Convert local time string in format "HH:MM" to UTC seconds
 * @param {string} timeStr - Time string in format "HH:MM"
 * @param {number} weekday - Day of the week (1-7, where 1 is Monday)
 * @returns {number} - Time in seconds adjusted to UTC
 */
export function convertToUTCSeconds(timeStr, weekday) {
  if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes(':')) {
    console.error('❌ Invalid time format:', timeStr);
    return 0;
  }

  // Parse the time string
  const [hours, minutes] = timeStr.split(':').map(Number);

  // Create a Date object for the current date with the specified time
  const now = new Date();

  // Calculate the date for the given weekday (0 = Sunday, 1 = Monday, etc.)
  // Adjust weekday from 1-7 (Monday-Sunday) to 0-6 (Sunday-Saturday)
  const targetWeekday = weekday % 7; // Convert 7 (Sunday in our system) to 0 (Sunday in JS)
  const currentWeekday = now.getDay(); // 0-6 (Sunday-Saturday)
  const daysToAdd = (targetWeekday - currentWeekday + 7) % 7;

  const targetDate = new Date(now);
  targetDate.setDate(now.getDate() + daysToAdd);
  targetDate.setHours(hours, minutes, 0, 0);

  // Get the UTC time in seconds since midnight
  const utcHours = targetDate.getUTCHours();
  const utcMinutes = targetDate.getUTCMinutes();

  return utcHours * 3600 + utcMinutes * 60;
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
