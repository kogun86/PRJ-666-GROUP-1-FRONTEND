import Layout from '../components/Layout';

export default function Goals() {
  const goals = [
    {
      id: 1,
      title: 'Maintain 3.8 GPA',
      category: 'Academic',
      deadline: '2024-12-31',
      progress: 85,
      status: 'In Progress',
    },
    {
      id: 2,
      title: 'Complete Internship',
      category: 'Career',
      deadline: '2024-08-31',
      progress: 60,
      status: 'In Progress',
    },
    {
      id: 3,
      title: 'Learn React Native',
      category: 'Skills',
      deadline: '2024-06-30',
      progress: 30,
      status: 'In Progress',
    },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">My Goals</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Add New Goal
          </button>
        </div>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-xl font-semibold">{goal.title}</h2>
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {goal.category}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">Deadline: {goal.deadline}</p>
                  <p className="text-gray-600">Status: {goal.status}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Progress</div>
                  <div className="text-lg font-semibold">{goal.progress}%</div>
                </div>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
