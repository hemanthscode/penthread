import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import Loader from '../common/Loader';
import { ROUTES } from '../../utils/constants';

const PublicRoute = ({ children, restricted = false }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (restricted && isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

export default PublicRoute;
