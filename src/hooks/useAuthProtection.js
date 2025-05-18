import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

/**
 * Hook to protect pages that require authentication
 * @param {boolean} redirectToLogin - Whether to redirect to login page if user is not authenticated
 * @returns {object} - { isLoading, authChecked }
 */
export default function useAuthProtection(redirectToLogin = true) {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Only check after the initial authentication loading is complete
    if (!authLoading) {
      // If not authenticated and redirectToLogin is true, redirect to login page
      if (!isAuthenticated && redirectToLogin) {
        console.log('Not authenticated, redirecting to login...');
        router.replace({
          pathname: '/login',
          query: { returnUrl: router.asPath },
        });
      }
      // Mark auth check as complete
      setAuthChecked(true);
    }
  }, [isAuthenticated, authLoading, router, redirectToLogin]);

  return {
    isLoading: authLoading || !authChecked,
    authChecked,
  };
}
