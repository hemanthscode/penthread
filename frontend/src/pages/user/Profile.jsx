import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useForm } from '../../hooks/useForm';
import * as userService from '../../services/userService';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const { values, errors, handleChange, setValues, setErrors } = useForm({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setValues({ name: user.name, email: user.email });
    }
  }, [user, setValues]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await userService.updateMyProfile(values);
      alert('Profile updated successfully');
    } catch {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-4 border rounded shadow mt-10 bg-white">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input label="Name" name="name" value={values.name} onChange={handleChange} error={errors.name} />
        <Input label="Email" name="email" value={values.email} onChange={handleChange} error={errors.email} disabled />
        <Button type="submit" disabled={loading}>Save Changes</Button>
      </form>
    </div>
  );
};

export default Profile;
