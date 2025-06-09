import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth, Auth } from '../features/auth';
import AuthForm from '../features/auth/components/AuthForm';
import IntroAnimation from '../features/animations/IntroAnimation';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isProduction, setIsProduction] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    // Check if we're running in production (for Cognito) or development (for basic auth)
    const checkEnvironment = async () => {
      try {
        const response = await fetch('/api/auth/check-environment');
        const data = await response.json();
        setIsProduction(data.isProduction);
      } catch (err) {
        console.error('Failed to check environment:', err);
        // Default to basic auth if we can't determine
        setIsProduction(false);
      }
    };

    checkEnvironment();
  }, []);

  const handleLogin = async ({ email, password }) => {
    setError('');
    setLoading(true);

    try {
      // Front-end validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      console.log('Username:', email);
      // Don't log passwords in production
      if (!isProduction) {
        console.log('Password:', password);
      }

      let authResult;

      // Call the context login function which handles both dev and prod
      authResult = await login(email, password);

      // Check for error in the returned result
      if (authResult && authResult.error) {
        throw new Error(authResult.error);
      }

      console.log('Login successful, showing intro animation...');

      // Set a flag in localStorage to show the intro animation
      localStorage.setItem('showIntroAnimation', 'true');

      // Redirect immediately to profile page
      router.replace('/profile');
    } catch (error) {
      console.error('Login error:', error.message, error);
      setError(error.message || 'Failed to login');
      setLoading(false);
    }
  };

  // Define form fields
  const loginFields = [
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      required: true,
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      required: true,
    },
  ];

  // Optional development mode note
  const devNote = !isProduction ? (
    <div className="dev-note">
      <p>Development Mode: Use any email/password</p>
    </div>
  ) : null;

  return (
    <AuthForm
      title="Login"
      fields={loginFields}
      submitLabel="Login"
      onSubmit={handleLogin}
      loading={loading}
      error={error}
      footerText="Don't have an account?"
      footerLinkText="Register"
      footerLinkHref="/registration"
      additionalFooter={devNote}
    />
  );
}
