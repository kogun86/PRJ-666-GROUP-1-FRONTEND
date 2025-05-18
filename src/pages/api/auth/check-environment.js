// This API endpoint checks if the app is running in production or development
import { isProduction } from '../../../features/auth/lib';

export default function handler(req, res) {
  // Use the centralized isProduction helper
  const environment = process.env.NODE_ENV;

  res.status(200).json({
    isProduction: isProduction(),
    environment,
  });
}
