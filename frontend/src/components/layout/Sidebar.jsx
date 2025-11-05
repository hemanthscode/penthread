import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  FileText,
  Users,
  FolderOpen,
  Tag,
  BarChart3,
  Settings,
  UserCircle,
  Shield,
  Heart,
  Bookmark,
} from 'lucide-react';
import { useAuth } from '../../hooks';
import { ROUTES } from '../../utils/constants';
import { classNames } from '../../utils/helpers';

const Sidebar = () => {
  const location = useLocation();
  const { user, isAdmin, isAuthor } = useAuth();

  const getMenuItems = () => {
    const commonItems = [
      { name: 'Dashboard', icon: Home, path: ROUTES.DASHBOARD },
      { name: 'My Profile', icon: UserCircle, path: ROUTES.PROFILE },
      { name: 'Liked Posts', icon: Heart, path: '/liked-posts' },
      { name: 'Saved Posts', icon: Bookmark, path: '/favorited-posts' },
    ];

    const authorItems = [
      { name: 'My Posts', icon: FileText, path: '/my-posts' },
      { name: 'Analytics', icon: BarChart3, path: '/analytics' },
      { name: 'Categories', icon: FolderOpen, path: ROUTES.CATEGORIES },
      { name: 'Tags', icon: Tag, path: ROUTES.TAGS },
    ];

    const adminItems = [
      { name: 'All Posts', icon: FileText, path: '/admin/posts' },
      { name: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
      { name: 'Users', icon: Users, path: ROUTES.USERS },
      { name: 'Categories', icon: FolderOpen, path: ROUTES.CATEGORIES },
      { name: 'Tags', icon: Tag, path: ROUTES.TAGS },
      { name: 'Settings', icon: Settings, path: '/admin/settings' },
    ];

    if (isAdmin()) {
      return [...commonItems, ...adminItems];
    } else if (isAuthor()) {
      return [...commonItems, ...authorItems];
    }

    return commonItems;
  };

  const menuItems = getMenuItems();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-[calc(100vh-4rem)] sticky top-16">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={classNames(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors relative',
                  isActive
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 dark:bg-primary-400 rounded-r"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <Icon
                  className={classNames(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Role Badge */}
        {user && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
