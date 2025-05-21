// This API endpoint checks if the app is running in production or development
import { isProduction } from '../../../features/auth/lib';

export default function handler(req, res) {
  try {
    // Use the centralized isProduction helper
    const isProd = isProduction();
    const environment = process.env.NODE_ENV;

    res.status(200).json({
      isProduction: isProd,
      environment,
    });
  } catch (error) {
    console.error('Environment check error:', error);
    res.status(500).json({
      error: 'Failed to determine environment',
      isProduction: false,
      environment: process.env.NODE_ENV || 'unknown',
    });
  }
}
