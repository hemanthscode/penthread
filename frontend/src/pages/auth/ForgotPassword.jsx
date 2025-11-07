import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, BookOpen, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';
import { ROUTES } from '../../utils/constants';
import authService from '../../services/authService';
import useForm from '../../hooks/useForm';

const ForgotPassword = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Email is invalid';
    return errors;
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm(
    { email: '' },
    validate
  );

  const onSubmit = async (formValues) => {
    setError('');
    setSuccess(false);
    try {
      await authService.forgotPassword(formValues.email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <BookOpen className="h-12 w-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Forgot password?</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Enter your email and we'll send you a reset link</p>
        </div>

        {success && <Alert type="success" title="Email sent!" message="Check your inbox for password reset instructions." />}
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {!success && (
          <form onSubmit={(e) => handleSubmit(onSubmit)(e)} className="mt-8 space-y-6">
            <Input
              label="Email address"
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
              icon={Mail}
              placeholder="you@example.com"
              required
            />

            <Button type="submit" variant="primary" fullWidth loading={isSubmitting} disabled={isSubmitting}>
              Send reset link
            </Button>
          </form>
        )}

        <div className="text-center">
          <Link to={ROUTES.LOGIN} className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
