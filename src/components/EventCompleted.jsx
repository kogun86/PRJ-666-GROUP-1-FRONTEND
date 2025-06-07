import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import EventCard from './EventCard';
import EventGradeInput from './EventGradeInput';
import { useEvents } from '../features/events';

function EventCompleted({ groups }) {
  const { toggleEventStatus } = useEvents();
  const [editing, setEditing] = useState({ groupDate: null, taskId: null });
  const [pageNumbers, setPageNumbers] = useState({});
  const [width, setWidth] = useState(window.innerWidth);
  const [updatingEventId, setUpdatingEventId] = useState(null);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const tasksPerPage = () => {
    if (width < 768) return 1;
    if (width < 1199) return 2;
    return 3;
  };

  const startEditing = (groupDate, taskId) => {
    setEditing({ groupDate, taskId });
  };

  const cancelEditing = () => {
    setEditing({ groupDate: null, taskId: null });
  };

  const markIncomplete = async (task) => {
    // Debug the task to see what properties are available
    console.log('Task being marked as incomplete:', task);

    // Extract the correct ID based on what's available
    const eventId = task._id || task.id;

    if (!eventId) {
      console.error('Cannot mark as incomplete: Missing task ID', task);
      return;
    }

    console.log('Using event ID for update:', eventId);

    setUpdatingEventId(eventId);
    try {
      await toggleEventStatus(eventId, false);
    } catch (error) {
      console.error('Failed to mark event as incomplete:', error);
    } finally {
      setUpdatingEventId(null);
    }
  };

  const saveGrade = (grade) => {
    const { groupDate, taskId } = editing;
    if (!groupDate || !taskId) return;

    cancelEditing();
  };

  const onPageChange = (groupDate) => (data) => {
    setPageNumbers((prev) => ({
      ...prev,
      [groupDate]: data.selected,
    }));
  };

  if (!groups || groups.length === 0) {
    return <p className="empty-message">No completed events yet!</p>;
  }

  return (
    <>
      {groups.map((group) => {
        const perPage = tasksPerPage();
        const currentPage = pageNumbers[group.date] || 0;
        const pageCount = Math.ceil(group.tasks.length / perPage);
        const visibleTasks = group.tasks.slice(currentPage * perPage, (currentPage + 1) * perPage);

        return (
          <div key={group.date} className="events-group-container">
            <h2 className="events-group-date">
              {new Date(group.date).toLocaleDateString('en-US', {
                weekday: 'long',
                month: '2-digit',
                day: '2-digit',
              })}
            </h2>

            <div className="events-tasks-grid">
              {visibleTasks.map((task) => {
                // Use the event's color or default to the theme color
                const eventColor = task.color || '#52796f';

                return editing.groupDate === group.date &&
                  editing.taskId === (task.id || task._id) ? (
                  <div
                    key={task.id || task._id}
                    className="event-card event-completed"
                    style={{ '--event-color': eventColor }}
                  >
                    <h3 className="event-title">{task.title}</h3>
                    <EventGradeInput
                      initialGrade={task.grade}
                      onSave={saveGrade}
                      onCancel={cancelEditing}
                    />
                  </div>
                ) : (
                  <div
                    key={task.id || task._id}
                    className="event-card event-completed"
                    style={{ '--event-color': eventColor }}
                  >
                    <div className="event-title-row">
                      <h3 className="event-title">{task.title}</h3>
                      <div className="event-type-badge">{task.type}</div>
                    </div>

                    <div className="event-metadata">
                      <div className="event-due">
                        <span className="event-label">Due:</span>{' '}
                        {new Date(task.dueDate).toLocaleTimeString()}
                      </div>
                      <div className="event-weight">
                        <span className="event-label">Weight:</span> {task.weight}%
                      </div>
                    </div>

                    {task.description && (
                      <div className="event-description">
                        <p>{task.description}</p>
                      </div>
                    )}

                    <div className="event-grade-display">
                      <span className="event-label">Grade:</span>{' '}
                      {task.grade !== null ? `${task.grade}%` : 'Not graded'}
                    </div>

                    <div className="event-actions">
                      <button
                        className="event-action-button event-action-secondary"
                        onClick={() => markIncomplete(task)}
                        disabled={updatingEventId === task._id}
                      >
                        {updatingEventId === task._id ? 'Updating...' : 'Mark as Incomplete'}
                      </button>

                      <button
                        className="event-action-button"
                        onClick={() => startEditing(group.date, task.id || task._id)}
                        disabled={updatingEventId === task._id}
                      >
                        {task.grade !== null ? 'Edit Grade' : 'Set Grade'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {pageCount > 1 && (
              <ReactPaginate
                previousLabel={<span className="events-pagination-arrow">&lt;</span>}
                nextLabel={<span className="events-pagination-arrow">&gt;</span>}
                pageCount={pageCount}
                onPageChange={onPageChange(group.date)}
                forcePage={currentPage}
                containerClassName="events-pagination-container"
                pageClassName="events-pagination-item"
                pageLinkClassName="events-pagination-link"
                activeClassName="events-active-page"
                previousClassName="events-pagination-nav"
                nextClassName="events-pagination-nav"
                disabledClassName="events-disabled-nav"
                breakLabel="..."
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
              />
            )}
          </div>
        );
      })}
    </>
  );
}

export default EventCompleted;
