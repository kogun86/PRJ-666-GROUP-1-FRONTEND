import React, { useState } from 'react';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import CourseForm from '../components/CourseForm';

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState('My Classes');
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  // turn30file1
  const [myCourses, setMyCourses] = useState([
    {
      title: 'Introduction to Programming',
      code: 'CS101',
      professor: 'Dr. Allen',
      color: 'var(--color-secondary)',
      grade: 92,
      schedule: [
        { time: 'Mon & Wed 9:00–10:15am', weekDay: 'Mon/Wed', room: 'C101', type: 'Lecture' },
      ],
    },
    {
      title: 'Data Structures',
      code: 'CS202',
      professor: 'Dr. Baker',
      color: 'var(--color-accent)',
      grade: 88,
      schedule: [
        { time: 'Tue & Thu 11:00–12:15pm', weekDay: 'Tue/Thu', room: 'B202', type: 'Lecture' },
      ],
    },
    {
      title: 'Algorithms Lab',
      code: 'CS303L',
      professor: 'Dr. Clark',
      color: 'var(--color-destructive)',
      grade: 95,
      schedule: [{ time: 'Wed 1:00–3:00pm', weekDay: 'Wed', room: 'Lab 3', type: 'Lab' }],
    },
    {
      title: 'Operating Systems',
      code: 'CS404',
      professor: 'Dr. Davis',
      color: 'var(--color-secondary)',
      grade: 90,
      schedule: [{ time: 'Thu 2:30–3:45pm', weekDay: 'Thu', room: 'D404', type: 'Lecture' }],
    },
  ]);

  // turn30file1
  const classesData = [
    {
      date: 'Monday 02.10',
      sessions: [
        {
          title: 'Introduction to Programming',
          from: '9:00am',
          until: '10:15am',
          room: 'C101',
          type: 'Lecture',
          code: 'CS101',
          section: 'A',
          professor: 'Dr. Allen',
          events: '',
          color: 'var(--color-secondary)',
        },
      ],
    },
    {
      date: 'Tuesday 02.11',
      sessions: [
        {
          title: 'Data Structures',
          from: '11:00am',
          until: '12:15pm',
          room: 'B202',
          type: 'Lecture',
          code: 'CS202',
          section: 'B',
          professor: 'Dr. Baker',
          events: '',
          color: 'var(--color-accent)',
        },
      ],
    },
    {
      date: 'Wednesday 02.12',
      sessions: [
        {
          title: 'Algorithms Lab',
          from: '1:00pm',
          until: '3:00pm',
          room: 'Lab 3',
          type: 'Lab',
          code: 'CS303L',
          section: 'C',
          professor: 'Dr. Clark',
          events: 'Quiz 1',
          color: 'var(--color-destructive)',
        },
      ],
    },
    {
      date: 'Thursday 02.13',
      sessions: [
        {
          title: 'Operating Systems',
          from: '2:30pm',
          until: '3:45pm',
          room: 'D404',
          type: 'Lecture',
          code: 'CS404',
          section: 'D',
          professor: 'Dr. Davis',
          events: '',
          color: 'var(--color-secondary)',
        },
      ],
    },
  ];

  const tabs = ['My Classes', 'My Courses'];

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleSubmit = (data) => {
    // map and append
    const newCourse = {
      title: data.name,
      code: data.code,
      professor: data.professor,
      color: data.color,
      grade: 0,
      schedule: data.schedule.map((s) => ({
        time: `${s.startTime}–${s.endTime}`,
        weekDay: s.day,
        room: '',
        type: '',
      })),
    };
    setMyCourses((c) => [...c, newCourse]);
    setShowForm(false);
  };

  const handleCancel = () => setShowForm(false);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="courses-container">
          <div className="profile-card">
            {/* ─── Tab bar + Add button ───────────────────────── */}
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

              {activeTab === 'My Courses' && !showForm && (
                <button
                  className="button button-primary add-course-button"
                  onClick={handleAdd}
                  aria-label="Add a new course"
                >
                  + Add Course
                </button>
              )}
            </div>

            {/* ─── Content ─────────────────────────────────────── */}
            <div className="profile-content mt-4">
              {/* My Classes */}
              {activeTab === 'My Classes' &&
                classesData.map(({ date, sessions }) => (
                  <div key={date} className="class-group">
                    <h4 className="class-group-title">{date}</h4>
                    <div className="session-container">
                      {sessions.map((s) => (
                        <div
                          key={s.code}
                          className={`session-card${s.color === 'var(--color-destructive)' ? ' session-card--light-text' : ''}`}
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

              {/* My Courses */}
              {activeTab === 'My Courses' && (
                <>
                  {/* Popup form */}
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
                    {myCourses.map((c) => (
                      <div
                        key={c.code}
                        className="course-card"
                        style={{ backgroundColor: c.color, color: 'var(--color-primary)' }}
                      >
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
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
