import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark, MessageCircle } from 'lucide-react';
import Container from '../../components/layout/Container';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/common/Card';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import dashboardService from '../../services/dashboardService';
import toast from 'react-hot-toast';

// Utility to convert backend post URL to frontend relative URL
const toRelativePostUrl = (fullUrl) => fullUrl.replace('/api/posts/', '/posts/');

const UserDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDashboard();
  }, []);

  const fetchUserDashboard = async () => {
    setLoading(true);
    try {
      const [summaryRes, statsRes] = await Promise.all([
        dashboardService.getUserSummary(),
        dashboardService.getUserStats(),
      ]);
      if (summaryRes.success) setSummary(summaryRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load user dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  const statsCards = [
    {
      title: 'Liked Posts',
      value: summary?.likedPostsCount || 0,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Favorited Posts',
      value: summary?.favoritedPostsCount || 0,
      icon: Bookmark,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      title: 'Comments Made',
      value: summary?.commentsMade || 0,
      icon: MessageCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <Container className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PageHeader
        title="My Dashboard"
        description="Your engagement summary and recent activity"
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {statsCards.map(({ title, value, icon: Icon, color, bgColor }) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Card className="flex items-center space-x-6 p-6">
              <div
                className={`${bgColor} p-4 rounded-full flex items-center justify-center`}
                style={{ width: 56, height: 56 }}
              >
                <Icon className={`h-7 w-7 ${color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
                  {value.toLocaleString()}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Interactions */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Recent Interactions</h2>
        {stats?.recentInteractions?.length > 0 ? (
          <div className="space-y-4">
            {stats.recentInteractions.map(({ _id, post, liked, favorited, updatedAt }) => (
              <Card key={_id} className="flex flex-col sm:flex-row justify-between p-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-1">
                    <a
                      href={toRelativePostUrl(post.postUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {post.title}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    by {post.author?.name || 'Unknown Author'}
                  </p>
                </div>
                <div className="mt-3 sm:mt-0 flex items-center space-x-4 text-sm">
                  {liked && (
                    <div className="flex items-center space-x-1 text-red-600">
                      <Heart className="h-5 w-5" />
                      <span>Liked</span>
                    </div>
                  )}
                  {favorited && (
                    <div className="flex items-center space-x-1 text-indigo-600">
                      <Bookmark className="h-5 w-5" />
                      <span>Favorited</span>
                    </div>
                  )}
                  <time
                    dateTime={updatedAt}
                    className="text-gray-500 dark:text-gray-400"
                    title={new Date(updatedAt).toLocaleString()}
                  >
                    {new Date(updatedAt).toLocaleDateString()}
                  </time>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState title="No Recent Interactions" message="You have not interacted recently." />
        )}
      </section>

      {/* Recent Comments */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Recent Comments</h2>
        {stats?.recentComments?.length > 0 ? (
          <div className="space-y-4">
            {stats.recentComments.map(({ _id, post, content, createdAt }) => (
              <Card key={_id} className="p-6">
                <p className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-1">
                  <a
                    href={toRelativePostUrl(post.postUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {post.title}
                  </a>
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{content}</p>
                <time
                  dateTime={createdAt}
                  className="text-gray-500 dark:text-gray-400 text-sm"
                  title={new Date(createdAt).toLocaleString()}
                >
                  {new Date(createdAt).toLocaleDateString()}
                </time>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState title="No Recent Comments" message="You have not made any recent comments." />
        )}
      </section>
    </Container>
  );
};

export default UserDashboard;
