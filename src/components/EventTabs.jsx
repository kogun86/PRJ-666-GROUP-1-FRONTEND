import React, { useState } from 'react';
import EventCard from './EventCard';
import { Settings, Plus, X } from 'lucide-react';

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

  const [groups, setGroups] = useState([
    {
      date: 'Wednesday 02.12',
      tasks: [
        {
          id: 1,
          title: 'Workshop 3',
          dueDate: '02.12',
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
          date: '02.12',
          weight: '20%',
          courseCode: 'DB8501',
          type: 'Study Session',
          color: 'blue',
          topics: ['Explicit cursors', 'Variables', 'Loops'],
          completed: true,
          grade: '',
        },
      ],
    },
    {
      date: 'Thursday 02.13',
      tasks: [
        {
          id: 3,
          title: 'Advanced Database Topics',
          date: '02.13',
          weight: '24%',
          courseCode: 'DB8501',
          type: 'Study Session',
          topics: ['Stored Procedures', 'Triggers', 'Indexing'],
          completed: false,
          grade: '',
        },
      ],
    },
  ]);

  const toggleComplete = (groupId, taskId) => {
    const updatedGroups = groups.map((group) => {
      if (group.date === groupId) {
        return {
          ...group,
          tasks: group.tasks.map((task) =>
            task.id === taskId && !task.completed ? { ...task, completed: true } : task
          ),
        };
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
          return {
            ...group,
            tasks: group.tasks.map((task) =>
              task.id === taskId && task.completed ? { ...task, grade: grade.trim() } : task
            ),
          };
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

    const groupDate = formatGroupDate(formData.date);
    const datePart = formatDatePart(formData.date);

    const newTask = {
      id: Date.now(),
      title: formData.title,
      courseCode: formData.courseCode,
      type: formData.type,
      weight: formData.weight + '%',
      completed: false,
      grade: '',
    };

    if (formData.type === 'Homework') {
      newTask.dueDate = datePart;
      newTask.description = formData.description;
    } else {
      newTask.date = datePart;

      newTask.topics = formData.topics.split(',').map((t) => t.trim());
    }

    setGroups((prevGroups) => {
      const groupIndex = prevGroups.findIndex((g) => g.date === groupDate);
      if (groupIndex > -1) {
        const updatedGroups = [...prevGroups];
        updatedGroups[groupIndex].tasks.push(newTask);
        return updatedGroups;
      }
      return [...prevGroups, { date: groupDate, tasks: [newTask] }];
    });

    setShowForm(false);
    setFormData({
      title: '',
      date: '',
      courseCode: '',
      type: 'Homework',
      description: '',
      topics: '',
      weight: '', // ✅ reset weight
    });
  };

  const formatGroupDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString('en-US', {
        weekday: 'long',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/,/g, '');
  };

  const formatDatePart = (dateString) => {
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
  };

  const renderTasks = (completedStatus) =>
    groups.map((group) => {
      const filteredTasks = group.tasks.filter((task) => task.completed === completedStatus);
      if (filteredTasks.length === 0) return null;

      return (
        <div key={group.date} className="group-container">
          <h2 className="group-date">{group.date}</h2>
          <div className="tasks-grid">
            {filteredTasks.map((task) => (
              <EventCard
                key={task.id}
                task={task}
                onToggle={
                  completedStatus === false ? () => toggleComplete(group.date, task.id) : undefined
                }
                onSetGrade={
                  completedStatus === true ? () => setGrade(group.date, task.id) : undefined
                }
              />
            ))}
          </div>
        </div>
      );
    });

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
                <>
                  <div className="form-group">
                    <label>Topics (comma-separated) *</label>
                    <input
                      type="text"
                      value={formData.topics}
                      onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                      required
                    />
                  </div>
                </>
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
