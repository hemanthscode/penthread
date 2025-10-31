import { useEffect } from 'react';
import { useAuth } from '../../hooks';
import { ROLES } from '../../utils/constants';
import AdminDashboard from './AdminDashboard';
import AuthorDashboard from './AuthorDashboard';
import UserDashboard from './UserDashboard';
import Loader from '../../components/common/Loader';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  // Route to appropriate dashboard based on role
  switch (user?.role) {
    case ROLES.ADMIN:
      return <AdminDashboard />;
    case ROLES.AUTHOR:
      return <AuthorDashboard />;
    case ROLES.USER:
      return <UserDashboard />;
    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600 dark:text-gray-400">
            Unable to load dashboard
          </p>
        </div>
      );
  }
};

export default Dashboard;
