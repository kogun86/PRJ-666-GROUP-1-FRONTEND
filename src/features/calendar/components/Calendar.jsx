import { useState, useEffect, useRef } from 'react';
import { useCalendarData } from '../hooks/useCalendarData';
import { useCalendarNavigation } from '../hooks/useCalendarNavigation';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

export default function Calendar() {
  const mounted = useRef(true);
  const calendarRef = useRef(null);
  const [viewMode, setViewMode] = useState('dayGridMonth'); // 'dayGridMonth' or 'timeGridWeek'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

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
  const transformedEvents = calendarEvents.map((event) => {
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
        <div className="calendar-header">
          <div className="calendar-month">{getPeriodString()}</div>
          <div className="calendar-controls">
            <div className="view-toggle">
              <button
                className={`view-toggle-button ${viewMode.includes('Week') ? 'active' : ''}`}
                onClick={switchToWeekly}
              >
                Weekly
              </button>
              <button
                className={`view-toggle-button ${viewMode.includes('Month') ? 'active' : ''}`}
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
              slotMinTime="08:00:00" // Start time for week view
              slotMaxTime="16:00:00" // End time for week view
              allDaySlot={false} // Hide all-day slot in week view
              weekends={true} // Show weekends
              firstDay={0} // Start week on Sunday (0) to match your current implementation
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
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="password-modal">
                <h2 className="password-modal-title">{selectedEvent.title}</h2>

                <div className="event-details-content">
                  <div className="password-form-group">
                    <label className="password-label">Date</label>
                    <div className="password-input">
                      {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>

                  <div className="password-form-group">
                    <label className="password-label">Time</label>
                    <div className="password-input">{`${selectedEvent.startTime} - ${selectedEvent.endTime}`}</div>
                  </div>

                  {selectedEvent.courseCode && (
                    <div className="password-form-group">
                      <label className="password-label">Course</label>
                      <div className="password-input">{selectedEvent.courseCode}</div>
                    </div>
                  )}

                  {selectedEvent.type && (
                    <div className="password-form-group">
                      <label className="password-label">Type</label>
                      <div className="password-input">{selectedEvent.type}</div>
                    </div>
                  )}

                  {selectedEvent.description && (
                    <div className="password-form-group">
                      <label className="password-label">Description</label>
                      <div className="password-input">{selectedEvent.description}</div>
                    </div>
                  )}

                  <div className="password-actions">
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="password-cancel-button"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
