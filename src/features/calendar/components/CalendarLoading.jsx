import React from 'react';
import { LoadingAnimation } from '../../animations';

export default function CalendarLoading() {
  return (
    <div className="calendar-loading">
      <LoadingAnimation size="large" />
      <p>Loading calendar data...</p>
    </div>
  );
}
