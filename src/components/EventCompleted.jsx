import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import EventCard from './EventCard';
import EventGradeInput from './EventGradeInput';

function EventCompleted({ groups, setGroups }) {
  const [editing, setEditing] = useState({ groupDate: null, taskId: null });
  const [pageNumbers, setPageNumbers] = useState({});
  const [width, setWidth] = useState(window.innerWidth);

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

  const saveGrade = (grade) => {
    const { groupDate, taskId } = editing;
    if (!groupDate || !taskId) return;

    const updated = groups.map((group) => {
      if (group.date !== groupDate) return group;
      const updatedTasks = group.tasks.map((task) => {
        if (task.id === taskId && task.isCompleted) {
          return { ...task, grade };
        }
        return task;
      });
      return { ...group, tasks: updatedTasks };
    });

    setGroups(updated);
    cancelEditing();
  };

  const onPageChange = (groupDate) => (data) => {
    setPageNumbers((prev) => ({
      ...prev,
      [groupDate]: data.selected,
    }));
  };

  const completedGroups = groups
    .map((group) => ({
      ...group,
      tasks: group.tasks.filter((task) => task.isCompleted),
    }))
    .filter((group) => group.tasks.length > 0);

  return (
    <>
      {completedGroups.length > 0 ? (
        completedGroups.map((group) => {
          const perPage = tasksPerPage();
          const currentPage = pageNumbers[group.date] || 0;
          const pageCount = Math.ceil(group.tasks.length / perPage);
          const visibleTasks = group.tasks.slice(
            currentPage * perPage,
            (currentPage + 1) * perPage
          );

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
                {visibleTasks.map((task) =>
                  editing.groupDate === group.date && editing.taskId === task.id ? (
                    <div key={task.id} className="event-card event-completed">
                      <h3 className="event-title">{task.title}</h3>
                      <EventGradeInput
                        initialGrade={task.grade}
                        onSave={saveGrade}
                        onCancel={cancelEditing}
                      />
                    </div>
                  ) : (
                    <EventCard
                      key={task.id}
                      task={task}
                      onSetGrade={() => startEditing(group.date, task.id)}
                    />
                  )
                )}
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
        })
      ) : (
        <p className="empty-message">No completed events yet!</p>
      )}
    </>
  );
}

export default EventCompleted;
