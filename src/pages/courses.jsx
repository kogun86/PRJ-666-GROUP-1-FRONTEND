import React, { useState } from 'react';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

const CoursesPage = () => {
  const [activeTab, setActiveTab] = useState('My Classes');
  const tabs = ['My Classes', 'My Courses'];

  return (
    <ProtectedRoute>
      <Layout>
        <div className="profile-container">
          <div className="profile-card">
            {/*   tab bar  */}
            <div className="profile-action-row tabs-bar">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`profile-button ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Swap-out placeholder content */}
            <div className="profile-content mt-4">
              {activeTab === 'My Courses' && (
                <ul className="courses-list">
                  <li className="course-card">
                    <div className="course-header">
                      <div className="course-info">
                        <div className="course-name">Introduction to Programming</div>
                        <div className="course-instructor">Instructor: Prof. Smith</div>
                        <div className="course-schedule">Tue &amp; Thu · 10:00–11:15 AM</div>
                      </div>
                    </div>
                  </li>
                  <li className="course-card">
                    <div className="course-header">
                      <div className="course-info">
                        <div className="course-name">Data Structures</div>
                        <div className="course-instructor">Instructor: Dr. Jones</div>
                        <div className="course-schedule">Mon &amp; Wed · 1:00–2:15 PM</div>
                      </div>
                    </div>
                  </li>
                  <li className="course-card">
                    <div className="course-header">
                      <div className="course-info">
                        <div className="course-name">Web Development</div>
                        <div className="course-instructor">Instructor: Ms. Lee</div>
                        <div className="course-schedule">Fri · 9:00–12:00 PM</div>
                      </div>
                    </div>
                  </li>
                </ul>
              )}
              {activeTab === 'My Classes' && (
                <ul className="courses-list">
                  <li className="course-card">
                    <div className="course-header">
                      <div className="course-info">
                        <div className="course-name">Algorithms Lab</div>
                        <div className="course-instructor">Instructor: Dr. Nguyen</div>
                        <div className="course-schedule">Wed · 2:00–4:00 PM</div>
                      </div>
                    </div>
                  </li>
                  <li className="course-card">
                    <div className="course-header">
                      <div className="course-info">
                        <div className="course-name">Operating Systems</div>
                        <div className="course-instructor">Instructor: Dr. Patel</div>
                        <div className="course-schedule">Tue &amp; Thu · 3:00–4:30 PM</div>
                      </div>
                    </div>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CoursesPage;
