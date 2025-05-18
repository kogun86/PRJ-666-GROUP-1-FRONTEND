import React, { useState } from 'react';
import Layout from '../components/Layout';
import CourseForm from '../components/CourseForm';
import WeeklyClassesView from '../components/WeeklyClassesView';

const tabList = ['My Classes', 'My Courses', 'Past Classes', 'Archived Courses'];

const CoursesPage = () => {
  const [activeTab, setActiveTab] = useState('My Classes');

  return (
    <Layout>
      <div className="profile-container">
        <div className="profile-card">
          {/*  Tab Bar and it's styles and it being at the top!*/}
          <div
            className="profile-action-row"
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            {tabList.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="profile-button"
                style={{
                  backgroundColor: activeTab === tab ? '#cad2c5' : '#2f3e46',
                  color: activeTab === tab ? '#2f3e46' : '#cad2c5',
                  borderRadius: '12px',
                  margin: '0 5px',
                  padding: '8px 16px',
                  fontWeight: 'bold',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ✅ Tab Content */}
          <div className="profile-content">
            {activeTab === 'My Classes' && <WeeklyClassesView />}
            {activeTab === 'My Courses' && <CourseForm onSubmit={(data) => console.log(data)} />}
            {activeTab === 'Past Classes' && <div>Past Classes (Coming Soon)</div>}
            {activeTab === 'Archived Courses' && <div>Archived Courses (Coming Soon)</div>}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CoursesPage;
