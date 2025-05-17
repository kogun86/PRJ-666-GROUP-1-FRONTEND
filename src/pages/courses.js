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
      <div className="courses-container">
        <h1 className="courses-title">My Courses</h1>
        <div className="courses-list">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-header">
                <div className="course-info">
                  <h2 className="course-name">{course.name}</h2>
                  <p className="course-instructor">Instructor: {course.instructor}</p>
                  <p className="course-schedule">Schedule: {course.schedule}</p>
                </div>
                <div className="course-progress-container">
                  <div className="course-progress-label">Progress</div>
                  <div className="course-progress-value">{course.progress}%</div>
                </div>
              </div>
              <div className="course-progress-bar-container">
                <div className="course-progress-bar" style={{ width: `${course.progress}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
