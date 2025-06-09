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
import { transformEvents, transformClasses, combineCalendarItems } from '../utils/eventUtils';

export default function Calendar() {
  const mounted = useRef(true);
  const calendarRef = useRef(null);
  const [viewMode, setViewMode] = useState('dayGridMonth'); // 'dayGridMonth' or 'timeGridWeek'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const { calendarEvents, calendarClasses, isLoading, error, updateCurrentDate } =
    useCalendarData();

  // Debug logging
  useEffect(() => {
    console.log('Raw calendar events from API:', calendarEvents);
    console.log('Raw calendar classes from API:', calendarClasses);
  }, [calendarEvents, calendarClasses]);

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

  // Transform events and classes for FullCalendar format
  const transformedEvents = transformEvents(calendarEvents);
  const transformedClasses = transformClasses(calendarClasses);
  const combinedCalendarItems = combineCalendarItems(transformedEvents, transformedClasses);

  // Debug logging
  useEffect(() => {
    console.log('Transformed events for FullCalendar:', transformedEvents);
    console.log('Transformed classes for FullCalendar:', transformedClasses);
    console.log('Combined calendar items:', combinedCalendarItems);
  }, [transformedEvents, transformedClasses, combinedCalendarItems]);

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
      console.log('Calendar item clicked:', info.event);

      // Check if this is a class or an event
      const isClass = info.event.extendedProps.type === 'class';

      if (isClass) {
        const originalClass = info.event.extendedProps.originalClass;
        console.log('Setting selected class:', originalClass);
        setSelectedEvent({
          ...originalClass,
          isClass: true, // Flag to identify this as a class for the modal
          title: info.event.title,
          color: info.event.backgroundColor,
        });
      } else {
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
    const { event } = info;

    // Get the type of the calendar item (event or class)
    const itemType = event.extendedProps.type;

    // Create tooltip content based on the type
    let tooltipContent = '';

    if (itemType === 'class') {
      // Class tooltip
      const courseTitle = event.extendedProps.courseTitle || '';
      const location = event.extendedProps.location || 'Location not specified';
      const classType = event.extendedProps.classType || 'Class';
      const topics =
        event.extendedProps.topics && event.extendedProps.topics.length > 0
          ? `<br><strong>Topics:</strong> ${event.extendedProps.topics.join(', ')}`
          : '';

      tooltipContent = `
        <div class="event-tooltip">
          <h4>${event.title}</h4>
          ${courseTitle ? `<p>${courseTitle}</p>` : ''}
          <p><strong>${classType}</strong></p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Time:</strong> ${formatTime(event.start)} - ${formatTime(event.end)}</p>
          ${topics}
        </div>
      `;
    } else {
      // Regular event tooltip
      const description = event.extendedProps.description || 'No description';
      const location = event.extendedProps.location || 'Location not specified';

      tooltipContent = `
        <div class="event-tooltip">
          <h4>${event.title}</h4>
          <p>${description}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>Time:</strong> ${formatTime(event.start)} - ${formatTime(event.end)}</p>
        </div>
      `;
    }

    // Create the tooltip
    if (info.el) {
      tippy(info.el, {
        content: tooltipContent,
        allowHTML: true,
        theme: 'light',
        placement: 'top',
        arrow: true,
        interactive: true,
        appendTo: document.body,
      });
    }
  };

  // Helper function to format time for tooltips
  const formatTime = (date) => {
    if (!date) return 'N/A';

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
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
        <CalendarDebug
          events={calendarEvents}
          classes={calendarClasses}
          transformedEvents={combinedCalendarItems}
        />

        {/* FullCalendar Component */}
        {!isLoading && !error && (
          <div className="fullcalendar-wrapper">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView={isMobile ? 'listMonth' : viewMode}
              headerToolbar={false} // We're using our custom header
              events={combinedCalendarItems}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              eventDidMount={handleEventMount}
              datesSet={handleViewChange}
              height="auto"
              dayMaxEvents={true} // Allow "more" link when too many events
              slotMinTime="08:00:00" // Start time for week view - adjusted to show early classes
              slotMaxTime="22:00:00" // End time for week view - expanded to show later classes
              allDaySlot={false} // Hide all-day slot in week view
              weekends={true} // Show weekends
              firstDay={0} // Start week on Sunday (0) to match your current implementation
              timeZone="local" // Changed from "UTC" to "local" to correctly display times
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
