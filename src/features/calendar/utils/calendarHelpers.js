export function generateMonthView(year, month) {
  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);

  // Get the first calendar day (may be from previous month)
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 6 = Saturday

  const days = [];

  // Add days from previous month if needed
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      isCurrentMonth: false,
    });
  }

  // Add days from current month
  const today = new Date();
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    days.push({
      date,
      isCurrentMonth: true,
      isToday:
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear(),
    });
  }

  // Add days from next month if needed to complete the grid (6 rows of 7 days)
  const daysNeeded = 42 - days.length; // 6 rows of 7 days = 42
  for (let i = 1; i <= daysNeeded; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  return days;
}

export function generateWeekView(weekStart) {
  const days = [];
  const today = new Date();

  // Generate 7 days starting from the week start
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);

    days.push({
      date,
      isCurrentMonth: date.getMonth() === today.getMonth(),
      isToday:
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear(),
    });
  }

  return days;
}

export function organizeWeeklyEvents(weekDays, events) {
  const weeklyEventsMap = {};

  if (!events?.length || !weekDays?.length) return weeklyEventsMap;

  events.forEach((event) => {
    const eventDate = new Date(event.date);
    const eventDay = eventDate.getDay(); // 0 = Sunday, 6 = Saturday

    // Check if the event falls within the current week
    const weekDay = weekDays.find((day) => {
      const isSameDate =
        day.date.getDate() === eventDate.getDate() &&
        day.date.getMonth() === eventDate.getMonth() &&
        day.date.getFullYear() === eventDate.getFullYear();
      return isSameDate;
    });

    if (!weekDay) return;

    // Extract time slot information
    const [startHour] = event.startTime.split(':').map(Number);
    const [endHour] = event.endTime.split(':').map(Number);

    // Handle events that span across hours
    const eventEndHour = endHour === 0 ? 24 : endHour; // Handle midnight end time
    const eventStartHour = startHour < 8 ? 8 : startHour; // Ensure start hour is not before 8am
    const eventFinalEndHour = eventEndHour > 16 ? 16 : eventEndHour; // Cap end hour at 4pm

    for (let hour = eventStartHour; hour < eventFinalEndHour; hour++) {
      const timeSlotKey = `${eventDay}-${hour}`;

      if (!weeklyEventsMap[timeSlotKey]) {
        weeklyEventsMap[timeSlotKey] = [];
      }

      // Only add the event if it's not already in the time slot
      if (!weeklyEventsMap[timeSlotKey].some((e) => e.id === event.id)) {
        weeklyEventsMap[timeSlotKey].push({
          ...event,
          title: `${event.title} (${event.startTime}-${event.endTime})`, // Add time to title for better visibility
        });
      }
    }
  });

  return weeklyEventsMap;
}
