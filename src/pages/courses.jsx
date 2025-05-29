import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import CourseForm from '../components/CourseForm';

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState('My Classes');
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [myCourses, setMyCourses] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoursesAndClasses = async () => {
      try {
        const courseRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses?active=true`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        if (!courseRes.ok) throw new Error(`HTTP error! status: ${courseRes.status}`);
        const courseData = await courseRes.json();

        const courses = courseData.courses || [];
        const fetchedCourses = courses.map((course) => ({
          title: course.title,
          code: course.code,
          professor: course.instructor.name,
          color: '#cad2c5',
          grade: 0,
          schedule: course.schedule.map((s) => ({
            time: `${secondsToTime(s.startTime)}–${secondsToTime(s.endTime)}`,
            weekDay: getWeekday(s.weekday),
          })),
        }));

        setMyCourses(fetchedCourses);

        const classRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes`, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        if (!classRes.ok) throw new Error(`HTTP error! status: ${classRes.status}`);
        const classData = await classRes.json();

        const classSessions = transformClasses(classData.classes, courses);
        setClassesData(classSessions);
      } catch (err) {
        console.error('Failed to fetch courses or classes', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesAndClasses();
  }, []);

  function transformClasses(classes, courses) {
    const courseMap = {};
    courses.forEach((c) => {
      courseMap[c._id] = {
        title: c.title,
        code: c.code,
        professor: c.instructor.name,
        color: '#84a98c',
      };
    });

    const dayMap = {};
    classes.forEach((cls) => {
      const start = new Date(cls.startTime);
      const dateStr = start.toLocaleDateString('en-US', {
        weekday: 'long',
        month: '2-digit',
        day: '2-digit',
      });

      if (!dayMap[dateStr]) {
        dayMap[dateStr] = [];
      }

      const courseInfo = courseMap[cls.courseId] || {};
      dayMap[dateStr].push({
        from: start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }),
        until: new Date(cls.endTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'UTC',
        }),

        room: 'TBD',
        type: cls.classType,
        code: courseInfo.code,
        section: 'A',
        professor: courseInfo.professor,
        events: '',
        color: courseInfo.color,
      });
    });

    return Object.entries(dayMap).map(([date, sessions]) => ({ date, sessions }));
  }

  function getWeekday(index) {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][index];
  }

  function secondsToTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  function handleAdd() {
    setEditData(null);
    setEditIndex(null);
    setShowForm(true);
  }

  function handleEdit(course, index) {
    const initialFormData = {
      name: course.title,
      code: course.code,
      professor: course.professor,
      color: course.color,
      schedule: course.schedule.map((s) => {
        const [startTime, endTime] = s.time.split('–');
        return { day: s.weekDay, startTime, endTime };
      }),
    };
    setEditData(initialFormData);
    setEditIndex(index);
    setShowForm(true);
  }

  function handleDelete(index) {
    setMyCourses((cs) => cs.filter((_, i) => i !== index));
    if (editIndex === index) handleCancel();
  }

  function handleSubmit(data) {
    const mapped = {
      title: data.name,
      code: data.code,
      professor: data.professor,
      color: data.color,
      grade: editIndex != null ? myCourses[editIndex].grade : 0,
      schedule: data.schedule.map((s) => ({
        time: `${s.startTime}–${s.endTime}`,
        weekDay: s.day,
      })),
    };

    if (editIndex != null) {
      setMyCourses((cs) => cs.map((c, i) => (i === editIndex ? mapped : c)));
    } else {
      setMyCourses((cs) => [...cs, mapped]);
    }

    handleCancel();
  }

  function handleCancel() {
    setShowForm(false);
    setEditData(null);
    setEditIndex(null);
  }

  const tabs = ['My Classes', 'My Courses'];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="courses-container">
          <div className="profile-card">
            <div className="profile-action-row tabs-bar">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setShowForm(false);
                  }}
                  className={`profile-button ${activeTab === tab ? 'active' : ''}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'My Courses' && !showForm && (
              <div className="add-course-row">
                <button className="button button-primary add-course-button" onClick={handleAdd}>
                  + Add Course
                </button>
              </div>
            )}

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="profile-content mt-4">
                {activeTab === 'My Classes' &&
                  classesData.map(({ date, sessions }) => (
                    <div key={date} className="class-group">
                      <h4 className="class-group-title">{date}</h4>
                      <div className="session-container">
                        {sessions.map((s, idx) => (
                          <div
                            key={`${s.code}-${idx}`}
                            className={`session-card${
                              s.color === 'var(--color-destructive)'
                                ? ' session-card--light-text'
                                : ''
                            }`}
                            style={{ backgroundColor: s.color }}
                          >
                            <h5 className="session-title">{s.title}</h5>
                            <div>
                              <strong>From:</strong> {s.from}
                            </div>
                            <div>
                              <strong>Until:</strong> {s.until}
                            </div>
                            <div>
                              <strong>Room:</strong> {s.room}
                            </div>
                            <div>
                              <strong>Type:</strong> {s.type}
                            </div>
                            <div>
                              <strong>Code:</strong> {s.code}
                            </div>
                            <div>
                              <strong>Section:</strong> {s.section}
                            </div>
                            <div>
                              <strong>Professor:</strong> {s.professor}
                            </div>
                            {s.events && (
                              <div>
                                <strong>Events:</strong> {s.events}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                {activeTab === 'My Courses' && (
                  <>
                    {showForm && (
                      <div className="modal-overlay">
                        <div className="modal">
                          <CourseForm
                            initialData={editData}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                          />
                        </div>
                      </div>
                    )}

                    <div className="courses-list">
                      {myCourses.map((c, idx) => (
                        <div
                          key={`${c.code}-${idx}`}
                          className="course-card"
                          style={{ backgroundColor: c.color }}
                        >
                          <div className="course-actions">
                            <button
                              className="edit-course-button"
                              onClick={() => handleEdit(c, idx)}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-course-button"
                              onClick={() => handleDelete(idx)}
                            >
                              Delete
                            </button>
                          </div>
                          <h3 className="course-name">{c.title}</h3>
                          <div className="course-info">
                            <div>
                              <strong>Code:</strong> {c.code}
                            </div>
                            <div>
                              <strong>Professor:</strong> {c.professor}
                            </div>
                          </div>
                          <h4 className="schedule-heading">Schedule</h4>
                          {c.schedule.map((s, i) => (
                            <div key={i} className="schedule-item">
                              <div>
                                <strong>Time:</strong> {s.time}
                              </div>
                              <div>
                                <strong>Day:</strong> {s.weekDay}
                              </div>
                            </div>
                          ))}
                          <div className="course-grade">
                            <strong>Current grade:</strong> {c.grade}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
