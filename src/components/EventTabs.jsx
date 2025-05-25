import React, { useState } from 'react';
import EventCard from './EventCard';
import { Settings, Plus, X } from 'lucide-react';

// Helper function to format date for display
const formatDisplayDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: '2-digit',
    day: '2-digit',
  });
};

// Helper function to get date key in 'YYYY-MM-DD' format
const getDateKey = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

function EventTabs() {
  const [activeTab, setActiveTab] = useState('home');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    courseCode: '',
    type: 'Homework',
    description: '',
    topics: '',
    weight: '',
  });

  // Initial tasks
  const initialTasks = [
    {
      id: 1,
      title: 'Workshop 3',
      date: '2025-12-02',
      weight: '4%',
      courseCode: 'APD545',
      type: 'Homework',
      color: 'red',
      description: 'Lorem ipsum dolor sit amet.',
      completed: false,
      grade: '',
    },
    {
      id: 2,
      title: 'Prepare for Test 2',
      date: '2025-12-02',
      weight: '20%',
      courseCode: 'DB8501',
      type: 'Study Session',
      color: 'blue',
      topics: ['Explicit cursors', 'Variables', 'Loops'],
      completed: true,
      grade: '',
    },
    {
      id: 3,
      title: 'Advanced Database Topics',
      date: '2025-12-03',
      weight: '24%',
      courseCode: 'DB8501',
      type: 'Study Session',
      topics: ['Stored Procedures', 'Triggers', 'Indexing'],
      completed: false,
      grade: '',
    },
  ];

  // Group tasks by date
  const groupTasksByDate = (tasks) => {
    const groups = {};
    tasks.forEach((task) => {
      const dateKey = getDateKey(task.date);
      if (!groups[dateKey]) {
        groups[dateKey] = {
          date: dateKey,
          tasks: [],
        };
      }
      groups[dateKey].tasks.push(task);
    });

    return Object.values(groups);
  };

  const [groups, setGroups] = useState(groupTasksByDate(initialTasks));

  const toggleComplete = (groupId, taskId) => {
    const updatedGroups = groups.map((group) => {
      if (group.date === groupId) {
        const updatedTasks = group.tasks.map((task) => {
          if (task.id === taskId && !task.completed) {
            return { ...task, completed: true };
          }
          return task;
        });
        return { ...group, tasks: updatedTasks };
      }
      return group;
    });

    setGroups(updatedGroups);
  };

  const setGrade = (groupId, taskId) => {
    const grade = prompt('Enter grade for this completed task:', '');
    if (grade !== null && grade.trim() !== '') {
      const updatedGroups = groups.map((group) => {
        if (group.date === groupId) {
          const updatedTasks = group.tasks.map((task) => {
            if (task.id === taskId && task.completed) {
              return { ...task, grade: grade.trim() };
            }
            return task;
          });
          return { ...group, tasks: updatedTasks };
        }
        return group;
      });

      setGroups(updatedGroups);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.courseCode) {
      alert('Please fill in all required fields');
      return;
    }

    const dateKey = getDateKey(formData.date);

    const newTask = {
      id: Date.now(),
      title: formData.title,
      date: formData.date,
      courseCode: formData.courseCode,
      type: formData.type,
      weight: formData.weight + '%',
      completed: false,
      grade: '',
    };

    if (formData.type === 'Homework') {
      newTask.description = formData.description;
    } else {
      newTask.topics = formData.topics.split(',').map((t) => t.trim());
    }

    setGroups((prevGroups) => {
      const groupIndex = prevGroups.findIndex((g) => g.date === dateKey);

      if (groupIndex > -1) {
        // Add task to existing group
        const updatedGroups = [...prevGroups];
        const groupTasks = [...updatedGroups[groupIndex].tasks]; // Copy tasks array
        groupTasks.push(newTask); // Add new task
        updatedGroups[groupIndex] = {
          ...updatedGroups[groupIndex],
          tasks: groupTasks,
        };
        return updatedGroups;
      }

      // Add new group with the new task
      return [...prevGroups, { date: dateKey, tasks: [newTask] }];
    });

    setShowForm(false);
    setFormData({
      title: '',
      date: '',
      courseCode: '',
      type: 'Homework',
      description: '',
      topics: '',
      weight: '',
    });
  };

  const renderTasks = (completedStatus) => {
    const renderedGroups = [];

    for (const group of groups) {
      const tasks = group.tasks.filter((task) => task.completed === completedStatus);
      if (tasks.length === 0) continue;

      renderedGroups.push(
        <div key={group.date} className="group-container">
          <h2 className="group-date">{formatDisplayDate(group.date)}</h2>
          <div className="tasks-grid">
            {tasks.map((task) => (
              <EventCard
                key={task.id}
                task={task}
                onToggle={!completedStatus ? () => toggleComplete(group.date, task.id) : undefined}
                onSetGrade={completedStatus ? () => setGrade(group.date, task.id) : undefined}
              />
            ))}
          </div>
        </div>
      );
    }

    // If no groups were rendered, show a default message
    if (renderedGroups.length === 0) {
      return <p className="no-tasks">No tasks to show here!</p>;
    }

    return renderedGroups;
  };

  return (
    <>
      <div className="event-tabs-container">
        <div className="tabs-header">
          <button
            onClick={() => setActiveTab('home')}
            className={`tab-button ${activeTab === 'home' ? 'tab-active' : 'tab-inactive'}`}
          >
            My Events
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`tab-button ${activeTab === 'completed' ? 'tab-active' : 'tab-inactive'}`}
          >
            Completed Events
          </button>
        </div>

        <div className="tab-content" hidden={activeTab !== 'home'}>
          {activeTab === 'home' && renderTasks(false)}
        </div>

        <div className="tab-content" hidden={activeTab !== 'completed'}>
          {activeTab === 'completed' && renderTasks(true)}
        </div>
      </div>

      {activeTab === 'home' && (
        <div className="icon-bar">
          <button onClick={() => setShowForm(true)}>
            <Plus size={20} />
          </button>
          <button>
            <Settings size={20} />
          </button>
        </div>
      )}

      {showForm && (
        <div className="form-modal">
          <div className="form-content">
            <button className="close-button" onClick={() => setShowForm(false)}>
              <X size={24} />
            </button>
            <h2>Add New Event</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Course Code *</label>
                <input
                  type="text"
                  value={formData.courseCode}
                  onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Weight (%) *</label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Homework">Homework</option>
                  <option value="Study Session">Study Session</option>
                </select>
              </div>

              {formData.type === 'Homework' ? (
                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
              ) : (
                <div className="form-group">
                  <label>Topics (comma-separated) *</label>
                  <input
                    type="text"
                    value={formData.topics}
                    onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                    required
                  />
                </div>
              )}

              <button type="submit" className="submit-button">
                Add Event
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default EventTabs;
