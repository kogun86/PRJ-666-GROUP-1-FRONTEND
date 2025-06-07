export { useEvents } from './hooks/useEvents';
export { useCourses } from './hooks/useCourses';
export { default as Events } from './components/Events';
export {
  fetchUpcomingEvents,
  fetchPendingEvents,
  fetchCompletedEvents,
  fetchCourses,
  createEvent,
  updateEventStatus,
} from './services/eventService';
