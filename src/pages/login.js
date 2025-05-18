import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';
import { signIn, signOut } from 'aws-amplify/auth';


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

  const handleLogin = async ({ email, password }) => {
  // const result = await signOut({username: email, password });
  setError('');
  setLoading(true);

  try {
    await signOut();
    // Front-end validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    console.log("Username:", email);
    console.log("Password:", password);

    const result = await signIn({ username: email, password });
    
    if (!result || result.error) {
      throw new Error(result?.error || 'Login failed');
    }

    console.log("User signed in:", result);
    console.log('Login successful, redirecting to profile...');

    // ✅ SET AUTH CONTEXT STATE HERE
    await login(email, password); // call your context's login function

    // Redirect after short delay
    setTimeout(() => {
      router.push('/profile');
    }, 100);

  } catch (error) {
    console.error("Login error:", error.message, error);
    setError(error.message || 'Failed to login');
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
