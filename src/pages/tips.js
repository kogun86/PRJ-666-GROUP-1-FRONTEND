import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '@/componentShared/Layout';
import TabsBar from '@/componentShared/TabsBar';
import ProtectedRoute from '@/componentShared/ProtectedRoute';
import AIChatWindow from '@/componentShared/AIChatWindow';
import TipsHome from '@/features/tips/components/TipsHome';
import StudyTipsTab from '@/features/tips/components/StudyTipsTab';
import ResourcesTab from '@/features/tips/components/ResourcesTab';

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
            {activeTab === TABS.HOME && <TipsHome />}
            {activeTab === TABS.STUDY_TIPS && <StudyTipsTab />}
            {activeTab === TABS.RESOURCES && <ResourcesTab />}
          </div>
        </div>

        {/* AI Chat Window */}
        <AIChatWindow />
      </Layout>
    </ProtectedRoute>
  );
}
