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
  const [debugInfo, setDebugInfo] = useState(null);

  const { calendarEvents, isLoading, error } = useCalendarData();

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

  // Debug events - log count and sample
  console.log(`Calendar events count: ${calendarEvents.length}`);
  console.log(`Transformed events count: ${transformedEvents.length}`);
  if (transformedEvents.length > 0) {
    console.log('Sample transformed event:', transformedEvents[0]);
  }

  // Helper function to navigate to the first class week
  const goToFirstClassWeek = () => {
    if (!transformedEvents.length) {
      setDebugInfo('No events available to navigate to');
      return;
    }

    // Sort events by start date
    const sortedEvents = [...transformedEvents].sort(
      (a, b) => new Date(a.start) - new Date(b.start)
    );

    const firstEvent = sortedEvents[0];
    if (!firstEvent || !firstEvent.start) {
      setDebugInfo("First event doesn't have a valid start date");
      return;
    }

    // Navigate to the week of the first event
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.gotoDate(firstEvent.start);

      // If we're not in weekly view, switch to it
      if (!viewMode.includes('Week')) {
        switchToWeekly();
      }

      setDebugInfo(`Navigated to date: ${firstEvent.start.toISOString().split('T')[0]}`);
    }
  };

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
      setCurrentDate(calendarRef.current.getApi().getDate());
    }
  };

  const nextPeriod = () => {
    if (calendarRef.current) {
      calendarRef.current.getApi().next();
      setCurrentDate(calendarRef.current.getApi().getDate());
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
      const eventId = info.event.id;
      const originalEvent = calendarEvents.find((event) => event.id === eventId);
      if (originalEvent) {
        setSelectedEvent(originalEvent);
      }
    }
  };

  // Handle date click
  const handleDateClick = (info) => {
    if (mounted.current) {
      console.log('Date clicked:', info.date);
    }
  };

  // Setup tooltips for events
  const handleEventMount = (info) => {
    const { event } = info;
    const { type, courseCode, description } = event.extendedProps;

    let tooltipContent = `
      <div class="event-tooltip">
        <h4>${event.title}</h4>
        <p><strong>Time:</strong> ${event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
        ${event.end ? event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</p>
        <p><strong>Type:</strong> ${type || 'N/A'}</p>
        ${courseCode ? `<p><strong>Course:</strong> ${courseCode}</p>` : ''}
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

        {/* Debug Helper Button */}
        {process.env.NODE_ENV === 'development' && (
          <div className="debug-controls">
            <button
              onClick={goToFirstClassWeek}
              className="debug-button"
              style={{
                padding: '5px 10px',
                marginBottom: '10px',
                backgroundColor: '#52796f',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Go to First Class Week
            </button>
            {debugInfo && (
              <div
                className="debug-info"
                style={{
                  fontSize: '12px',
                  marginBottom: '5px',
                  padding: '5px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                }}
              >
                {debugInfo}
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && <CalendarLoading />}

        {/* Error State */}
        {error && <CalendarError error={error} />}

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
