import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity as ActivityIcon,
  UserPlus,
  FileText,
  MessageCircle,
  Heart,
  Bookmark,
  Share2,
  Eye,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  FolderPlus,
  Tag,
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

const Activity = () => {
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

  const getActivityIcon = (action) => {
    const iconMap = {
      user_registered: UserPlus,
      create_post: FileText,
      publish_post: FileText,
      edit_post: Edit,
      delete_post: Trash,
      comment_post: MessageCircle,
      like_post: Heart,
      favorite_post: Bookmark,
      share_post: Share2,
      view_post: Eye,
      approve_post: CheckCircle,
      reject_post: XCircle,
      approve_comment: CheckCircle,
      create_category: FolderPlus,
      create_tag: Tag,
    };
    return iconMap[action] || ActivityIcon;
  };

  const getActivityColor = (action) => {
    if (action.includes('approve')) return 'text-green-600 bg-green-50 dark:bg-green-900/20';
    if (action.includes('reject') || action.includes('delete'))
      return 'text-red-600 bg-red-50 dark:bg-red-900/20';
    if (action.includes('publish') || action.includes('create'))
      return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20';
    if (action.includes('edit')) return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20';
    if (action.includes('like') || action.includes('favorite'))
      return 'text-pink-600 bg-pink-50 dark:bg-pink-900/20';
    return 'text-gray-600 bg-gray-50 dark:bg-gray-700';
  };

  const getActionLabel = (action) => {
    const labels = {
      user_registered: 'Joined',
      create_post: 'Created Post',
      publish_post: 'Published Post',
      edit_post: 'Edited Post',
      delete_post: 'Deleted Post',
      comment_post: 'Commented',
      like_post: 'Liked',
      favorite_post: 'Favorited',
      share_post: 'Shared',
      view_post: 'Viewed',
      approve_post: 'Approved Post',
      reject_post: 'Rejected Post',
      approve_comment: 'Approved Comment',
      create_category: 'Created Category',
      create_tag: 'Created Tag',
    };
    return labels[action] || action.replace(/_/g, ' ');
  };

  return (
    <Container className="py-8">
      <PageHeader
        title="Activity Log"
        description="Track your recent actions and engagement"
        icon={ActivityIcon}
      />

      {loading ? (
        <Loader />
      ) : activities.length === 0 ? (
        <EmptyState
          icon={ActivityIcon}
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

export default Activity;
