import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save, Camera, Calendar, Clock } from 'lucide-react';
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
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [profileTouched, setProfileTouched] = useState({});

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordTouched, setPasswordTouched] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userService.getMyProfile();
      if (response.success) {
        setProfileData(response.data);
        setProfileForm({
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

  // Profile form handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleProfileBlur = (e) => {
    const { name } = e.target;
    setProfileTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateProfile = () => {
    const errors = {};
    if (!profileForm.name) {
      errors.name = 'Name is required';
    } else if (profileForm.name.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    if (!profileForm.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileForm.email)) {
      errors.email = 'Email is invalid';
    }
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateProfile()) {
      return;
    }

    setUpdating(true);
    try {
      const response = await userService.updateMyProfile(profileForm);
      if (response.success) {
        await updateProfile();
        setSuccess('Profile updated successfully');
        toast.success('Profile updated successfully');
        fetchProfile(); // Refresh profile data
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      toast.error('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  // Password form handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordBlur = (e) => {
    const { name } = e.target;
    setPasswordTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validatePassword()) {
      return;
    }

    setChangingPassword(true);
    try {
      const response = await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      if (response.success) {
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setPasswordTouched({});
        setSuccess('Password changed successfully');
        toast.success('Password changed successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
      toast.error('Failed to change password');
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

      {error && (
        <Alert type="error" message={error} onClose={() => setError('')} className="mb-6" />
      )}
      {success && (
        <Alert type="success" message={success} onClose={() => setSuccess('')} className="mb-6" />
      )}

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
                <Avatar name={profileData?.name} size="xl" />
                <button className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {profileData?.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {profileData?.email}
              </p>
              <Badge variant="primary" className="capitalize">
                {profileData?.role}
              </Badge>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-4 text-sm">
                {/* Member Since */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Member Since</span>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900 dark:text-gray-100 font-medium">
                      {formatDate(profileData?.createdAt)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {formatRelativeTime(profileData?.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Last Updated */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Last Updated</span>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900 dark:text-gray-100 font-medium">
                      {formatDate(profileData?.updatedAt)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {formatRelativeTime(profileData?.updatedAt)}
                    </div>
                  </div>
                </div>

                {/* Account Status */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Account Status</span>
                  <Badge variant={profileData?.isActive ? 'success' : 'danger'}>
                    {profileData?.isActive ? 'Active' : 'Inactive'}
                  </Badge>
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

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <Input
                  label="Full Name"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  onBlur={handleProfileBlur}
                  error={profileTouched.name && profileErrors.name}
                  icon={User}
                  required
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  onBlur={handleProfileBlur}
                  error={profileTouched.email && profileErrors.email}
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

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <Input
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  error={passwordTouched.currentPassword && passwordErrors.currentPassword}
                  icon={Lock}
                  required
                />

                <Input
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  error={passwordTouched.newPassword && passwordErrors.newPassword}
                  icon={Lock}
                  helperText="Must be at least 8 characters"
                  required
                />

                <Input
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  error={passwordTouched.confirmPassword && passwordErrors.confirmPassword}
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
