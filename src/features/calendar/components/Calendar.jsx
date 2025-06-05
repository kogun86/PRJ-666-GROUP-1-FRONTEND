import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useCalendarEvents } from '../hooks/useCalendarEvents';
import { useCalendarNavigation } from '../hooks/useCalendarNavigation';
import {
  generateMonthView,
  generateWeekView,
  organizeWeeklyEvents,
} from '../utils/calendarHelpers';
import MonthView from './MonthView';
import WeekView from './WeekView';

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [viewMode, setViewMode] = useState('monthly'); // 'monthly' or 'weekly'
  const [currentWeekStart, setCurrentWeekStart] = useState(null);

  const { events, weeklyEvents, setWeeklyEvents } = useCalendarEvents();
  const { prevPeriod, nextPeriod, getPeriodString } = useCalendarNavigation({
    currentMonth,
    setCurrentMonth,
    currentWeekStart,
    setCurrentWeekStart,
    viewMode,
  });

  // Initialize current week on component mount
  useEffect(() => {
    const today = new Date();
    // Get the first day of the current week (Sunday)
    const firstDayOfWeek = new Date(today);
    const dayOfWeek = today.getDay();
    firstDayOfWeek.setDate(today.getDate() - dayOfWeek);
    setCurrentWeekStart(firstDayOfWeek);
  }, []);

  // Generate calendar days for the current view mode
  useEffect(() => {
    if (!currentMonth || !currentWeekStart) return;

    const days =
      viewMode === 'monthly'
        ? generateMonthView(currentMonth.getFullYear(), currentMonth.getMonth())
        : generateWeekView(currentWeekStart);

    setCalendarDays(days);

    if (viewMode === 'weekly') {
      const weeklyEventsMap = organizeWeeklyEvents(days, events);
      setWeeklyEvents(weeklyEventsMap);
    }
  }, [currentMonth, viewMode, currentWeekStart, events]);

  // Switch view mode
  const switchToMonthly = () => setViewMode('monthly');
  const switchToWeekly = () => setViewMode('weekly');

  // Handle day click
  const handleDayClick = (day) => {
    console.log('Day clicked:', day.date);
    // Future feature: open modal with day details or event form
  };

  return (
    <ProtectedRoute>
      <Layout>
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

            {/* Render appropriate view based on viewMode */}
            {viewMode === 'monthly' ? (
              <MonthView calendarDays={calendarDays} events={events} onDayClick={handleDayClick} />
            ) : (
              <WeekView calendarDays={calendarDays} weeklyEvents={weeklyEvents} />
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
