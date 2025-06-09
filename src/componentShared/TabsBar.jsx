import React from 'react';

/**
 * Reusable TabsBar component for creating tab interfaces
 *
 * Note: The CSS for this component is imported globally in _app.js
 *
 * @param {Object} props Component props
 * @param {Array} props.tabs Array of tab objects with label and id properties
 * @param {string} props.activeTab ID of the currently active tab
 * @param {Function} props.onTabChange Function to call when a tab is clicked
 * @param {string} [props.className] Optional additional CSS class for the tabs bar
 * @returns {JSX.Element} TabsBar component
 */
const TabsBar = ({ tabs, activeTab, onTabChange, className = '' }) => {
  return (
    <div className={`tabs-bar ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabsBar;
