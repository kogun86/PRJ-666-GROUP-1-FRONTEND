import { useState, useEffect, useRef } from 'react';
import { useCalendarData } from '../hooks/useCalendarData';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

// Import custom components
import CalendarHeader from './CalendarHeader';
import CalendarLoading from './CalendarLoading';
import CalendarError from './CalendarError';
import CalendarDebug from './CalendarDebug';
import EventModal from './EventModal';

// Import utilities
import { transformEvents } from '../utils/eventUtils';

export default function Calendar() {
  const mounted = useRef(true);
  const calendarRef = useRef(null);
  const [viewMode, setViewMode] = useState('dayGridMonth'); // 'dayGridMonth' or 'timeGridWeek'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const { calendarEvents, isLoading, error, updateCurrentDate } = useCalendarData();

  // Debug logging
  useEffect(() => {
    console.log('Raw calendar events from API:', calendarEvents);
  }, [calendarEvents]);

  // Detect mobile screen size
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIsMobile();

    // Add event listener for resize
    window.addEventListener('resize', checkIsMobile);

    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Update view mode based on screen size
  useEffect(() => {
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();

      if (isMobile && viewMode === 'dayGridMonth') {
        api.changeView('listMonth');
        setViewMode('listMonth');
      } else if (isMobile && viewMode === 'timeGridWeek') {
        api.changeView('listWeek');
        setViewMode('listWeek');
      } else if (!isMobile && viewMode === 'listMonth') {
        api.changeView('dayGridMonth');
        setViewMode('dayGridMonth');
      } else if (!isMobile && viewMode === 'listWeek') {
        api.changeView('timeGridWeek');
        setViewMode('timeGridWeek');
      }
    }
  }, [isMobile, viewMode]);

  // Cleanup effect
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Transform events for FullCalendar format
  const transformedEvents = transformEvents(calendarEvents);

  // Debug logging
  useEffect(() => {
    console.log('Transformed events for FullCalendar:', transformedEvents);
  }, [transformedEvents]);

  // Switch view mode
  const switchToMonthly = () => {
    if (mounted.current) {
      const newViewMode = isMobile ? 'listMonth' : 'dayGridMonth';
      setViewMode(newViewMode);
      if (calendarRef.current) {
        calendarRef.current.getApi().changeView(newViewMode);
      }
    }
  };

  const switchToWeekly = () => {
    if (mounted.current) {
      const newViewMode = isMobile ? 'listWeek' : 'timeGridWeek';
      setViewMode(newViewMode);
      if (calendarRef.current) {
        calendarRef.current.getApi().changeView(newViewMode);
      }
    }
  };

  // Navigation functions
  const prevPeriod = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().prev();
      const newDate = calendarRef.current.getApi().getDate();
      setCurrentDate(newDate);

      // Fetch data for the new date range if needed
      updateCurrentDate(newDate);
    }
  };

  const nextPeriod = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
      const newDate = calendarRef.current.getApi().getDate();
      setCurrentDate(newDate);

      // Fetch data for the new date range if needed
      updateCurrentDate(newDate);
    }
  };

  // Get period string for display
  const getPeriodString = () => {
    if (!calendarRef.current) return '';

    const api = calendarRef.current.getApi();
    const view = api.view;

    if (viewMode.includes('Month')) {
      return currentDate.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    } else {
      // For weekly view, calculate the start and end of the week
      if (!api) return '';

      const start = new Date(view.activeStart);
      const end = new Date(view.activeEnd);
      end.setDate(end.getDate() - 1); // Adjust end date (exclusive to inclusive)

      const startStr = start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });

      const endStr = end.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      return `${startStr} - ${endStr}`;
    }
  };

  // Handle event click
  const handleEventClick = (info) => {
    if (mounted.current) {
      console.log('Event clicked:', info.event);

      // Get the original event from extendedProps
      const originalEvent = info.event.extendedProps.originalEvent;

      if (originalEvent) {
        console.log('Setting selected event:', originalEvent);
        setSelectedEvent(originalEvent);
      } else {
        // Fallback to searching by ID
        const eventId = info.event.id;
        const foundEvent = calendarEvents.find((event) => {
          const id = event._id || event.id;
          return id === eventId;
        });

        if (foundEvent) {
          console.log('Found event by ID search:', foundEvent);
          setSelectedEvent(foundEvent);
        } else {
          console.warn('Could not find original event for:', info.event);
        }
      }
    }
  };

  // Handle date click
  const handleDateClick = (info) => {
    if (mounted.current) {
      console.log('Date clicked:', info.date);
    }
  };

  // Handle view change to fetch data for the visible date range
  const handleViewChange = (viewInfo) => {
    if (mounted.current) {
      // Get the visible date range
      const visibleStart = viewInfo.view.activeStart;
      const visibleEnd = viewInfo.view.activeEnd;

      console.log('View changed, visible range:', {
        start: visibleStart,
        end: visibleEnd,
      });

      // Use the middle date of the visible range to fetch data
      const middleDate = new Date((visibleStart.getTime() + visibleEnd.getTime()) / 2);
      updateCurrentDate(middleDate);
    }
  };

  // Setup tooltips for events
  const handleEventMount = (info) => {
    console.log('Event mounted:', info.event);

    const { event } = info;
    const { type, courseID, description, weight, grade, isCompleted, location } =
      event.extendedProps;

    let tooltipContent = `
      <div class="event-tooltip">
        <h4>${event.title}</h4>
    `;

    if (event.start && event.end && !event.allDay) {
      tooltipContent += `
        <p><strong>Time:</strong> ${event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
        ${event.end ? event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</p>
      `;
    }

    tooltipContent += `
      <p><strong>Type:</strong> ${type ? type.charAt(0).toUpperCase() + type.slice(1) : 'N/A'}</p>
      ${courseID ? `<p><strong>Course ID:</strong> ${courseID}</p>` : ''}
    `;

    if (weight !== undefined) {
      tooltipContent += `<p><strong>Weight:</strong> ${weight}%</p>`;
    }

    if (isCompleted && grade !== undefined) {
      tooltipContent += `<p><strong>Grade:</strong> ${grade}%</p>`;
    }

    if (location) {
      tooltipContent += `<p><strong>Location:</strong> ${location}</p>`;
    }

    tooltipContent += `
      ${description ? `<p><strong>Description:</strong> ${description}</p>` : ''}
      </div>
    `;

    tippy(info.el, {
      content: tooltipContent,
      allowHTML: true,
      theme: 'light',
      placement: 'top',
      arrow: true,
      interactive: true,
      appendTo: document.body,
    });
  };

  if (!mounted.current) {
    return null;
  }

  return (
    <div className="calendar-container">
      <div className="calendar-card">
        {/* Calendar Header with Navigation and View Toggle */}
        <CalendarHeader
          periodString={getPeriodString()}
          viewMode={viewMode}
          onPrevPeriod={prevPeriod}
          onNextPeriod={nextPeriod}
          onSwitchToWeekly={switchToWeekly}
          onSwitchToMonthly={switchToMonthly}
        />

        {/* Loading State */}
        {isLoading && <CalendarLoading />}

        {/* Error State */}
        {error && <CalendarError error={error} />}

        {/* Debug Info */}
        <CalendarDebug events={calendarEvents} transformedEvents={transformedEvents} />

        {/* FullCalendar Component */}
        {!isLoading && !error && (
          <div className="fullcalendar-wrapper">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView={isMobile ? 'listMonth' : viewMode}
              headerToolbar={false} // We're using our custom header
              events={transformedEvents}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              eventDidMount={handleEventMount}
              datesSet={handleViewChange}
              height="auto"
              dayMaxEvents={true} // Allow "more" link when too many events
              slotMinTime="08:00:00" // Start time for week view - adjusted to show early classes
              slotMaxTime="16:00:00" // End time for week view - expanded to show later classes
              allDaySlot={false} // Hide all-day slot in week view
              weekends={true} // Show weekends
              firstDay={0} // Start week on Sunday (0) to match your current implementation
              timeZone="UTC" // CRITICAL: Use UTC timezone for display
              views={{
                dayGridMonth: {
                  dayMaxEventRows: 3, // Limit number of events per day in month view
                },
                listMonth: {
                  listDayFormat: { weekday: 'long' },
                  listDaySideFormat: { month: 'long', day: 'numeric' },
                },
                listWeek: {
                  listDayFormat: { weekday: 'long' },
                  listDaySideFormat: { month: 'short', day: 'numeric' },
                },
              }}
            />
          </div>
        )}

        {/* Event Details Modal */}
        {selectedEvent && (
          <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        )}
      </div>
    </div>
  );
}
