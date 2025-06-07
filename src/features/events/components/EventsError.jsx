export default function EventsError({ message }) {
  return (
    <div className="events-error">
      <p>Error: {message || 'Something went wrong'}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
}
