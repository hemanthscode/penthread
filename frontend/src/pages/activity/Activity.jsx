import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  FileText,
  MessageCircle,
  User,
  Lock,
  Edit,
  Trash,
  Send,
} from 'lucide-react';
import Container from '../../components/layout/Container';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';
import activityService from '../../services/activityService';
import { formatRelativeTime } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await activityService.getActivities();
      if (response.success) {
        setActivities(response.data);
      }
    } catch (error) {
      toast.error('Failed to load activities');
      console.error('Fetch activities error:', error);
    } finally {
      setLoading(false);
    }
  };

  const iconMap = {
    post_created: FileText,
    post_published: Send,
    post_updated: Edit,
    post_deleted: Trash,
    comment_created: MessageCircle,
    comment_deleted: Trash,
    profile_updated: User,
    password_changed: Lock,
  };

  const getActivityIcon = (action) => iconMap[action] || Activity;

  const getActivityColor = (action) => {
    if (action.includes('published')) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    if (action.includes('deleted')) return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    if (action.includes('created')) return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
    if (action.includes('updated') || action.includes('changed'))
      return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
    if (action.includes('comment')) return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20';
    return 'text-gray-600 bg-gray-50 dark:bg-gray-700';
  };

  const getActionLabel = (action) => {
    const labels = {
      post_created: 'Created Post',
      post_published: 'Published Post',
      post_updated: 'Updated Post',
      post_deleted: 'Deleted Post',
      comment_created: 'Created Comment',
      comment_deleted: 'Deleted Comment',
      profile_updated: 'Updated Profile',
      password_changed: 'Changed Password',
    };
    return labels[action] || action.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <Container className="py-8">
      <PageHeader
        title="Activity Log"
        description="Track your recent actions and engagement"
        icon={Activity}
      />

      {loading ? (
        <Loader />
      ) : activities.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No activity yet"
          message="Start exploring and your activities will appear here"
        />
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => {
            const Icon = getActivityIcon(activity.action);
            const colorClass = getActivityColor(activity.action);

            return (
              <motion.div
                key={activity._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="default" size="sm">
                          {getActionLabel(activity.action)}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatRelativeTime(activity.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {activity.details}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </Container>
  );
};

export default ActivityLog;