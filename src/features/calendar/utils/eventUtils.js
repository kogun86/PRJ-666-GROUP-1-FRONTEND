/**
 * Transform events for FullCalendar format
 * @param {Array} calendarEvents - Raw calendar events from API
 * @returns {Array} - Transformed events for FullCalendar
 */
export function transformEvents(calendarEvents) {
  console.log('transformEvents input:', calendarEvents);

  if (!calendarEvents || !Array.isArray(calendarEvents)) {
    console.warn('Invalid calendarEvents provided:', calendarEvents);
    return [];
  }

  if (calendarEvents.length === 0) {
    console.log('No events to transform');
    return [];
  }

  const transformed = calendarEvents.map((event, index) => {
    console.log(`Processing event ${index}:`, event);

    // Extract ID - use _id or id, whichever is available
    const eventId = event._id || event.id;
    if (!eventId) {
      console.warn('Event missing ID:', event);
    }

    // Extract title
    const title = event.title;
    if (!title) {
      console.warn('Event missing title:', event);
    }

    // Extract dates - handle different possible formats
    let startDate = event.start || event.startTime || event.startDate || event.dueDate;
    let endDate = event.end || event.endTime || event.endDate || event.dueDate;

    if (!startDate) {
      console.warn('Event missing start date:', event);
    }

    // Use the color provided in the API response or fallback to defaults
    const backgroundColor = event.color || getDefaultColor(event.type);
    console.log(`Event ${index} color:`, backgroundColor);

    // Determine border color based on event type for visual distinction
    let borderColor;
    switch (event.type) {
      case 'assignment':
        borderColor = darkenColor(backgroundColor, 15);
        break;
      case 'exam':
        borderColor = darkenColor(backgroundColor, 20);
        break;
      case 'lecture':
        borderColor = darkenColor(backgroundColor, 10);
        break;
      case 'lab':
        borderColor = darkenColor(backgroundColor, 15);
        break;
      case 'tutorial':
        borderColor = darkenColor(backgroundColor, 5);
        break;
      default:
        borderColor = darkenColor(backgroundColor, 10);
    }

    // Parse dates from the API response
    let start, end;

    try {
      // Parse the start and end dates from ISO strings
      start = new Date(startDate);
      end = new Date(endDate);

      console.log(`Event ${index} parsed dates:`, {
        startInput: startDate,
        endInput: endDate,
        startParsed: start,
        endParsed: end,
      });

      // Validate that we have valid dates
      if (isNaN(start.getTime())) {
        console.error(`Event ${index} has invalid start date:`, startDate);
        throw new Error('Invalid start date');
      }

      if (isNaN(end.getTime())) {
        console.warn(`Event ${index} has invalid end date, using end of start day:`, endDate);
        // If end date is invalid, set it to the end of the start date
        end = new Date(start);
        end.setHours(23, 59, 59);
      }
    } catch (error) {
      console.error('Error parsing event dates:', error, event);
      // Provide fallback dates if parsing fails
      start = new Date();
      end = new Date();
      end.setHours(end.getHours() + 1);
      console.log(`Using fallback dates for event ${index}:`, { start, end });
    }

    // Final event object for FullCalendar
    const transformedEvent = {
      id: eventId,
      title: title || 'Untitled Event',
      start: start,
      end: end,
      allDay: event.allDay || false,
      backgroundColor,
      borderColor,
      display: 'block',
      className: `event-${event.type || 'default'}`,
      extendedProps: {
        type: event.type || 'default',
        courseID: event.courseID || event.courseId,
        description: event.description,
        weight: event.weight,
        grade: event.grade,
        isCompleted: event.isCompleted,
        location: event.location,
        userId: event.userId,
        // Store original event for reference
        originalEvent: event,
      },
    };

    console.log(`Transformed event ${index}:`, transformedEvent);
    return transformedEvent;
  });

  console.log('Final transformed events:', transformed);
  return transformed;
}

/**
 * Get default color based on event type
 * @param {string} type - Event type
 * @returns {string} - Hex color code
 */
function getDefaultColor(type) {
  switch (type) {
    case 'assignment':
      return '#f9c74f';
    case 'exam':
      return '#f94144';
    case 'lecture':
      return '#52796f';
    case 'lab':
      return '#3a5a40';
    case 'tutorial':
      return '#84a98c';
    default:
      return '#cad2c5';
  }
}

/**
 * Darken a hex color by a percentage
 * @param {string} hex - Hex color code
 * @param {number} percent - Percentage to darken
 * @returns {string} - Darkened hex color
 */
function darkenColor(hex, percent) {
  if (!hex || typeof hex !== 'string') {
    console.warn('Invalid hex color provided:', hex);
    return '#cad2c5';
  }

  // Remove # if present
  hex = hex.replace(/^#/, '');

  // Check if hex is valid
  if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
    console.warn('Invalid hex color format:', hex);
    return '#cad2c5';
  }

  // Convert to RGB
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);

  // Darken
  r = Math.floor(r * (1 - percent / 100));
  g = Math.floor(g * (1 - percent / 100));
  b = Math.floor(b * (1 - percent / 100));

  // Ensure values are within range
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
