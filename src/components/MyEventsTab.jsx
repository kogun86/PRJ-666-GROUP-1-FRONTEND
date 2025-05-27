import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import EventCard from './EventCard';

const getDateKey = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

function MyEventsTab({ groups, setGroups }) {
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

  const toggleComplete = (groupId, taskId) => {
    const updatedGroups = groups.map((group) => {
      if (group.date === groupId) {
        const updatedTasks = group.tasks.map((task) =>
          task.id === taskId && !task.isCompleted ? { ...task, isCompleted: true } : task
        );
        return { ...group, tasks: updatedTasks };
      }
      return group;
    });
    setGroups(updatedGroups);
  };

  const handlePageChange = (groupDate) => (selectedItem) => {
    setPageNumberByGroup((prev) => ({
      ...prev,
      [groupDate]: selectedItem.selected,
    }));
  };

  // Filter groups with incomplete tasks only
  const incompleteGroups = groups
    .map((group) => ({
      ...group,
      tasks: group.tasks.filter((task) => !task.isCompleted),
    }))
    .filter((group) => group.tasks.length > 0);

  useEffect(() => {
    // Ensure current page is valid for each group
    const tasksPerPage = getTasksPerPage();
    const newPageNumbers = { ...pageNumberByGroup };

    incompleteGroups.forEach((group) => {
      const pageCount = Math.ceil(group.tasks.length / tasksPerPage);
      const currentPage = pageNumberByGroup[group.date] || 0;

      if (currentPage >= pageCount) {
        newPageNumbers[group.date] = Math.max(0, pageCount - 1);
      }
    });

    setPageNumberByGroup(newPageNumbers);
  }, [groups, screenWidth]);

  return (
    <>
      {incompleteGroups.length > 0 ? (
        incompleteGroups.map((group) => {
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
                {displayedTasks.map((task) => (
                  <EventCard
                    key={task.id}
                    task={task}
                    onToggle={() => toggleComplete(group.date, task.id)}
                    onSetGrade={null}
                  />
                ))}
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
        <p className="empty-message upcoming-events">No upcoming events!</p>
      )}
    </>
  );
}

export default MyEventsTab;
