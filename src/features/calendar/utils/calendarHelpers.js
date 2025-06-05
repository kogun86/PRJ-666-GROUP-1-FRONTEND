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

  events.forEach((event) => {
    // Check if the event falls within the current week
    const eventDate = event.date;
    const eventDay = eventDate.getDay(); // 0 = Sunday, 6 = Saturday

    const weekDay = weekDays.find((day, index) => index === eventDay);
    if (!weekDay) return;

    // Check if dates match (ignoring time)
    const isSameDate =
      weekDay.date.getDate() === eventDate.getDate() &&
      weekDay.date.getMonth() === eventDate.getMonth() &&
      weekDay.date.getFullYear() === eventDate.getFullYear();

    if (isSameDate) {
      // Extract time slot information
      const startHour = parseInt(event.startTime.split(':')[0], 10);
      const endHour = parseInt(event.endTime.split(':')[0], 10);

      // Create a unique key for this day and time slot
      for (let hour = startHour; hour < endHour; hour++) {
        const timeSlotKey = `${eventDay}-${hour}`;

        if (!weeklyEventsMap[timeSlotKey]) {
          weeklyEventsMap[timeSlotKey] = [];
        }

        weeklyEventsMap[timeSlotKey].push(event);
      }
    }
  });

  return weeklyEventsMap;
}
