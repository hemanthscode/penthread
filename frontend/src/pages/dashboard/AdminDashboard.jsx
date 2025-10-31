import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  MessageCircle,
  TrendingUp,
  Activity,
  PieChart,
  BarChart3,
  Plus,
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

const AdminDashboard = () => {
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
        dashboardService.getAdminSummary(),
        dashboardService.getAdminStats(),
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
      title: 'Total Users',
      value: summary?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Total Posts',
      value: summary?.totalPosts || 0,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      change: '+8%',
      trend: 'up',
    },
    {
      title: 'Total Comments',
      value: summary?.totalComments || 0,
      icon: MessageCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      change: '+15%',
      trend: 'up',
    },
    {
      title: 'Engagement Rate',
      value: '68%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      change: '+5%',
      trend: 'up',
    },
  ];

  const postsByStatus = stats?.postsPerStatus || [];
  const usersByRole = stats?.usersPerRole || [];

  return (
    <Container className="py-8">
      <PageHeader
        title="Admin Dashboard"
        description="Manage your platform and monitor key metrics"
        icon={Activity}
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
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">{stat.change}</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
            <div className="space-y-3">
              {postsByStatus.map((item) => (
                <div key={item._id} className="flex items-center justify-between">
                  <div className="flex items-center">
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
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {item.count}
                  </span>
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
                <BarChart3 className="h-5 w-5 mr-2" />
                Users by Role
              </h3>
            </div>
            <div className="space-y-3">
              {usersByRole.map((item) => (
                <div key={item._id} className="flex items-center justify-between">
                  <div className="flex items-center">
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
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              fullWidth
              icon={Users}
              onClick={() => navigate(ROUTES.USERS)}
            >
              Manage Users
            </Button>
            <Button
              variant="outline"
              fullWidth
              icon={FileText}
              onClick={() => navigate('/admin/posts')}
            >
              Manage Posts
            </Button>
            <Button
              variant="outline"
              fullWidth
              icon={Plus}
              onClick={() => navigate(ROUTES.CREATE_POST)}
            >
              Create Post
            </Button>
          </div>
        </Card>
      </motion.div>
    </Container>
  );
};

export default AdminDashboard;
