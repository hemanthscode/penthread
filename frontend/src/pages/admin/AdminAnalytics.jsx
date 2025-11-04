import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  FileText,
  MessageCircle,
  Eye,
  Heart,
  BarChart3,
  PieChart,
} from 'lucide-react';
import Container from '../../components/layout/Container';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import dashboardService from '../../services/dashboardService';
import toast from 'react-hot-toast';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [statsRes, summaryRes] = await Promise.all([
        dashboardService.getAdminStats(),
        dashboardService.getAdminSummary(),
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
      title: 'Total Users',
      value: analytics?.summary?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      growth: '+12%',
    },
    {
      title: 'Total Posts',
      value: analytics?.summary?.totalPosts || 0,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      growth: '+8%',
    },
    {
      title: 'Total Comments',
      value: analytics?.summary?.totalComments || 0,
      icon: MessageCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      growth: '+15%',
    },
    {
      title: 'Total Views',
      value: analytics?.summary?.totalViews || 0,
      icon: Eye,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      growth: '+20%',
    },
  ];

  return (
    <Container className="py-8">
      <PageHeader
        title="Platform Analytics"
        description="Comprehensive insights into platform performance"
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
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">{stat.growth}</span>
                    </div>
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
        {/* Posts by Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Posts by Status
              </h3>
            </div>
            <div className="space-y-4">
              {analytics?.stats?.postsPerStatus?.map((item) => (
                <div key={item._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={
                        item._id === 'published'
                          ? 'success'
                          : item._id === 'pending'
                          ? 'warning'
                          : 'default'
                      }
                      className="capitalize"
                    >
                      {item._id}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{
                          width: `${(item.count / analytics.summary.totalPosts) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100 min-w-[3rem] text-right">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Users by Role */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Users by Role
              </h3>
            </div>
            <div className="space-y-4">
              {analytics?.stats?.usersPerRole?.map((item) => (
                <div key={item._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge
                      variant={
                        item._id === 'admin'
                          ? 'danger'
                          : item._id === 'author'
                          ? 'primary'
                          : 'default'
                      }
                      className="capitalize"
                    >
                      {item._id}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{
                          width: `${(item.count / analytics.summary.totalUsers) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100 min-w-[3rem] text-right">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Top Posts */}
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
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analytics?.summary?.totalViews?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analytics?.summary?.totalLikes?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Likes</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analytics?.summary?.totalComments?.toLocaleString() || 0}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Comments</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </Container>
  );
};

export default AdminAnalytics;
