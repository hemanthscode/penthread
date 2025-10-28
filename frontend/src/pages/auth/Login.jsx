import React, { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useForm } from '../../hooks/useForm';
import { loginSchema } from '../../utils/formValidation';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const { values, errors, handleChange, setErrors } = useForm(
    { email: '', password: '' },
    (values) => {
      try {
        loginSchema.validateSync(values, { abortEarly: false });
        setErrors({});
      } catch (err) {
        const errorMap = {};
        err.inner.forEach(({ path, message }) => (errorMap[path] = message));
        setErrors(errorMap);
      }
    }
  );

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(values);
      navigate('/'); // adapt later to redirect by role
    } catch (e) {
      setServerError(e.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
        />
        {serverError && <p className="text-red-600 text-center">{serverError}</p>}
        <Button type="submit" disabled={loading || Object.keys(errors).length > 0} variant="primary">
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        <Link to="/auth/forgot-password" className="text-blue-600 hover:underline">
          Forgot Password?
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
};

export default Login;
