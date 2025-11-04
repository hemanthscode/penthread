import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  FileText,
  Heart,
  MessageCircle,
  Eye,
  BarChart3,
  Calendar,
} from 'lucide-react';
import Container from '../../components/layout/Container';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import dashboardService from '../../services/dashboardService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AuthorAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [statsRes, summaryRes] = await Promise.all([
        dashboardService.getAuthorStats(),
        dashboardService.getAuthorSummary(),
      ]);

      if (statsRes.success && summaryRes.success) {
        setAnalytics({
          stats: statsRes.data,
          summary: summaryRes.data,
        });
      }
    } catch (error) {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  const statCards = [
    {
      title: 'Total Posts',
      value: analytics?.summary?.totalPosts || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Published Posts',
      value: analytics?.summary?.publishedPosts || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Total Likes',
      value: analytics?.summary?.totalLikes || 0,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Total Comments',
      value: analytics?.summary?.totalComments || 0,
      icon: MessageCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  const avgLikesPerPost = analytics?.summary?.totalPosts
    ? Math.round((analytics.summary.totalLikes || 0) / analytics.summary.totalPosts)
    : 0;

  const avgCommentsPerPost = analytics?.summary?.totalPosts
    ? Math.round((analytics.summary.totalComments || 0) / analytics.summary.totalPosts)
    : 0;

  const publishRate = analytics?.summary?.totalPosts
    ? Math.round(((analytics.summary.publishedPosts || 0) / analytics.summary.totalPosts) * 100)
    : 0;

  return (
    <Container className="py-8">
      <PageHeader
        title="My Analytics"
        description="Track your content performance and engagement"
        icon={BarChart3}
      />

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Performance Metrics
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Avg. Likes per Post
                  </span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {avgLikesPerPost}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: '75%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Avg. Comments per Post
                  </span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {avgCommentsPerPost}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: '60%' }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Publish Rate
                  </span>
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {publishRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${publishRate}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Publishing Activity
            </h3>
            <div className="space-y-3">
              {analytics?.stats?.postsByDate?.slice(-7).reverse().map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(item._id)}
                  </span>
                  <Badge variant="primary">{item.count} posts</Badge>
                </div>
              ))}
              {(!analytics?.stats?.postsByDate || analytics.stats.postsByDate.length === 0) && (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Engagement Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Engagement Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analytics?.summary?.totalLikes?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analytics?.summary?.totalComments?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Comments</p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analytics?.summary?.totalViews?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </Container>
  );
};

export default AuthorAnalytics;
