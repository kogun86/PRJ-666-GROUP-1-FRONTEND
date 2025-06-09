import { useState, useEffect } from 'react';
import EventForm from '@/features/events/components/EventForm';
import EventCompleted from '@/features/events/components/EventCompleted';
import EventPending from '@/features/events/components/EventPending';
import { Settings, Plus, RefreshCw } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import EventsLoading from './EventsLoading';
import EventsError from './EventsError';
import AIChatWindow from '../../../components/AIChatWindow';
import Modal from '../../../components/Modal';
import { LoadingAnimation } from '../../../components/ui';
import TabsBar from '../../../components/TabsBar';

// Define tab constants for better readability
const TABS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
};

// Define tab display names
const TAB_LABELS = {
  [TABS.PENDING]: 'My Events',
  [TABS.COMPLETED]: 'Completed Events',
};

export default function Events() {
  const [activeTab, setActiveTab] = useState(TABS.PENDING);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null);
  const [formError, setFormError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { pendingGroups, completedGroups, loading, error, addEvent, fetchPending, fetchCompleted } =
    useEvents();

  // Fetch pending events when component mounts
  useEffect(() => {
    handleFetchPending();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === TABS.PENDING) {
      handleFetchPending();
    } else if (tab === TABS.COMPLETED) {
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
    setIsSubmitting(true);

    try {
      const success = await addEvent(data);

      if (success) {
        setShowForm(false);
        setFormData(null);
        // Refresh pending events after adding a new one
        handleFetchPending();
      } else {
        setFormError('Failed to create event. Please try again.');
      }
    } catch (err) {
      setFormError('An error occurred. Please try again.');
      console.error('Error submitting event:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !refreshing) {
    return <EventsLoading />;
  }

  if (error && !refreshing) {
    return <EventsError message={error} />;
  }

  const currentGroups = activeTab === TABS.PENDING ? pendingGroups : completedGroups;

  return (
    <>
      <div className="events-tabs-container">
        <div className="profile-card">
          <TabsBar
            tabs={[
              { id: TABS.PENDING, label: TAB_LABELS[TABS.PENDING] },
              { id: TABS.COMPLETED, label: TAB_LABELS[TABS.COMPLETED] },
            ]}
            activeTab={activeTab}
            onTabChange={handleTabChange}
            className="events-tabs-header"
          />

          {!showForm && (
            <div className="add-course-row">
              <button
                className="button button-primary add-course-button"
                onClick={() => setShowForm(true)}
              >
                + Add Event
              </button>
            </div>
          )}

          <div className="events-tab-content" hidden={activeTab !== TABS.PENDING}>
            {refreshing ? (
              <div className="events-refreshing">
                <LoadingAnimation size="large" />
                <p className="events-refreshing-text">Refreshing events...</p>
              </div>
            ) : (
              <EventPending groups={pendingGroups} />
            )}
          </div>

          <div className="events-tab-content" hidden={activeTab !== TABS.COMPLETED}>
            {refreshing ? (
              <div className="events-refreshing">
                <LoadingAnimation size="large" />
                <p className="events-refreshing-text">Refreshing events...</p>
              </div>
            ) : (
              <EventCompleted groups={completedGroups} />
            )}
          </div>
        </div>
        {/* AI Chat Window */}
        <AIChatWindow />
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => {
          if (!isSubmitting) {
            setShowForm(false);
            setFormData(null);
            setFormError(null);
          }
        }}
        title="Add Event"
      >
        {formError && <div className="modal-error">{formError}</div>}
        <EventForm
          initialData={formData}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            if (!isSubmitting) {
              setShowForm(false);
              setFormData(null);
              setFormError(null);
            }
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </>
  );
}
