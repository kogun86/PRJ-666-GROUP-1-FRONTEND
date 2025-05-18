// This API endpoint verifies a JWT token from Cognito
// In a real implementation, this would use the AWS SDK to verify the token

export default async function handler(req, res) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // Check if we're in production
    if (process.env.NODE_ENV === 'production') {
      // In a real implementation, you would use the AWS JWT Verifier to verify the token
      // const jwtVerifier = CognitoJwtVerifier.create({
      //   userPoolId: process.env.AWS_COGNITO_POOL_ID,
      //   clientId: process.env.AWS_COGNITO_CLIENT_ID,
      //   tokenUse: 'id',
      // });
      //
      // try {
      //   const user = await jwtVerifier.verify(token);
      //   return res.status(200).json({
      //     email: user.email,
      //     name: user.name,
      //     // Other user attributes you want to include
      //   });
      // } catch (err) {
      //   return res.status(401).json({ message: 'Invalid token' });
      // }

      // For demonstration, just check if it's our mock token
      if (token === 'mock-jwt-token-for-demonstration') {
        // Mock user info that would come from decoding the JWT
        return res.status(200).json({
          name: 'Production User',
          email: 'user@example.com',
          dateOfBirth: '1985-05-15',
          lastLogin: new Date().toISOString(),
        });
      } else {
        return res.status(401).json({ message: 'Invalid token' });
      }
    } else {
      // In development, just return mock data
      return res.status(200).json({
        name: 'Development User',
        email: 'dev@example.com',
        dateOfBirth: '1990-01-01',
        lastLogin: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({
      message: error.message || 'An error occurred during token verification',
    });
  }
}
