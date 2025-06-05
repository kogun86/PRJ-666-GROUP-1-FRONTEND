import { useState, useEffect, useRef, useMemo } from 'react';
import { useCalendarData } from '../hooks/useCalendarData';
import { useCalendarNavigation } from '../hooks/useCalendarNavigation';
import {
  generateMonthView,
  generateWeekView,
  organizeWeeklyEvents,
} from '../utils/calendarHelpers';
import MonthView from './MonthView';
import WeekView from './WeekView';

export default function Calendar() {
  const mounted = useRef(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState('monthly');
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    firstDayOfWeek.setDate(today.getDate() - dayOfWeek);
    return firstDayOfWeek;
  });

  const { calendarEvents, isLoading, error } = useCalendarData();

  const { prevPeriod, nextPeriod, getPeriodString } = useCalendarNavigation({
    currentMonth,
    setCurrentMonth,
    currentWeekStart,
    setCurrentWeekStart,
    viewMode,
  });

  // Cleanup effect
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Memoize calendar days generation
  const calendarDays = useMemo(() => {
    if (!currentMonth || !currentWeekStart) return [];

    return viewMode === 'monthly'
      ? generateMonthView(currentMonth.getFullYear(), currentMonth.getMonth())
      : generateWeekView(currentWeekStart);
  }, [currentMonth, viewMode, currentWeekStart]);

  // Memoize weekly events organization
  const weeklyEvents = useMemo(() => {
    if (viewMode !== 'weekly' || !calendarDays.length || !calendarEvents?.length) return {};

    return organizeWeeklyEvents(calendarDays, calendarEvents);
  }, [viewMode, calendarDays, calendarEvents]);

  // Switch view mode
  const switchToMonthly = () => {
    if (mounted.current) {
      setViewMode('monthly');
    }
  };

  const switchToWeekly = () => {
    if (mounted.current) {
      setViewMode('weekly');
    }
  };

  // Handle day click
  const handleDayClick = (day) => {
    if (mounted.current) {
      console.log('Day clicked:', day.date);
    }
  };

  if (!mounted.current) {
    return null;
  }

  return (
    <div className="calendar-container">
      <div className="calendar-card">
        {/* Calendar Header with Navigation and View Toggle */}
        <div className="calendar-header">
          <div className="calendar-month">{getPeriodString()}</div>
          <div className="calendar-controls">
            <div className="view-toggle">
              <button
                className={`view-toggle-button ${viewMode === 'weekly' ? 'active' : ''}`}
                onClick={switchToWeekly}
              >
                Weekly
              </button>
              <button
                className={`view-toggle-button ${viewMode === 'monthly' ? 'active' : ''}`}
                onClick={switchToMonthly}
              >
                Monthly
              </button>
            </div>
            <div className="calendar-nav">
              <button className="calendar-nav-button" onClick={prevPeriod}>
                &lt;
              </button>
              <button className="calendar-nav-button" onClick={nextPeriod}>
                &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="calendar-loading">
            <div className="spinner"></div>
            <p>Loading calendar data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="calendar-error">
            <p>Error: {error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {/* Calendar Content */}
        {!isLoading &&
          !error &&
          (viewMode === 'monthly' ? (
            <MonthView
              calendarDays={calendarDays}
              events={calendarEvents}
              onDayClick={handleDayClick}
            />
          ) : (
            <WeekView calendarDays={calendarDays} weeklyEvents={weeklyEvents} />
          ))}
      </div>
    </div>
  );
}
