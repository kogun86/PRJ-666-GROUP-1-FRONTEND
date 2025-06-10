import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '@/componentShared/Layout';
import TabsBar from '@/componentShared/TabsBar';
import ProtectedRoute from '@/componentShared/ProtectedRoute';
import AIChatWindow from '@/componentShared/AIChatWindow';
import TipsHome from '@/features/tips/components/TipsHome';

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

// Study tips data
const STUDY_TIPS = [
  {
    id: 1,
    title: 'Pomodoro Technique',
    description:
      'Study for 25 minutes, then take a 5-minute break. After four cycles, take a longer 15-30 minute break.',
  },
  {
    id: 2,
    title: 'Active Recall',
    description:
      'Test yourself on material instead of passively reviewing it. Create flashcards or practice problems to enhance retention.',
  },
  {
    id: 3,
    title: 'Spaced Repetition',
    description:
      'Review material at increasing intervals over time instead of cramming all at once.',
  },
  {
    id: 4,
    title: 'Teach Someone Else',
    description:
      'Explaining concepts to others helps solidify your understanding and identifies knowledge gaps.',
  },
];

// Resources data
const RESOURCES = [
  {
    id: 1,
    category: 'Online Learning Platforms',
    items: [
      'Khan Academy - Free courses on various subjects',
      'Coursera - University-level courses',
      'edX - Courses from top institutions',
    ],
  },
  {
    id: 2,
    category: 'Study Tools',
    items: [
      'Notion - Note-taking and organization',
      'Anki - Flashcard app for spaced repetition',
      'Forest - Focus timer app',
    ],
  },
];

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
            {activeTab === TABS.HOME && <TipsHome />}

            {activeTab === TABS.STUDY_TIPS && (
              <div className="tips-container">
                <h2 className="text-2xl font-semibold mb-4">Effective Study Strategies</h2>
                <ul className="study-tips-list">
                  {STUDY_TIPS.map((tip) => (
                    <li key={tip.id} className="study-tip-item">
                      <h3 className="study-tip-title">{tip.title}</h3>
                      <p className="study-tip-description">{tip.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === TABS.RESOURCES && (
              <div className="tips-container">
                <h2 className="text-2xl font-semibold mb-4">Helpful Resources</h2>
                <div className="resources-grid">
                  {RESOURCES.map((resource) => (
                    <div key={resource.id} className="resource-card">
                      <div className="resource-card-header">{resource.category}</div>
                      <div className="resource-card-body">
                        <ul className="resource-list">
                          {resource.items.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
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
