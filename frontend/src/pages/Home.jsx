import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, PenTool, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks';
import Container from '../components/layout/Container';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { ROUTES } from '../utils/constants';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'Rich Content',
      description: 'Create and share beautiful blog posts with our intuitive editor',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: PenTool,
      title: 'Easy Publishing',
      description: 'Publish your thoughts instantly with our streamlined workflow',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: Users,
      title: 'Engaged Community',
      description: 'Connect with readers through comments and interactions',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      icon: TrendingUp,
      title: 'Track Performance',
      description: 'Monitor your content performance with detailed analytics',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <Container className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="flex justify-center mb-6">
            <BookOpen className="h-16 w-16 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Share Your Stories with the World
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            A modern blogging platform designed for writers, readers, and storytellers.
            Create, publish, and engage with content that matters.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate(ROUTES.DASHBOARD)}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(ROUTES.POSTS)}
                >
                  Explore Posts
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate(ROUTES.REGISTER)}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate(ROUTES.LOGIN)}
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </Container>

      {/* Features Section */}
      <Container className="py-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Powerful features to help you create and grow your audience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card hover className="h-full text-center">
                  <div className={`${feature.bgColor} w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Container>

      {/* CTA Section */}
      <Container className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 text-white text-center p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Writing?
            </h2>
            <p className="text-lg mb-8 text-primary-100">
              Join thousands of writers sharing their stories on our platform
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(isAuthenticated ? ROUTES.CREATE_POST : ROUTES.REGISTER)}
            >
              {isAuthenticated ? 'Create Your First Post' : 'Sign Up for Free'}
            </Button>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};

export default Home;
