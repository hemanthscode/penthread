import React, { useEffect } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useForm } from '../../hooks/useForm';
import * as userService from '../../services/userService';

const Profile = () => {
  const { user, loading: authLoading } = useAuthContext();

  const { values, errors, handleChange, setValues, setErrors } = useForm(
    { name: '', email: '' },
  );

  // Populate form with user data once user info is loaded
  useEffect(() => {
    if (user) {
      setValues({ name: user.name, email: user.email });
    }
  }, [user, setValues]);

  const [loading, setLoading] = React.useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await userService.updateMyProfile(values);
      alert('Profile updated successfully');
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) return <p className="text-center text-gray-600 py-4">Loading...</p>;
  if (!user) return <p className="text-center text-gray-600 py-4">Please login to view your profile.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-md transform transition hover:scale-105 duration-300">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-600">Your Profile</h1>
        <div className="space-y-6">
          {/* Profile Form */}
          <form className="space-y-4" onSubmit={onSubmit}>
            {/* Name */}
            <Input
              label="Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              error={errors.name}
              placeholder="Your full name"
              required
            />
            {/* Email */}
            <Input
              label="Email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="Your email address"
              disabled
            />
            {/* Save Button */}
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full py-3 text-lg font-semibold"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
          {/* Additional Info/Note */}
          <div className="mt-6 text-center text-gray-500 text-sm">
            Keep your profile info updated for a better experience.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
