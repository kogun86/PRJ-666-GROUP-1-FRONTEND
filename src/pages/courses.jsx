import React, { useState } from 'react';
import Layout from '../components/Layout';
import CourseForm from '../components/CourseForm';
import WeeklyClassesView from '../components/WeeklyClassesView';

const tabList = ['My Classes', 'My Courses'];

const CoursesPage = () => {
  const [activeTab, setActiveTab] = useState('My Classes');

  return (
    <Layout>
      <div className="profile-container">
        <div className="profile-card">
          {/* top tab bar */}
          <div className="profile-action-row" style={{ justifyContent: 'center' }}>
            {tabList.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 2 tabs i've created classes and courses! */}
          <div className="profile-content">
            {activeTab === 'My Classes' && <WeeklyClassesView />}
            {activeTab === 'My Courses' && <CourseForm onSubmit={(data) => console.log(data)} />}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CoursesPage;
