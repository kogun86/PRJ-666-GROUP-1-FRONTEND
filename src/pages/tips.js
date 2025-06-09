import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '@/componentShared/Layout';
import TabsBar from '@/componentShared/TabsBar';
import ProtectedRoute from '@/componentShared/ProtectedRoute';
import AIChatWindow from '@/componentShared/AIChatWindow';

// Define tab constants
const TABS = {
  HOME: 'home',
  STUDY_TIPS: 'study_tips',
  RESOURCES: 'resources',
};

// Define tab display names
const TAB_LABELS = {
  [TABS.HOME]: 'Home',
  [TABS.STUDY_TIPS]: 'Study Tips',
  [TABS.RESOURCES]: 'Resources',
};

export default function Tips() {
  const [activeTab, setActiveTab] = useState(TABS.HOME);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <Head>
          <title>Tips & Resources | Student Dashboard</title>
          <meta name="description" content="Study tips and resources for students" />
        </Head>

        <div className="max-w-4xl mx-auto">
          <TabsBar
            tabs={[
              { id: TABS.HOME, label: 'Home' },
              { id: TABS.STUDY_TIPS, label: 'Study Tips' },
              { id: TABS.RESOURCES, label: 'Resources' },
            ]}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <div className="bg-white p-6 rounded-lg shadow-md">
            {activeTab === TABS.HOME && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Welcome to Student Success Tips</h2>
                <p className="mb-4">
                  This page provides helpful tips and resources to support your academic journey.
                  Navigate through the tabs to discover study strategies and valuable resources.
                </p>
                <p>
                  Use the tabs above to explore different sections and find the information you need
                  to excel in your studies.
                </p>
              </div>
            )}

            {activeTab === TABS.STUDY_TIPS && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Effective Study Strategies</h2>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    <strong>Pomodoro Technique:</strong> Study for 25 minutes, then take a 5-minute
                    break. After four cycles, take a longer 15-30 minute break.
                  </li>
                  <li>
                    <strong>Active Recall:</strong> Test yourself on material instead of passively
                    reviewing it. Create flashcards or practice problems to enhance retention.
                  </li>
                  <li>
                    <strong>Spaced Repetition:</strong> Review material at increasing intervals over
                    time instead of cramming all at once.
                  </li>
                  <li>
                    <strong>Teach Someone Else:</strong> Explaining concepts to others helps
                    solidify your understanding and identifies knowledge gaps.
                  </li>
                </ul>
              </div>
            )}

            {activeTab === TABS.RESOURCES && (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Helpful Resources</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-medium mb-2">Online Learning Platforms</h3>
                    <ul className="list-disc pl-6">
                      <li>Khan Academy - Free courses on various subjects</li>
                      <li>Coursera - University-level courses</li>
                      <li>edX - Courses from top institutions</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium mb-2">Study Tools</h3>
                    <ul className="list-disc pl-6">
                      <li>Notion - Note-taking and organization</li>
                      <li>Anki - Flashcard app for spaced repetition</li>
                      <li>Forest - Focus timer app</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Chat Window */}
        <AIChatWindow />
      </Layout>
    </ProtectedRoute>
  );
}
