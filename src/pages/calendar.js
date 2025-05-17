import Layout from '../components/Layout';

export default function Calendar() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Calendar</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: 35 }, (_, i) => (
              <div
                key={i}
                className="aspect-square border rounded-lg p-2 hover:bg-gray-50 cursor-pointer"
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
