import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Auth } from '../features/auth';
import Link from 'next/link';
import AuthForm from '../features/auth/components/AuthForm';

export default function ConfirmPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (router.query.email) {
      setEmail(router.query.email);
    }
  }, [router.query.email]);

  const handleConfirm = async (values) => {
    setError('');
    setLoading(true);
    try {
      await Auth.confirmSignUp(email, values.code);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to confirm');
    } finally {
      setLoading(false);
    }
  };

  const confirmFields = [
    {
      name: 'code',
      type: 'text',
      label: 'Confirmation Code',
      placeholder: 'Enter code sent to your email',
      required: true,
    },
  ];

  return (
    <div>
      <AuthForm
        title="Confirm Your Account"
        fields={confirmFields}
        submitLabel="Confirm"
        onSubmit={handleConfirm}
        loading={loading}
        error={error}
        footerText={success ? 'Account confirmed! You can now' : ''}
        footerLinkText={success ? 'log in' : ''}
        footerLinkHref="/login"
      />
    </div>
  );
}
