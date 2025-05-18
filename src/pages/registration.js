import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AuthForm from '../components/AuthForm';
import { Auth } from '../features/auth';

export default function Registration() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isProduction, setIsProduction] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if we're running in production (for Cognito) or development (for basic auth)
    const checkEnvironment = async () => {
      try {
        const response = await fetch('/api/auth/check-environment');
        const data = await response.json();
        setIsProduction(data.isProduction);
      } catch (err) {
        console.error('Failed to check environment:', err);
        // Default to development mode if we can't determine
        setIsProduction(false);
      }
    };

    checkEnvironment();
  }, []);

  const handleRegistration = async (values) => {
    setError('');
    setLoading(true);

    try {
      // Validation
      if (values.password !== values.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (values.email !== values.confirmEmail) {
        throw new Error('Email addresses do not match');
      }

      if (isProduction) {
        // Use Cognito for production sign up
        try {
          const result = await Auth.signUp({
            username: values.email,
            password: values.password,
            options: {
              userAttributes: {
                email: values.email,
                given_name: values.firstName,
                family_name: values.lastName,
                name: `${values.firstName} ${values.lastName}`,
              },
            },
          });

          console.log('User successfully registered:', result);

          // Redirect to confirmation page or directly to login
          router.push('/login');
        } catch (cognitoError) {
          console.error('Cognito registration error:', cognitoError);
          throw new Error(cognitoError.message || 'Failed to register with Cognito');
        }
      } else {
        // Development mode - just log and redirect
        console.log('Development mode registration:', values);

        // Mock API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Redirect to login page after successful registration
        router.push('/login');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  // Define form fields
  const registrationFields = [
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      placeholder: 'John',
      required: true,
      row: 0, // Group in first row
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
      placeholder: 'Doe',
      required: true,
      row: 0, // Group in first row
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
      placeholder: 'john.doe@example.com',
      required: true,
    },
    {
      name: 'confirmEmail',
      type: 'email',
      label: 'Confirm Email',
      placeholder: 'john.doe@example.com',
      required: true,
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: '••••••••',
      required: true,
    },
    {
      name: 'confirmPassword',
      type: 'password',
      label: 'Confirm Password',
      placeholder: '••••••••',
      required: true,
    },
  ];

  return (
    <AuthForm
      title="Registration"
      fields={registrationFields}
      submitLabel="Register"
      onSubmit={handleRegistration}
      loading={loading}
      error={error}
      footerText="Already have an account?"
      footerLinkText="Login"
      footerLinkHref="/login"
    />
  );
}
