import { useState } from 'react';
import { deleteEvent } from '../services/eventService';

export function useEventDelete() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteEventById = async (eventId) => {
    console.log('🗑️ Starting event deletion for ID:', eventId);
    setIsDeleting(true);
    setError(null);
    setSuccess(false); // Reset success state at the beginning

    try {
      // Validate eventId
      if (!eventId) {
        console.error('EventID is null or undefined');
        throw new Error('Invalid event ID: Cannot be null or undefined');
      }

      console.log('deleteEventById called with eventId:', eventId);

      // Call the API to delete the event
      await deleteEvent(eventId);

      console.log('🗑️ Event deleted successfully:', eventId);
      setSuccess(true);
      return { success: true };
    } catch (err) {
      console.error('Failed to delete event:', err);
      setError(err.message || 'Failed to delete event');
      return { success: false, error: err.message || 'Failed to delete event' };
    } finally {
      setIsDeleting(false);
      console.log(
        '🗑️ Event deletion process complete, isDeleting set to false, success state:',
        success
      );
    }
  };

  // Helper function to delete event with confirmation
  const confirmEventDelete = (eventId, eventInfo = {}) => {
    return {
      title: 'Delete Event',
      message: `Are you sure you want to delete "${eventInfo.title || 'this event'}"? This action cannot be undone.`,
      onConfirm: () => deleteEventById(eventId),
      confirmText: 'Delete',
      cancelText: 'Cancel',
    };
  };

  return {
    deleteEventById,
    confirmEventDelete,
    isDeleting,
    error,
    success,
    resetState: () => {
      console.log('🔄 Resetting event deletion state');
      setError(null);
      setSuccess(false);
    },
  };
}
