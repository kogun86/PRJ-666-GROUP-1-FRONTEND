import Layout from '../components/Layout';

export default function Courses() {
  const courses = [
    {
      id: 1,
      name: 'Web Development',
      instructor: 'Dr. Smith',
      schedule: 'Mon/Wed 10:00 AM',
      progress: 75,
    },
    {
      id: 2,
      name: 'Database Systems',
      instructor: 'Prof. Johnson',
      schedule: 'Tue/Thu 2:00 PM',
      progress: 60,
    },
    {
      id: 3,
      name: 'Software Engineering',
      instructor: 'Dr. Williams',
      schedule: 'Fri 1:00 PM',
      progress: 90,
    },
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">My Courses</h1>
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{course.name}</h2>
                  <p className="text-gray-600">Instructor: {course.instructor}</p>
                  <p className="text-gray-600">Schedule: {course.schedule}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Progress</div>
                  <div className="text-lg font-semibold">{course.progress}%</div>
                </div>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
