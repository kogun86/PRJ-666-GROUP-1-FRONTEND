import '../styles/globals.css';
import '../styles/sidebar.css';
import '../styles/mobile-nav.css';
import '../styles/layout.css';
import '../styles/profile.css';
import '../styles/courses.css';
import '../styles/events.css';
import '../styles/login.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/auth.css';
import '../styles/notfound.css';
import '../styles/calendar.css';
import { AuthProvider } from '../context/AuthContext';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
