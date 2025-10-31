import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Heart,
  MessageCircle,
  Eye,
  PenTool,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import Container from '../../components/layout/Container';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import dashboardService from '../../services/dashboardService';
import { ROUTES } from '../../utils/constants';
import toast from 'react-hot-toast';

const AuthorDashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [summaryRes, statsRes] = await Promise.all([
        dashboardService.getAuthorSummary(),
        dashboardService.getAuthorStats(),
      ]);

      if (summaryRes.success) setSummary(summaryRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
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
      value: summary?.totalPosts || 0,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Published Posts',
      value: summary?.publishedPosts || 0,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Total Likes',
      value: summary?.totalLikes || 0,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Total Comments',
      value: summary?.totalComments || 0,
      icon: MessageCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  const postsByDate = stats?.postsByDate || [];
  const recentPosts = postsByDate.slice(-7).reverse();

  return (
    <Container className="py-8">
      <PageHeader
        title="Author Dashboard"
        description="Track your content performance and engagement"
        icon={PenTool}
        action="Create New Post"
        onAction={() => navigate(ROUTES.CREATE_POST)}
      />

      {/* Stats Grid */}
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
              <Card hover>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                      {stat.value}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Publishing Activity (Last 7 Days)
              </h3>
            </div>
            <div className="space-y-3">
              {recentPosts.length > 0 ? (
                recentPosts.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item._id}
                    </span>
                    <Badge variant="primary">{item.count} posts</Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                  No posts published in the last 7 days
                </p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
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
                    {summary?.totalPosts
                      ? Math.round((summary.totalLikes || 0) / summary.totalPosts)
                      : 0}
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
                    {summary?.totalPosts
                      ? Math.round((summary.totalComments || 0) / summary.totalPosts)
                      : 0}
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
                    {summary?.totalPosts
                      ? Math.round(
                          ((summary.publishedPosts || 0) / summary.totalPosts) * 100
                        )
                      : 0}
                    %
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: summary?.totalPosts
                        ? `${((summary.publishedPosts || 0) / summary.totalPosts) * 100}%`
                        : '0%',
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6"
      >
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="primary"
              fullWidth
              icon={PenTool}
              onClick={() => navigate(ROUTES.CREATE_POST)}
            >
              Write New Post
            </Button>
            <Button
              variant="outline"
              fullWidth
              icon={FileText}
              onClick={() => navigate('/my-posts')}
            >
              View My Posts
            </Button>
            <Button
              variant="outline"
              fullWidth
              icon={TrendingUp}
              onClick={() => navigate('/analytics')}
            >
              View Analytics
            </Button>
          </div>
        </Card>
      </motion.div>
    </Container>
  );
};

export default AuthorDashboard;
