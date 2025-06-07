import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import EventCard from './EventCard';

function EventsPending({ groups, setGroups }) {
  const [pages, setPages] = useState({});
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const perPage = width < 768 ? 1 : width < 1199 ? 2 : 3;

  const markDone = (groupDate, taskId) => {
    const newGroups = groups.map((group) =>
      group.date === groupDate
        ? {
            ...group,
            tasks: group.tasks.map((t) =>
              t.id === taskId && !t.isCompleted ? { ...t, isCompleted: true } : t
            ),
          }
        : group
    );
    setGroups(newGroups);
  };

  const changePage = (date) => (selected) => {
    setPages((prev) => ({ ...prev, [date]: selected.selected }));
  };

  const activeGroups = groups
    .map((g) => ({ ...g, tasks: g.tasks.filter((t) => !t.isCompleted) }))
    .filter((g) => g.tasks.length);

  useEffect(() => {
    const newPages = { ...pages };
    activeGroups.forEach((g) => {
      const maxPage = Math.ceil(g.tasks.length / perPage) - 1;
      if ((pages[g.date] || 0) > maxPage) {
        newPages[g.date] = Math.max(0, maxPage);
      }
    });
    setPages(newPages);
  }, [groups, width]);

  if (!activeGroups.length) {
    return <p className="empty-message">No upcoming events!</p>;
  }

  return (
    <>
      {activeGroups.map((group) => {
        const page = pages[group.date] || 0;
        const totalPages = Math.ceil(group.tasks.length / perPage);
        const start = page * perPage;
        const shownTasks = group.tasks.slice(start, start + perPage);

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
              {shownTasks.map((task) => (
                <EventCard
                  key={task.id}
                  task={task}
                  onToggle={() => markDone(group.date, task.id)}
                  onSetGrade={null}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <ReactPaginate
                previousLabel={<span className="events-pagination-arrow">&lt;</span>}
                nextLabel={<span className="events-pagination-arrow">&gt;</span>}
                pageCount={totalPages}
                onPageChange={changePage(group.date)}
                forcePage={page}
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

export default EventsPending;
