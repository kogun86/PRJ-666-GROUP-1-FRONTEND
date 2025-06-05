/**
 * Transform events for FullCalendar format
 * @param {Array} calendarEvents - Raw calendar events from API
 * @returns {Array} - Transformed events for FullCalendar
 */
export function transformEvents(calendarEvents) {
  return calendarEvents.map((event) => {
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

    return {
      id: event.id,
      title: event.title,
      start: new Date(
        event.date.getFullYear(),
        event.date.getMonth(),
        event.date.getDate(),
        parseInt(event.startTime.split(':')[0]),
        parseInt(event.startTime.split(':')[1])
      ),
      end: new Date(
        event.date.getFullYear(),
        event.date.getMonth(),
        event.date.getDate(),
        parseInt(event.endTime.split(':')[0]),
        parseInt(event.endTime.split(':')[1])
      ),
      allDay: event.startTime === '00:00' && event.endTime === '23:59',
      backgroundColor,
      borderColor,
      className: `event-${event.type}`,
      extendedProps: {
        type: event.type,
        courseCode: event.courseCode,
        description: event.description,
      },
    };
  });
}
