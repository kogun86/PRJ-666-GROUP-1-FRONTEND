import Layout from '../componentShared/Layout';
import ProtectedRoute from '../componentShared/ProtectedRoute';
import AIChatWindow from '../componentShared/AIChatWindow';
import { ProfileContainer } from '../features/profile';
import { motion } from 'framer-motion';

export default function Profile() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="profile-page">
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <ProfileContainer />
          </motion.div>
          {/* AI Chat Window */}
          <AIChatWindow />
        </div>
        <style jsx>{`
          .profile-page {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem 1rem;
          }
        `}</style>
      </Layout>
    </ProtectedRoute>
  );
}
