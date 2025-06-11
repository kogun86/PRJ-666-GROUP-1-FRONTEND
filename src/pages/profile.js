import Layout from '../componentShared/Layout';
import ProtectedRoute from '../componentShared/ProtectedRoute';
import AIChatWindow from '../componentShared/AIChatWindow';
import { ProfileContainer } from '../features/profile';

export default function Profile() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="profile-page">
          <ProfileContainer />
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
