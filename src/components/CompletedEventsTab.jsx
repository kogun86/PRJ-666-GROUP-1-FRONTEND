import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import EventCard from './EventCard';
import GradeInput from './GradeInput';

function CompletedEventsTab({ groups, setGroups }) {
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
            <div key={group.date} className="group-container">
              <h2 className="group-date">
                {new Date(group.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </h2>

              <div className="tasks-grid">
                {visibleTasks.map((task) =>
                  editing.groupDate === group.date && editing.taskId === task.id ? (
                    <div key={task.id} className="task-card">
                      <h3 className="task-title">{task.title}</h3>
                      <GradeInput
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
                  previousLabel={<span className="pagination-arrow">&lt;</span>}
                  nextLabel={<span className="pagination-arrow">&gt;</span>}
                  pageCount={pageCount}
                  onPageChange={onPageChange(group.date)}
                  forcePage={currentPage}
                  containerClassName="pagination-container"
                  pageClassName="pagination-item"
                  pageLinkClassName="pagination-link"
                  activeClassName="active-page"
                  previousClassName="pagination-nav"
                  nextClassName="pagination-nav"
                  disabledClassName="disabled-nav"
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

export default CompletedEventsTab;
