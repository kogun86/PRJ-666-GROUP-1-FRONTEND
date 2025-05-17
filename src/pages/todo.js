import Layout from '../components/Layout';

export default function Todo() {
  const todos = [
    {
      id: 1,
      title: 'Complete Web Development Assignment',
      dueDate: '2024-03-20',
      priority: 'High',
      completed: false,
    },
    {
      id: 2,
      title: 'Prepare for Database Quiz',
      dueDate: '2024-03-22',
      priority: 'Medium',
      completed: false,
    },
    {
      id: 3,
      title: 'Submit Project Proposal',
      dueDate: '2024-03-25',
      priority: 'High',
      completed: true,
    },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Todo List</h1>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Add Task
          </button>
        </div>
        <div className="space-y-4">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`bg-white p-6 rounded-lg shadow ${todo.completed ? 'opacity-75' : ''}`}
            >
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2
                      className={`text-xl font-semibold ${
                        todo.completed ? 'line-through text-gray-500' : ''
                      }`}
                    >
                      {todo.title}
                    </h2>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        todo.priority === 'High'
                          ? 'bg-red-100 text-red-800'
                          : todo.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {todo.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">Due: {todo.dueDate}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
