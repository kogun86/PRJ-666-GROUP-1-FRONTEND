// Basic tests for the auth utility functions
import { isProduction } from '../index';

describe('Auth utilities', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    // Create a fresh copy of process.env
    process.env = { ...originalEnv };
    // Clear Cognito config variables
    delete process.env.NEXT_PUBLIC_AWS_COGNITO_REGION;
    delete process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID;
    delete process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('isProduction function', () => {
    it('should return false when NODE_ENV is development', () => {
      process.env.NODE_ENV = 'development';
      expect(isProduction()).toBe(false);
    });

    it('should return false when required Cognito config is missing', () => {
      process.env.NODE_ENV = 'production';
      // Missing Cognito config - already deleted in beforeEach
      expect(isProduction()).toBe(false);
    });

    it('should return true when NODE_ENV is production and Cognito is configured', () => {
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_AWS_COGNITO_REGION = 'us-east-1';
      process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID = 'test-pool';
      process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID = 'test-client';

      expect(isProduction()).toBe(true);
    });
  });
});
