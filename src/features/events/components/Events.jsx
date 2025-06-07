import { useState, useEffect } from 'react';
import EventForm from '@/components/EventForm';
import EventCompleted from '@/components/EventCompleted';
import EventPending from '@/components/EventPending';
import { Settings, Plus, RefreshCw } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import EventsLoading from './EventsLoading';
import EventsError from './EventsError';

export default function Events() {
  const [activeTab, setActiveTab] = useState('home');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null);
  const [formError, setFormError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { pendingGroups, completedGroups, loading, error, addEvent, fetchPending, fetchCompleted } =
    useEvents();

  // Fetch pending events when component mounts
  useEffect(() => {
    handleFetchPending();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'home') {
      handleFetchPending();
    } else if (tab === 'completed') {
      handleFetchCompleted();
    }
  };

  const handleFetchPending = async () => {
    setRefreshing(true);
    await fetchPending();
    setRefreshing(false);
  };

  const handleFetchCompleted = async () => {
    setRefreshing(true);
    await fetchCompleted();
    setRefreshing(false);
  };

  const handleFormSubmit = async (data) => {
    setFormError(null);
    const success = await addEvent(data);

    if (success) {
      setShowForm(false);
      setFormData(null);
      // Refresh pending events after adding a new one
      handleFetchPending();
    } else {
      setFormError('Failed to create event. Please try again.');
    }
  };

  if (loading && !refreshing) {
    return <EventsLoading />;
  }

  if (error && !refreshing) {
    return <EventsError message={error} />;
  }

  const currentGroups = activeTab === 'home' ? pendingGroups : completedGroups;

  return (
    <>
      <div className="events-tabs-container">
        <div className="events-tabs-header">
          <button
            onClick={() => handleTabChange('home')}
            className={`events-tab-button ${activeTab === 'home' ? 'events-tab-active' : 'events-tab-inactive'}`}
          >
            My Events
          </button>
          <button
            onClick={() => handleTabChange('completed')}
            className={`events-tab-button ${activeTab === 'completed' ? 'events-tab-active' : 'events-tab-inactive'}`}
          >
            Completed Events
          </button>
        </div>

        <div className="events-tab-content" hidden={activeTab !== 'home'}>
          {refreshing ? (
            <div className="loading-indicator">Refreshing events...</div>
          ) : (
            <EventPending groups={pendingGroups} />
          )}
        </div>

        <div className="events-tab-content" hidden={activeTab !== 'completed'}>
          {refreshing ? (
            <div className="loading-indicator">Refreshing events...</div>
          ) : (
            <EventCompleted groups={completedGroups} />
          )}
        </div>
      </div>

      {activeTab === 'home' && (
        <div className="events-icon-bar">
          <button onClick={() => setShowForm(true)} title="Add new event">
            <Plus size={20} />
          </button>
          <button
            onClick={activeTab === 'home' ? handleFetchPending : handleFetchCompleted}
            title="Refresh events"
            disabled={refreshing}
          >
            <RefreshCw size={20} className={refreshing ? 'icon-spin' : ''} />
          </button>
          <button title="Settings">
            <Settings size={20} />
          </button>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            {formError && <div className="form-error-message">{formError}</div>}
            <EventForm
              initialData={formData}
              onSubmit={handleFormSubmit}
              onCancel={() => {
                setShowForm(false);
                setFormData(null);
                setFormError(null);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
