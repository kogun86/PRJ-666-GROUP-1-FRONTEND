import { useState, useEffect } from 'react';
import EventForm from '@/features/events/components/EventForm';
import EventCompleted from '@/features/events/components/EventCompleted';
import EventPending from '@/features/events/components/EventPending';
import { Settings, Plus, RefreshCw } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import EventsLoading from './EventsLoading';
import EventsError from './EventsError';
import AIChatWindow from '../../../componentShared/AIChatWindow';
import Modal from '../../../componentShared/Modal';
import { LoadingAnimation } from '../../animations';
import TabsBar from '../../../componentShared/TabsBar';

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

// Empty state component for events
const EmptyState = ({ type, onAddEvent }) => (
  <div className="empty-state">
    <p className="empty-state-message">
      {type === TABS.PENDING
        ? "You don't have any upcoming events scheduled."
        : "You don't have any completed events yet."}
    </p>
    {type === TABS.PENDING && (
      <button className="button button-primary add-course-button" onClick={onAddEvent}>
        + Add Your First Event
      </button>
    )}
  </div>
);

export default function Events() {
  const [activeTab, setActiveTab] = useState(TABS.PENDING);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(null);
  const [formError, setFormError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { pendingGroups, completedGroups, loading, error, addEvent, fetchPending, fetchCompleted } =
    useEvents();
  const [localPendingGroups, setLocalPendingGroups] = useState([]);
  const [localCompletedGroups, setLocalCompletedGroups] = useState([]);

  // Fetch pending events when component mounts
  useEffect(() => {
    handleFetchPending();
  }, []);

  // Sync localPendingGroups with pendingGroups when they change
  useEffect(() => {
    setLocalPendingGroups(pendingGroups);
  }, [pendingGroups]);

  // Sync localCompletedGroups with completedGroups when they change
  useEffect(() => {
    setLocalCompletedGroups(completedGroups);
  }, [completedGroups]);

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
  const hasEvents =
    activeTab === TABS.PENDING
      ? localPendingGroups && localPendingGroups.length > 0
      : localCompletedGroups && localCompletedGroups.length > 0;

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

          {!showForm && hasEvents && (
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
            ) : !hasEvents && activeTab === TABS.PENDING ? (
              <EmptyState type={TABS.PENDING} onAddEvent={() => setShowForm(true)} />
            ) : (
              <EventPending
                groups={localPendingGroups}
                onGroupsUpdate={(updatedGroups) => setLocalPendingGroups(updatedGroups)}
              />
            )}
          </div>

          <div className="events-tab-content" hidden={activeTab !== TABS.COMPLETED}>
            {refreshing ? (
              <div className="events-refreshing">
                <LoadingAnimation size="large" />
                <p className="events-refreshing-text">Refreshing events...</p>
              </div>
            ) : !hasEvents && activeTab === TABS.COMPLETED ? (
              <EmptyState type={TABS.COMPLETED} />
            ) : (
              <EventCompleted
                groups={localCompletedGroups}
                onGroupsUpdate={(updatedGroups) => setLocalCompletedGroups(updatedGroups)}
              />
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
