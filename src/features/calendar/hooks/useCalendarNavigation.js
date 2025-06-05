export function useCalendarNavigation({
  currentMonth,
  setCurrentMonth,
  currentWeekStart,
  setCurrentWeekStart,
  viewMode,
}) {
  // Navigate to previous period (month or week)
  const prevPeriod = () => {
    if (viewMode === 'monthly') {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    } else {
      const newWeekStart = new Date(currentWeekStart);
      newWeekStart.setDate(currentWeekStart.getDate() - 7);
      setCurrentWeekStart(newWeekStart);
      setCurrentMonth(new Date(newWeekStart.getFullYear(), newWeekStart.getMonth()));
    }
  };

  // Navigate to next period (month or week)
  const nextPeriod = () => {
    if (viewMode === 'monthly') {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    } else {
      const newWeekStart = new Date(currentWeekStart);
      newWeekStart.setDate(currentWeekStart.getDate() + 7);
      setCurrentWeekStart(newWeekStart);
      setCurrentMonth(new Date(newWeekStart.getFullYear(), newWeekStart.getMonth()));
    }
  };

  // Get period string for display
  const getPeriodString = () => {
    if (viewMode === 'monthly') {
      return currentMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    } else if (currentWeekStart) {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(currentWeekStart.getDate() + 6);

      const startStr = currentWeekStart.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      const endStr = weekEnd.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      return `${startStr} - ${endStr}`;
    }
    return '';
  };

  return {
    prevPeriod,
    nextPeriod,
    getPeriodString,
  };
}
