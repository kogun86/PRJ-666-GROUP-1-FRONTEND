import { LoadingAnimation } from '../../animations';

export default function EventsLoading() {
  return (
    <div className="events-loading">
      <LoadingAnimation size="large" />
      <p className="events-loading-text">Loading events...</p>
    </div>
  );
}
