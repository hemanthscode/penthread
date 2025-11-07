import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, BookOpen, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Alert from '../../components/common/Alert';
import { ROUTES } from '../../utils/constants';
import authService from '../../services/authService';
import useForm from '../../hooks/useForm';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.password) errors.password = 'Password is required';
    else if (values.password.length < 8) errors.password = 'Password must be at least 8 characters';

    if (!values.confirmPassword) errors.confirmPassword = 'Please confirm your password';
    else if (values.password !== values.confirmPassword) errors.confirmPassword = 'Passwords do not match';

    return errors;
  };

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm(
    { password: '', confirmPassword: '' },
    validate
  );

  const onSubmit = async (formValues) => {
    setError('');
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    try {
      await authService.resetPassword(token, formValues.password);
      setSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.LOGIN);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <BookOpen className="h-12 w-12 text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Reset your password</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Enter your new password below</p>
        </div>

        {success && <Alert type="success" title="Password reset successful!" message="Redirecting to login page..." />}
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        {!success && (
          <form onSubmit={(e) => handleSubmit(onSubmit)(e)} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  label="New password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && errors.password}
                  icon={Lock}
                  placeholder="Enter new password"
                  helperText="Must be at least 8 characters"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <Input
                label="Confirm new password"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.confirmPassword && errors.confirmPassword}
                icon={Lock}
                placeholder="Confirm new password"
                required
              />
            </div>

            <Button type="submit" variant="primary" fullWidth loading={isSubmitting} disabled={isSubmitting}>
              Reset password
            </Button>
          </form>
        )}

        <div className="text-center">
          <Link to={ROUTES.LOGIN} className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
            Back to login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
