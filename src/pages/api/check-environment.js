// This API endpoint checks if the app is running in production or development
export default function handler(req, res) {
  // Check NODE_ENV, but you could use other methods like checking an environment variable
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(200).json({
    isProduction,
    environment: process.env.NODE_ENV,
  });
}
