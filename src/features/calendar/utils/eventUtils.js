/**
 * Transform events for FullCalendar format
 * @param {Array} calendarEvents - Raw calendar events from API
 * @returns {Array} - Transformed events for FullCalendar
 */
export function transformEvents(calendarEvents) {
  if (!calendarEvents || !Array.isArray(calendarEvents)) {
    return [];
  }

  return calendarEvents.map((event) => {
    // Determine event color based on type
    let backgroundColor;
    let borderColor;

    switch (event.type) {
      case 'lecture':
        backgroundColor = '#52796f';
        borderColor = '#3a5a40';
        break;
      case 'lab':
        backgroundColor = '#3a5a40';
        borderColor = '#2f3e46';
        break;
      case 'tutorial':
        backgroundColor = '#84a98c';
        borderColor = '#52796f';
        break;
      case 'completed':
        backgroundColor = '#84a98c';
        borderColor = '#52796f';
        break;
      case 'pending':
        backgroundColor = '#f9c74f';
        borderColor = '#f8961e';
        break;
      default:
        backgroundColor = '#cad2c5';
        borderColor = '#84a98c';
    }

    // Parse dates - focusing on preserving UTC time
    let start, end;

    try {
      // First priority: direct ISO strings from API (with UTC 'Z' marker)
      if (typeof event.startTime === 'string' && event.startTime.includes('T')) {
        // Parse the ISO strings to get UTC components
        const parseUTCFromISO = (isoString) => {
          // Extract date components from ISO string
          const match = isoString.match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
          if (!match) return new Date();

          const [_, year, month, day, hours, minutes, seconds] = match;

          // Create a new date with the UTC components
          const date = new Date();
          date.setUTCFullYear(parseInt(year));
          date.setUTCMonth(parseInt(month) - 1); // Month is 0-indexed
          date.setUTCDate(parseInt(day));
          date.setUTCHours(parseInt(hours));
          date.setUTCMinutes(parseInt(minutes));
          date.setUTCSeconds(parseInt(seconds));

          return date;
        };

        start = parseUTCFromISO(event.startTime);
        end = parseUTCFromISO(event.endTime);
      }
      // Second priority: date object + time strings
      else if (event.date instanceof Date) {
        // Extract hours and minutes from time strings
        const [startHours, startMinutes] = (event.startTime || '00:00').split(':').map(Number);
        const [endHours, endMinutes] = (event.endTime || '00:00').split(':').map(Number);

        // Create new Date objects to avoid modifying the original
        start = new Date(event.date);
        start.setHours(startHours || 0, startMinutes || 0, 0);

        end = new Date(event.date);
        end.setHours(endHours || 0, endMinutes || 0, 0);
      }
      // For API responses with date string but no ISO format
      else if (typeof event.date === 'string' && event.date.includes('T')) {
        const dateObj = new Date(event.date);

        // Handle time components
        const [startHours, startMinutes] = (event.startTime || '00:00').split(':').map(Number);
        const [endHours, endMinutes] = (event.endTime || '00:00').split(':').map(Number);

        start = new Date(dateObj);
        start.setHours(startHours || 0, startMinutes || 0, 0);

        end = new Date(dateObj);
        end.setHours(endHours || 0, endMinutes || 0, 0);
      }
      // Fallback for any other format
      else {
        // Try to parse date from any available format
        const dateObj = event.date ? new Date(event.date) : new Date();

        // Extract time components if available
        const [startHours, startMinutes] = (event.startTime || '00:00').split(':').map(Number);
        const [endHours, endMinutes] = (event.endTime || '00:00').split(':').map(Number);

        start = new Date(dateObj);
        start.setHours(startHours || 0, startMinutes || 0, 0);

        end = new Date(dateObj);
        end.setHours(endHours || 0, endMinutes || 0, 0);
      }

      // Validate that we have valid dates
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date parsing result');
      }
    } catch (error) {
      console.error('Error parsing event dates:', error);
      // Provide fallback dates if parsing fails
      start = new Date();
      end = new Date();
      end.setHours(end.getHours() + 1);
    }

    // Final event object for FullCalendar
    return {
      id: event.id,
      title: event.title,
      start: start,
      end: end,
      allDay: event.startTime === '00:00' && event.endTime === '23:59',
      backgroundColor,
      borderColor,
      className: `event-${event.type}`,
      extendedProps: {
        type: event.type,
        courseCode: event.courseCode,
        description: event.description,
        weight: event.weight,
        grade: event.grade,
        isCompleted: event.isCompleted,
        // Store original UTC times for reference
        originalStartTime: event.startTime,
        originalEndTime: event.endTime,
        // Flag if the times are already in UTC format
        isUTC: event.isUTC || false,
      },
    };
  });
}
