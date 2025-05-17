import Layout from '../components/Layout';

export default function Events() {
  const events = [
    {
      id: 1,
      title: 'Career Fair',
      date: '2024-03-15',
      time: '10:00 AM - 2:00 PM',
      location: 'Main Campus Hall',
      description: 'Annual career fair with top tech companies.',
    },
    {
      id: 2,
      title: 'Hackathon',
      date: '2024-03-20',
      time: '9:00 AM - 9:00 PM',
      location: 'Engineering Building',
      description: '24-hour coding competition with prizes.',
    },
    {
      id: 3,
      title: 'Guest Lecture',
      date: '2024-03-25',
      time: '2:00 PM - 4:00 PM',
      location: 'Room 101',
      description: 'AI and Machine Learning in Modern Applications.',
    },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Upcoming Events</h1>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{event.title}</h2>
                  <p className="text-gray-600 mt-1">{event.description}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Date:</span> {event.date}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Time:</span> {event.time}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Location:</span> {event.location}
                    </p>
                  </div>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
