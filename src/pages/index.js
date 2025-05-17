import Layout from '../components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Welcome to My App</h1>
        <p className="text-gray-600">
          This is a simple Next.js application with a sidebar navigation. Use the sidebar to
          navigate between different pages.
        </p>
      </div>
    </Layout>
  );
}
