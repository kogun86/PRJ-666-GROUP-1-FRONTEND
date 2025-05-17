import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isProduction, setIsProduction] = useState(false);
  const router = useRouter();
  const { login } = useAuth(); // Use the login function from AuthContext

  useEffect(() => {
    // Check if we're running in production (for Cognito) or development (for basic auth)
    // In a real setup, you would check process.env.NODE_ENV
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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Use the login function from AuthContext
      const result = await login(email, password);

      if (result && result.error) {
        throw new Error(result.error);
      }

      console.log('Login successful, redirecting to profile...');
      // AuthContext login function handles the user state update

      // Redirect to profile page after successful login
      // Add a small delay to ensure state is updated
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

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login</h1>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin} className="login-form">
          <div className="login-form-group">
            <label htmlFor="email" className="login-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password" className="login-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/registration" className="login-link">
              Register
            </Link>
          </p>
        </div>

        {/* For development purposes only - shows current environment */}
        {!isProduction && (
          <div className="dev-note">
            <p>Development Mode: Use any email/password</p>
          </div>
        )}
      </div>
    </div>
  );
}
