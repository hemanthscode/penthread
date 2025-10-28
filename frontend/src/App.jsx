import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { UserPreferenceProvider } from './contexts/UserPreferenceContext';

import { AdminLayout, AuthorLayout, UserLayout } from './components/layouts';

import Home from './pages/misc/Home';
import About from './pages/misc/About';
import NotFound from './pages/misc/NotFound';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import AdminDashboard from './pages/admin/Dashboard';
import UsersManagement from './pages/admin/User';
import AdminCategories from './pages/admin/Categories';
import AdminTags from './pages/admin/Tags';
import PostsManagement from './pages/admin/PostsManagement';
import AdminNotifications from './pages/admin/Notifications';

import AuthorDashboard from './pages/author/Dashboard';
import AuthorPosts from './pages/author/Posts';
import AuthorPostEditor from './pages/author/PostEditor';
import AuthorCommentsModeration from './pages/author/CommentsModeration';
import AuthorNotifications from './pages/author/Notifications';

import UserDashboard from './pages/user/Dashboard';
import UserPosts from './pages/user/Posts';
import PostDetails from './pages/user/PostDetails';
import UserProfile from './pages/user/Profile';
import UserNotifications from './pages/user/Notifications';

// PrivateRoute component – moved inside AuthProvider so can call useAuth safely
const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = React.useContext(require('./contexts/AuthContext').AuthContext);
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth/login" />;
  if (requiredRole && user.role !== requiredRole) return <Navigate to="/auth/login" />;
  
  return children;
};

const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <NotificationProvider>
        <UserPreferenceProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <PrivateRoute requiredRole="admin">
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UsersManagement />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="tags" element={<AdminTags />} />
              <Route path="posts" element={<PostsManagement />} />
              <Route path="notifications" element={<AdminNotifications />} />
            </Route>

            {/* Author Routes */}
            <Route
              path="/author/*"
              element={
                <PrivateRoute requiredRole="author">
                  <AuthorLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<AuthorDashboard />} />
              <Route path="posts" element={<AuthorPosts />} />
              <Route path="posts/new" element={<AuthorPostEditor />} />
              <Route path="posts/edit/:id" element={<AuthorPostEditor />} />
              <Route path="comments" element={<AuthorCommentsModeration />} />
              <Route path="notifications" element={<AuthorNotifications />} />
            </Route>

            {/* User Routes */}
            <Route
              path="/user/*"
              element={
                <PrivateRoute requiredRole="user">
                  <UserLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<UserDashboard />} />
              <Route path="posts" element={<UserPosts />} />
              <Route path="posts/:id" element={<PostDetails />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="notifications" element={<UserNotifications />} />
            </Route>

            {/* Catch-all 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </UserPreferenceProvider>
      </NotificationProvider>
    </ThemeProvider>
  </AuthProvider>
);

export default App;
