import React, { useState, useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

// Helper to format hours in AM/PM
function formatHour(hour) {
  if (hour === 0) return '12 AM';
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return '12 PM';
  return `${hour - 12} PM`;
}

export default function WeeklySchedule() {
  // Fetch schedule data: expect [{ id, courseName, date, startTime, endTime, type }, …]
  const { data, error } = useSWR('/api/schedule', fetcher);

  // Compute current week start (Sunday)
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=Sun
    today.setDate(today.getDate() - dayOfWeek);
    return today;
  });

  // Build an array of 7 days for this week
  const [weekDays, setWeekDays] = useState([]);
  useEffect(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      days.push({
        date: d,
        isToday: d.toDateString() === new Date().toDateString(),
      });
    }
    setWeekDays(days);
  }, [weekStart]);

  // Precompute time slots (10AM–6PM)
  const hours = Array.from({ length: 9 }, (_, i) => 10 + i);

  // Map events into dayIndex-hour buckets
  const eventsMap = {};
  if (data) {
    data.forEach((evt) => {
      const d = new Date(evt.date);
      const dayIndex = d.getDay(); // 0..6
      const hour = parseInt(evt.startTime.split(':')[0], 10);
      const key = `${dayIndex}-${hour}`;
      if (!eventsMap[key]) eventsMap[key] = [];
      eventsMap[key].push(evt);
    });
  }

  if (error) return <div>Error loading schedule.</div>;
  if (!data) return <div>Loading schedule…</div>;

  // Handlers to move between weeks
  const prevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(weekStart.getDate() - 7);
    setWeekStart(prev);
  };
  const nextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(weekStart.getDate() + 7);
    setWeekStart(next);
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem', textAlign: 'right' }}>
        <button onClick={prevWeek}>← Prev Week</button>
        <button onClick={nextWeek} style={{ marginLeft: '0.5rem' }}>
          Next Week →
        </button>
      </div>

      <div className="week-view-container">
        {/* Day headers */}
        <div className="week-view-header">
          <div className="time-header" />
          {weekDays.map((day, idx) => (
            <div key={idx} className={`day-header ${day.isToday ? 'current' : ''}`}>
              {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
              <div className="day-number">{day.date.getDate()}</div>
            </div>
          ))}
        </div>

        {/* Time rows */}
        <div className="week-view-grid">
          {hours.map((hour) => (
            <div key={hour} className="time-row">
              <div className="time-label">{formatHour(hour)}</div>

              {weekDays.map((_, dayIdx) => {
                const slotKey = `${dayIdx}-${hour}`;
                const slotEvents = eventsMap[slotKey] || [];
                return (
                  <div
                    key={dayIdx}
                    className={`time-cell ${weekDays[dayIdx].isToday ? 'current' : ''}`}
                  >
                    {slotEvents.map((evt) => (
                      <div
                        key={evt.id}
                        className={`week-event event-${evt.type}`}
                        title={`${evt.courseName} (${evt.startTime}–${evt.endTime})`}
                      >
                        {evt.courseName}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
