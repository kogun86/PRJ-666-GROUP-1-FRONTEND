import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isProduction, setIsProduction] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    // Check if we're running in production (for Cognito) or development (for basic auth)
    const checkEnvironment = async () => {
      try {
        const response = await fetch('/api/check-environment');
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

  const handleLogin = async (values) => {
    setError('');
    setLoading(true);

    try {
      if (!values.email || !values.password) {
        throw new Error('Email and password are required');
      }

      // Use the login function from AuthContext
      const result = await login(values.email, values.password);

      if (result && result.error) {
        throw new Error(result.error);
      }

      console.log('Login successful, redirecting to profile...');

      // Redirect to profile page after successful login
      setTimeout(() => {
        router.push('/profile');
      }, 100);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
    } finally {
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
