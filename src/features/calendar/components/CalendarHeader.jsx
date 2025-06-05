import React from 'react';

export default function CalendarHeader({
  periodString,
  viewMode,
  onPrevPeriod,
  onNextPeriod,
  onSwitchToWeekly,
  onSwitchToMonthly,
}) {
  return (
    <div className="calendar-header">
      <div className="calendar-month">{periodString}</div>
      <div className="calendar-controls">
        <div className="view-toggle">
          <button
            className={`view-toggle-button ${viewMode.includes('Week') ? 'active' : ''}`}
            onClick={onSwitchToWeekly}
          >
            Weekly
          </button>
          <button
            className={`view-toggle-button ${viewMode.includes('Month') ? 'active' : ''}`}
            onClick={onSwitchToMonthly}
          >
            Monthly
          </button>
        </div>
        <div className="calendar-nav">
          <button className="calendar-nav-button" onClick={onPrevPeriod}>
            &lt;
          </button>
          <button className="calendar-nav-button" onClick={onNextPeriod}>
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
