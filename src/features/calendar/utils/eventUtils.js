/**
 * Transform events for FullCalendar format
 * @param {Array} calendarEvents - Raw calendar events from API
 * @returns {Array} - Transformed events for FullCalendar
 */
export function transformEvents(calendarEvents) {
  if (!calendarEvents || !Array.isArray(calendarEvents)) {
    console.warn('Invalid calendarEvents data:', calendarEvents);
    return [];
  }

  // Calculate timezone offset in hours for better logging
  const localTimezoneOffsetHours = -(new Date().getTimezoneOffset() / 60);
  console.log(
    `Local timezone offset: UTC${localTimezoneOffsetHours >= 0 ? '+' : ''}${localTimezoneOffsetHours} hours`
  );

  return calendarEvents.map((event) => {
    // For debugging
    console.log('Processing event:', JSON.stringify(event));

    // Determine event color based on type
    let backgroundColor;
    let borderColor;

    switch (event.type) {
      case 'lecture':
        backgroundColor = '#52796f'; // Updated to match CSS
        borderColor = '#3a5a40';
        break;
      case 'lab':
        backgroundColor = '#3a5a40'; // Updated to match CSS
        borderColor = '#2f3e46';
        break;
      case 'tutorial':
        backgroundColor = '#84a98c'; // Updated to match CSS
        borderColor = '#52796f';
        break;
      case 'completed':
        backgroundColor = '#84a98c'; // Updated to match CSS
        borderColor = '#52796f';
        break;
      default:
        backgroundColor = '#cad2c5'; // Grey
        borderColor = '#84a98c';
    }

    // Parse dates - focusing on preserving UTC time
    let start, end;

    try {
      // First priority: direct ISO strings from API (with UTC 'Z' marker)
      if (typeof event.startTime === 'string' && event.startTime.includes('T')) {
        console.log('Using ISO date string format for event (preserving UTC)');

        // IMPORTANT: Create the Date objects but preserve the UTC time
        // This is critical for correct display in FullCalendar
        // We'll use ignoreTimezone=true in FullCalendar props later

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

        // Log both UTC and local times for debugging
        console.log(`Start time (UTC): ${event.startTime}`);
        console.log(`Start time (local): ${start.toLocaleString()}`);
        console.log(`End time (UTC): ${event.endTime}`);
        console.log(`End time (local): ${end.toLocaleString()}`);

        // Log hours for debugging
        console.log(
          `UTC hours: ${start.getUTCHours()}:${start.getUTCMinutes()} - ${end.getUTCHours()}:${end.getUTCMinutes()}`
        );
        console.log(
          `Local hours: ${start.getHours()}:${start.getMinutes()} - ${end.getHours()}:${end.getMinutes()}`
        );
      }
      // Second priority: date object + time strings
      else if (event.date instanceof Date) {
        console.log('Using date object + time string format for event');
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
        console.log('Using date string from API for event');
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
        console.warn('Using fallback date parsing for event:', event);
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

      // Debug log the parsed dates
      console.log('Parsed start date:', start);
      console.log('Parsed end date:', end);

      // Validate that we have valid dates
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date parsing result');
      }
    } catch (error) {
      console.error('Error parsing event dates:', error, event);
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
        // Store original UTC times for reference
        originalStartTime: event.startTime,
        originalEndTime: event.endTime,
        // Flag if the times are already in UTC format
        isUTC: event.isUTC || false,
      },
    };
  });
}
