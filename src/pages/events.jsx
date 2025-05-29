import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { apiRequest } from '../lib/api.js';
import { useAuth } from '../features/auth/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import EventForm from '@/components/EventForm';
import EventCompleted from '@/components/EventCompleted';
import EventPending from '@/components/EventPending';
import { Settings, Plus, X } from 'lucide-react';

const getDateKey = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

export default function Events() {
  const { user, isProduction } = useAuth();
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (!user) return;

    if (isProduction) {
      apiRequest('/v1/events/upcoming', {}, user)
        .then((data) => setEvents(data.events || []))
        .catch(console.error);
    } else {
      setEvents();
    }
  }, [user, isProduction]);

  const initialTasks = [
    {
      id: 1,
      title: 'Workshop 3',
      dueDate: '2025-12-02',
      weight: 4,
      courseCode: 'APD545',
      type: 'Study Session',
      description: 'saddsadsadsadsadsa.',
      isCompleted: false,
      grade: null,
    },
    {
      id: 11,
      title: 'Workshop 3',
      dueDate: '2025-12-02',
      weight: 4,
      courseCode: 'APD545',
      type: 'Study Session',
      description: 'saddsadsadsadsadsa.',
      isCompleted: false,
      grade: null,
    },
    {
      id: 2,
      title: 'Workshop 3',
      dueDate: '2025-12-02',
      weight: 4,
      courseCode: 'APD545',
      type: 'Study Session',
      description: 'Lorem ipsum dolor sit amet.',
      isCompleted: false,
      grade: null,
    },
    {
      id: 3,
      title: 'Prepare for Test 2',
      dueDate: '2025-12-02',
      weight: 20,
      courseCode: 'DB8501',
      type: 'Study Session',
      description: 'Study notes and review chapters 3-6.',
      isCompleted: false,
      grade: null,
    },
    {
      id: 4,
      title: 'Assignment 1',
      dueDate: '2025-12-03',
      weight: 15,
      courseCode: 'DB8501',
      type: 'Homework',
      description: 'Complete ER diagram and normalization.',
      isCompleted: false,
      grade: null,
    },
  ];

  const groupTasksByDate = (tasks) => {
    const groups = {};
    tasks.forEach((task) => {
      const dateKey = getDateKey(task.dueDate);
      if (!groups[dateKey]) {
        groups[dateKey] = { date: dateKey, tasks: [] };
      }
      groups[dateKey].tasks.push(task);
    });
    return Object.values(groups);
  };

  const [groups, setGroups] = useState(groupTasksByDate(initialTasks));

  const handleFormSubmit = (data) => {
    const dateKey = getDateKey(data.date);
    const newTask = {
      id: Date.now(),
      title: data.title,
      dueDate: data.date,
      courseCode: data.courseCode,
      type: data.type,
      weight: Number(data.weight),
      description: data.description,
      isCompleted: false,
      grade: '0',
    };

    setGroups((prevGroups) => {
      const groupIndex = prevGroups.findIndex((g) => g.date === dateKey);
      if (groupIndex > -1) {
        const updatedGroups = [...prevGroups];
        updatedGroups[groupIndex].tasks.push(newTask);
        return updatedGroups;
      }
      return [...prevGroups, { date: dateKey, tasks: [newTask] }];
    });

    setShowForm(false);
    setFormData(null);
  };

  return (
    <>
      <ProtectedRoute>
        <Layout>
          <div className="events-tabs-container">
            <div className="events-tabs-header">
              <button
                onClick={() => setActiveTab('home')}
                className={`events-tab-button ${activeTab === 'home' ? 'events-tab-active' : 'events-tab-inactive'}`}
              >
                My Events
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`events-tab-button ${activeTab === 'completed' ? 'events-tab-active' : 'events-tab-inactive'}`}
              >
                Completed Events
              </button>
            </div>

            <div className="events-tab-content" hidden={activeTab !== 'home'}>
              <EventPending groups={groups} setGroups={setGroups} />
            </div>

            <div className="events-tab-content" hidden={activeTab !== 'completed'}>
              <EventCompleted groups={groups} setGroups={setGroups} />
            </div>
          </div>

          {activeTab === 'home' && (
            <div className="events-icon-bar">
              <button onClick={() => setShowForm(true)}>
                <Plus size={20} />
              </button>
              <button>
                <Settings size={20} />
              </button>
            </div>
          )}

          {showForm && (
            <div className="modal-overlay">
              <div className="modal">
                <EventForm
                  initialData={formData}
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setFormData(null);
                  }}
                />
              </div>
            </div>
          )}
        </Layout>
      </ProtectedRoute>
    </>
  );
}
