import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save, Camera } from 'lucide-react';
import { useAuth } from '../../hooks';
import Container from '../../components/layout/Container';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Alert from '../../components/common/Alert';
import userService from '../../services/userService';
import authService from '../../services/authService';
import useForm from '../../hooks/useForm';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const profileValidate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Name is required';
    } else if (values.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }
    return errors;
  };

  const passwordValidate = (values) => {
    const errors = {};
    if (!values.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!values.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (values.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    if (!values.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (values.newPassword !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const profileForm = useForm(
    { name: user?.name || '', email: user?.email || '' },
    profileValidate
  );

  const passwordForm = useForm(
    { currentPassword: '', newPassword: '', confirmPassword: '' },
    passwordValidate
  );

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userService.getMyProfile();
      if (response.success) {
        profileForm.setValues({
          name: response.data.name,
          email: response.data.email,
        });
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (values) => {
    setError('');
    setSuccess('');
    setUpdating(true);

    try {
      const response = await userService.updateMyProfile(values);
      if (response.success) {
        await updateProfile();
        setSuccess('Profile updated successfully');
        toast.success('Profile updated successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (values) => {
    setError('');
    setSuccess('');
    setChangingPassword(true);

    try {
      const response = await authService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      if (response.success) {
        passwordForm.resetForm();
        setSuccess('Password changed successfully');
        toast.success('Password changed successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <Container className="py-8">
      <PageHeader
        title="My Profile"
        description="Manage your account settings and preferences"
        icon={User}
      />

      {error && <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-6" />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <Card>
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <Avatar name={user?.name} size="xl" />
                <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {user?.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{user?.email}</p>
              <Badge variant="primary" className="capitalize">
                {user?.role}
              </Badge>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                  <span className="text-gray-900 dark:text-gray-100 font-medium">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Account Status</span>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Profile Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Update Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Information
              </h3>

              <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={profileForm.values.name}
                  onChange={profileForm.handleChange}
                  onBlur={profileForm.handleBlur}
                  error={profileForm.touched.name && profileForm.errors.name}
                  icon={User}
                  required
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profileForm.values.email}
                  onChange={profileForm.handleChange}
                  onBlur={profileForm.handleBlur}
                  error={profileForm.touched.email && profileForm.errors.email}
                  icon={Mail}
                  required
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    icon={Save}
                    loading={updating}
                    disabled={updating}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>

          {/* Change Password */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Change Password
              </h3>

              <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.values.currentPassword}
                  onChange={passwordForm.handleChange}
                  onBlur={passwordForm.handleBlur}
                  error={passwordForm.touched.currentPassword && passwordForm.errors.currentPassword}
                  icon={Lock}
                  required
                />

                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordForm.values.newPassword}
                  onChange={passwordForm.handleChange}
                  onBlur={passwordForm.handleBlur}
                  error={passwordForm.touched.newPassword && passwordForm.errors.newPassword}
                  icon={Lock}
                  helperText="Must be at least 8 characters"
                  required
                />

                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.values.confirmPassword}
                  onChange={passwordForm.handleChange}
                  onBlur={passwordForm.handleBlur}
                  error={passwordForm.touched.confirmPassword && passwordForm.errors.confirmPassword}
                  icon={Lock}
                  required
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    icon={Save}
                    loading={changingPassword}
                    disabled={changingPassword}
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </Container>
  );
};

export default Profile;
