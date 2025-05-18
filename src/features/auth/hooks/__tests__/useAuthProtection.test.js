import { renderHook } from '@testing-library/react';
import useAuthProtection from '../useAuthProtection';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/router';

// Mock dependencies
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('useAuthProtection', () => {
  // Mock implementation variables
  const mockReplace = jest.fn();

  beforeEach(() => {
    // Setup router mock with direct mockReplace function
    useRouter.mockReturnValue({
      replace: mockReplace,
      asPath: '/protected',
    });

    // Clear mocks
    jest.clearAllMocks();
  });

  it('should redirect to login when not authenticated', () => {
    // Mock auth context
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
    });

    renderHook(() => useAuthProtection());

    // Wait for the useEffect to run
    expect(mockReplace).toHaveBeenCalledWith({
      pathname: '/login',
      query: { returnUrl: '/protected' },
    });
  });

  it('should not redirect when authenticated', () => {
    // Mock auth context
    useAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
    });

    renderHook(() => useAuthProtection());

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should not redirect when redirectToLogin is false', () => {
    // Mock auth context
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
    });

    renderHook(() => useAuthProtection(false));

    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('should return isLoading true while auth check is in progress', () => {
    // Mock auth context with loading true
    useAuth.mockReturnValue({
      isAuthenticated: false,
      loading: true,
    });

    const { result } = renderHook(() => useAuthProtection());

    expect(result.current.isLoading).toBe(true);
  });
});
