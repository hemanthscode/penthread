// src/pages/auth/Login.jsx
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
      const loggedUser = await login(values); // Login returns user profile now
      if (loggedUser) {
        const role = loggedUser.role;
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'author') {
          navigate('/author');
        } else if (role === 'user') {
          navigate('/user');
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    } catch (e) {
      setServerError(e.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-center mb-7">Login</h2>
        <form onSubmit={onSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          {serverError && <p className="text-red-600 text-center">{serverError}</p>}
          <Button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}
            variant="primary"
            className="w-full"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <div className="mt-6 text-center space-y-3 text-sm text-gray-600">
          <Link to="/auth/forgot-password" className="text-blue-600 hover:underline block">
            Forgot Password?
          </Link>
          <p>
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
