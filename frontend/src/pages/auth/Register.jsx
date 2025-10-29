import React, { useState } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useForm } from '../../hooks/useForm';
import { useNavigate, Link } from 'react-router-dom';
import * as authService from '../../services/authService';
import * as yup from 'yup';

const registerSchema = yup.object({
  name: yup.string().min(3).required('Name is required'),
  email: yup.string().email().required('Email is required'),
  password: yup.string().min(6).required('Password is required'),
});

const Register = () => {
  const navigate = useNavigate();
  const { values, errors, handleChange, setErrors } = useForm(
    { name: '', email: '', password: '' },
    (values) => {
      try {
        registerSchema.validateSync(values, { abortEarly: false });
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
      await authService.register(values);
      navigate('/auth/login');
    } catch (e) {
      setServerError(e.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-center mb-7">Register</h2>
        <form onSubmit={onSubmit} className="space-y-6">
          <Input label="Name" name="name" value={values.name} onChange={handleChange} error={errors.name} required />
          <Input label="Email" type="email" name="email" value={values.email} onChange={handleChange} error={errors.email} required />
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
          <Button type="submit" disabled={loading || Object.keys(errors).length > 0} variant="primary" className="w-full">
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
