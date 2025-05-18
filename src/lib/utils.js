import { clsx } from 'clsx';

/**
 * Combines multiple class names into a single string, filtering out falsy values
 * @param {...string} classes - One or more class strings to combine
 * @returns {string} Combined class string
 */
export function cn(...inputs) {
  return clsx(inputs);
}

/**
 * Formats a date using a specified format pattern
 * @param {Date} date - The date to format
 * @param {string} format - The format pattern to use
 * @returns {string} The formatted date string
 */
export function formatDate(date, format = 'PPP') {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch (error) {
    return '';
  }
}

/**
 * Checks if a value is an object
 * @param {any} value - The value to check
 * @returns {boolean} True if the value is an object
 */
export function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Checks if two objects are deeply equal
 * @param {object} obj1 - The first object
 * @param {object} obj2 - The second object
 * @returns {boolean} True if the objects are equal
 */
export function deepEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (!isObject(obj1) || !isObject(obj2)) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}
