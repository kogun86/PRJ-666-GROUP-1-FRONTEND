import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import EventCard from './EventCard';
import EventGradeInput from './EventGradeInput';
import { useEvents } from '../features/events';

function EventCompleted({ groups }) {
  const { toggleEventStatus, deleteEventById } = useEvents();
  const [editing, setEditing] = useState({ groupDate: null, taskId: null });
  const [pageNumbers, setPageNumbers] = useState({});
  const [width, setWidth] = useState(window.innerWidth);
  const [updatingEventId, setUpdatingEventId] = useState(null);
  const [deletingEventId, setDeletingEventId] = useState(null);

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

  const deleteEvent = async (eventId) => {
    if (!eventId) {
      console.error('Cannot delete: Missing event ID');
      return;
    }

    console.log('Deleting event with ID:', eventId);

    setDeletingEventId(eventId);
    try {
      await deleteEventById(eventId);
    } catch (error) {
      console.error('Failed to delete event:', error);
    } finally {
      setDeletingEventId(null);
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
                const taskId = task._id || task.id;

                if (editing.groupDate === group.date && editing.taskId === taskId) {
                  // Use the event's color or default to the theme color
                  const eventColor = task.color || '#52796f';

                  return (
                    <div
                      key={taskId}
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
                  );
                }

                return (
                  <div key={taskId} className="event-card-wrapper">
                    <EventCard
                      task={task}
                      onToggle={() => markIncomplete(task)}
                      onSetGrade={() => startEditing(group.date, taskId)}
                      onDelete={deleteEvent}
                      isUpdating={updatingEventId === taskId}
                      isDeleting={deletingEventId === taskId}
                    />
                    {process.env.NODE_ENV === 'development' && (
                      <div
                        className="debug-info"
                        style={{
                          fontSize: '10px',
                          color: '#999',
                          marginTop: '-12px',
                          marginBottom: '8px',
                        }}
                      >
                        ID: {task.id}, _ID: {task._id}
                      </div>
                    )}
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
