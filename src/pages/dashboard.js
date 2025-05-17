import Layout from '../components/Layout';

export default function Dashboard() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Statistics</h2>
            <p className="text-gray-600">Your dashboard statistics will appear here.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
            <p className="text-gray-600">Your recent activity will be displayed here.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
