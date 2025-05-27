import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import EventCard from './EventCard';
import GradeInput from './GradeInput';

function CompletedEventsTab({ groups, setGroups }) {
  const [editingTask, setEditingTask] = useState({ groupId: null, taskId: null });
  const [pageNumberByGroup, setPageNumberByGroup] = useState({});
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getTasksPerPage = () => {
    if (screenWidth < 768) return 1;
    else if (screenWidth < 1199) return 2;
    else return 3;
  };

  const startEditingGrade = (groupId, taskId) => {
    setEditingTask({ groupId, taskId });
  };

  const cancelEditing = () => {
    setEditingTask({ groupId: null, taskId: null });
  };

  const saveGrade = (grade) => {
    const { groupId, taskId } = editingTask;
    if (!groupId || !taskId) return;

    const updatedGroups = groups.map((group) => {
      if (group.date === groupId) {
        const updatedTasks = group.tasks.map((task) => {
          if (task.id === taskId && task.isCompleted) {
            return { ...task, grade };
          }
          return task;
        });
        return { ...group, tasks: updatedTasks };
      }
      return group;
    });

    setGroups(updatedGroups);
    cancelEditing();
  };

  const handlePageChange = (groupDate) => (selectedItem) => {
    setPageNumberByGroup((prev) => ({
      ...prev,
      [groupDate]: selectedItem.selected,
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
          const tasksPerPage = getTasksPerPage();
          const pageNumber = pageNumberByGroup[group.date] || 0;
          const pageCount = Math.ceil(group.tasks.length / tasksPerPage);
          const displayedTasks = group.tasks.slice(
            pageNumber * tasksPerPage,
            (pageNumber + 1) * tasksPerPage
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
                {displayedTasks.map((task) =>
                  editingTask.groupId === group.date && editingTask.taskId === task.id ? (
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
                      onSetGrade={() => startEditingGrade(group.date, task.id)}
                    />
                  )
                )}
              </div>

              {pageCount > 1 && (
                <ReactPaginate
                  previousLabel={<span className="pagination-arrow">&lt;</span>}
                  nextLabel={<span className="pagination-arrow">&gt;</span>}
                  pageCount={pageCount}
                  onPageChange={handlePageChange(group.date)}
                  forcePage={pageNumber}
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
