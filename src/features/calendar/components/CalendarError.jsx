import React from 'react';

export default function CalendarError({ error }) {
  return (
    <div className="calendar-error">
      <p>Error: {error}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
}
