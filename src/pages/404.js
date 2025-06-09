import Layout from '../componentShared/Layout';
import Link from 'next/link';

export default function NotFound() {
  return (
    <Layout>
      <div className="notfound-container">
        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">Page Not Found</h2>
        <p className="notfound-message">
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>
        <Link href="/" className="notfound-button">
          Go Back Home
        </Link>
      </div>
    </Layout>
  );
}
