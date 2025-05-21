import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { useRouter } from 'next/router';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock fetch for environment check
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ isProduction: false, environment: 'test' }),
  })
);

// Mock the Auth module
jest.mock('../../lib', () => ({
  Auth: {
    currentAuthenticatedUser: jest.fn(),
    userAttributes: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  },
  isProduction: jest.fn(() => false),
}));

// Helper component to access the auth context
const AuthConsumer = () => {
  const { isAuthenticated, user, loading } = useAuth();
  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="authenticated">{isAuthenticated.toString()}</div>
      <div data-testid="user">{JSON.stringify(user)}</div>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Setup router mock
    useRouter.mockImplementation(() => ({
      replace: jest.fn(),
      push: jest.fn(),
      asPath: '/',
    }));

    // Clear mocks
    jest.clearAllMocks();

    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  });

  it('should provide authentication state', async () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    // Initial loading state
    expect(screen.getByTestId('loading').textContent).toBe('true');

    // Wait for authentication check to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    // Should not be authenticated by default
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('null');
  });
});
