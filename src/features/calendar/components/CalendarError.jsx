import React from 'react';

export default function CalendarError({ error }) {
  return (
    <div className="calendar-error">
      <p>Error loading calendar: {error}</p>
      <p>Please try refreshing the page or contact support if the problem persists.</p>
    </div>
  );
}
