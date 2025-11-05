import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  Activity,
  User,
  LogOut,
  Settings,
  BookOpen,
  PenTool,
} from 'lucide-react';
import { useAuth } from '../../hooks';
import { useTheme } from '../../context/ThemeContext';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import Dropdown, { DropdownItem } from '../common/Dropdown';
import Badge from '../common/Badge';
import notificationService from '../../services/notificationService';
import { ROUTES } from '../../utils/constants';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isAuthenticated, logout, isAuthor, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && (isAuthor() || isAdmin())) {
      fetchUnreadCount();
    }
  }, [isAuthenticated, isAuthor, isAdmin]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getNotifications();
      if (response.success) {
        const unread = response.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const navLinks = [
    { name: 'Home', path: ROUTES.HOME },
    { name: 'Posts', path: ROUTES.POSTS },
  ];

  const showNotifications = isAuthenticated && (isAuthor() || isAdmin());
  const showActivity = isAuthenticated;

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              PenThread
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {isAuthenticated ? (
              <>
                {/* Activity (All authenticated users) */}
                {showActivity && (
                  <button
                    onClick={() => navigate('/activity')}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Activity"
                  >
                    <Activity className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                  </button>
                )}

                {/* Notifications (Author/Admin only) */}
                {showNotifications && (
                  <button
                    onClick={() => navigate('/notifications')}
                    className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Notifications"
                  >
                    <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                )}

                {/* Create Post Button (Author/Admin only) */}
                {(isAuthor() || isAdmin()) && (
                  <Button
                    onClick={() => navigate(ROUTES.CREATE_POST)}
                    size="sm"
                    icon={PenTool}
                  >
                    Write
                  </Button>
                )}

                {/* User Menu */}
                <Dropdown
                  trigger={
                    <div className="flex items-center space-x-2 cursor-pointer">
                      <Avatar name={user?.name} size="md" />
                    </div>
                  }
                  align="right"
                >
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                    <Badge variant="primary" size="sm" className="mt-1 capitalize">
                      {user?.role}
                    </Badge>
                  </div>

                  <DropdownItem icon={User} onClick={() => navigate(ROUTES.PROFILE)}>
                    Profile
                  </DropdownItem>

                  <DropdownItem icon={BookOpen} onClick={() => navigate(ROUTES.DASHBOARD)}>
                    Dashboard
                  </DropdownItem>

                  <DropdownItem icon={Settings} onClick={() => navigate(ROUTES.PROFILE)}>
                    Settings
                  </DropdownItem>

                  <div className="border-t border-gray-200 dark:border-gray-700 my-1" />

                  <DropdownItem icon={LogOut} onClick={handleLogout} danger>
                    Logout
                  </DropdownItem>
                </Dropdown>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.LOGIN)}>
                  Login
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate(ROUTES.REGISTER)}>
                  Sign Up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium px-2 py-1"
                >
                  {link.name}
                </Link>
              ))}

              <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

              {isAuthenticated ? (
                <>
                  <Link
                    to={ROUTES.PROFILE}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium px-2 py-1"
                  >
                    Profile
                  </Link>
                  <Link
                    to={ROUTES.DASHBOARD}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium px-2 py-1"
                  >
                    Dashboard
                  </Link>
                  {showActivity && (
                    <Link
                      to="/activity"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium px-2 py-1"
                    >
                      Activity
                    </Link>
                  )}
                  {showNotifications && (
                    <Link
                      to="/notifications"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium px-2 py-1 flex items-center justify-between"
                    >
                      Notifications
                      {unreadCount > 0 && (
                        <Badge variant="danger" size="sm">
                          {unreadCount}
                        </Badge>
                      )}
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors font-medium px-2 py-1 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate(ROUTES.LOGIN);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate(ROUTES.REGISTER);
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
