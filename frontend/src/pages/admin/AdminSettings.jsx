import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Globe, Mail, Shield, Bell } from 'lucide-react';
import Container from '../../components/layout/Container';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    siteName: 'BlogPlatform',
    siteDescription: 'A modern blogging platform for writers and readers',
    contactEmail: 'admin@blogplatform.com',
    postsPerPage: 10,
    commentsEnabled: true,
    registrationEnabled: true,
    emailNotifications: true,
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container className="py-8">
      <PageHeader
        title="Platform Settings"
        description="Configure platform-wide settings and preferences"
        icon={Settings}
      />

      <div className="max-w-4xl space-y-6">
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <div className="flex items-center mb-4">
              <Globe className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                General Settings
              </h3>
            </div>
            <div className="space-y-4">
              <Input
                label="Site Name"
                name="siteName"
                value={settings.siteName}
                onChange={handleChange}
              />
              <Textarea
                label="Site Description"
                name="siteDescription"
                value={settings.siteDescription}
                onChange={handleChange}
                rows={3}
              />
              <Input
                label="Posts Per Page"
                name="postsPerPage"
                type="number"
                value={settings.postsPerPage}
                onChange={handleChange}
              />
            </div>
          </Card>
        </motion.div>

        {/* Email Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center mb-4">
              <Mail className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Email Settings
              </h3>
            </div>
            <div className="space-y-4">
              <Input
                label="Contact Email"
                name="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={handleChange}
              />
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="emailNotifications"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                >
                  Enable email notifications
                </label>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Security Settings
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="registrationEnabled"
                  name="registrationEnabled"
                  checked={settings.registrationEnabled}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="registrationEnabled"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                >
                  Allow new user registrations
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="commentsEnabled"
                  name="commentsEnabled"
                  checked={settings.commentsEnabled}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="commentsEnabled"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                >
                  Enable comments on posts
                </label>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            variant="primary"
            icon={Save}
            onClick={handleSave}
            loading={saving}
          >
            Save Settings
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default AdminSettings;
