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

  // Fetch courses and classes from the backend
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
          professor: course.instructor?.name,
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
        professor: c.instructor?.name,
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

  function convertToSeconds(timeStr) {
    if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes(':')) {
      console.error('❌ Invalid time format:', timeStr);
      return 0;
    }
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60;
  }

  function handleAdd() {
    setEditData(null);
    setEditIndex(null);
    setShowForm(true);
  }

  function handleSubmit(data) {
    const weekDayToIndex = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };

    if (
      !data.title ||
      !data.code ||
      !data.startDate ||
      !data.endDate ||
      !data.instructor?.name ||
      !data.instructor?.email ||
      !data.instructor?.availableTimeSlots?.length ||
      !data.schedule?.length
    ) {
      alert('All fields are required.');
      return;
    }

    const newCourse = {
      userId: '1234',
      title: data.title,
      code: data.code,
      status: 'active',
      startDate: data.startDate,
      endDate: data.endDate,
      instructor: {
        name: data.instructor.name,
        email: data.instructor.email,
        availableTimeSlots: data.instructor.availableTimeSlots.map((s) => ({
          weekday: typeof s.weekday === 'number' ? s.weekday : weekDayToIndex[s.day],
          startTime: convertToSeconds(s.startTime),
          endTime: convertToSeconds(s.endTime),
        })),
      },
      schedule: data.schedule.map((s, idx) => ({
        classType: s.classType || (idx === 0 ? 'lecture' : 'lab'),
        weekday: typeof s.weekday === 'number' ? s.weekday : weekDayToIndex[s.day],
        startTime: convertToSeconds(s.startTime),
        endTime: convertToSeconds(s.endTime),
      })),
    };

    console.log('📤 Submitting course to backend:', JSON.stringify(newCourse, null, 2));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_TOKEN}`,
      },
      body: JSON.stringify(newCourse),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          console.error('❌ Server responded with:', errorText);
          console.error('📤 Payload was:', JSON.stringify(newCourse, null, 2));
          throw new Error(`Failed to create course: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        console.log('✅ Course created:', result);
        setMyCourses((prev) => [
          ...prev,
          {
            title: newCourse.title,
            code: newCourse.code,
            professor: newCourse.instructor.name,
            grade: 0,
            schedule: data.schedule.map((s) => ({
              time: `${s.startTime}–${s.endTime}`,
              weekDay: s.day,
            })),
          },
        ]);
        setShowForm(false);
      })
      .catch((err) => {
        console.error('Error creating course:', err);
        alert('Failed to create course.');
      });
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="courses-container">
          <div className="profile-card">
            <div className="profile-action-row tabs-bar">
              {['My Classes', 'My Courses'].map((tab) => (
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
                            className="session-card"
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
                            onCancel={() => setShowForm(false)}
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
                              onClick={() => {
                                setEditData(c);
                                setEditIndex(idx);
                                setShowForm(true);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-course-button"
                              onClick={() => setMyCourses((cs) => cs.filter((_, i) => i !== idx))}
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
