import { useState } from 'react';
import { useRouter } from 'next/router';
import AuthForm from '../components/AuthForm';

export default function Registration() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

      // Here you would typically call your API to register the user
      console.log('Registration data:', values);

      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to login page after successful registration
      router.push('/login');
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
