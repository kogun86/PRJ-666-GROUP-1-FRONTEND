import { useState } from 'react';
import EventForm from '@/components/EventForm';
import EventCompleted from '@/components/EventCompleted';
import EventPending from '@/components/EventPending';
import { Settings, Plus } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import EventsLoading from './EventsLoading';
import EventsError from './EventsError';

export default function Events() {
  const [activeTab, setActiveTab] = useState('home');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null);
  const [formError, setFormError] = useState(null);
  const { groups, setGroups, loading, error, addEvent } = useEvents();

  const handleFormSubmit = async (data) => {
    setFormError(null);
    const success = await addEvent(data);

    if (success) {
      setShowForm(false);
      setFormData(null);
    } else {
      setFormError('Failed to create event. Please try again.');
    }
  };

  if (loading) {
    return <EventsLoading />;
  }

  if (error) {
    return <EventsError message={error} />;
  }

  return (
    <>
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
