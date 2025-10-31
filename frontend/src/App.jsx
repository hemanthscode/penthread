// src/App.jsx - Update the routes section
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import {
  MainLayout,
  DashboardLayout,
  ProtectedRoute,
  PublicRoute,
} from './components/layout';

// Auth Pages
import { Login, Register, ForgotPassword, ResetPassword } from './pages/auth';

// Post Pages
import { PostList, PostDetail, CreatePost, EditPost } from './pages/posts';

// Dashboard Pages
import { Dashboard } from './pages/dashboard';

// Profile & Settings
import { Profile } from './pages/profile';

// User Management
import { UserList } from './pages/users';

// Notifications
import { Notifications } from './pages/notifications';

// Categories & Tags
import { CategoryList } from './pages/categories';
import { TagList } from './pages/tags';

// Home Page
import Home from './pages/Home';

// 404 Page
import NotFound from './pages/NotFound';

// Constants
import { ROUTES, ROLES } from './utils/constants';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
              },
              success: {
                iconTheme: {
                  primary: 'var(--color-success)',
                  secondary: 'var(--color-surface)',
                },
              },
              error: {
                iconTheme: {
                  primary: 'var(--color-error)',
                  secondary: 'var(--color-surface)',
                },
              },
            }}
          />

          <Routes>
            {/* Public Routes */}
            <Route element={<MainLayout />}>
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.POSTS} element={<PostList />} />
              <Route path={ROUTES.POST_DETAIL} element={<PostDetail />} />
            </Route>

            {/* Auth Routes (Restricted - redirect if authenticated) */}
            <Route
              path={ROUTES.LOGIN}
              element={
                <PublicRoute restricted>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path={ROUTES.REGISTER}
              element={
                <PublicRoute restricted>
                  <Register />
                </PublicRoute>
              }
            />
            <Route
              path={ROUTES.FORGOT_PASSWORD}
              element={
                <PublicRoute restricted>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
            <Route
              path={ROUTES.RESET_PASSWORD}
              element={
                <PublicRoute restricted>
                  <ResetPassword />
                </PublicRoute>
              }
            />

            {/* Protected Routes - Dashboard Layout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.PROFILE} element={<Profile />} />
              <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />

              {/* Categories & Tags - Author/Admin only */}
              <Route
                path={ROUTES.CATEGORIES}
                element={
                  <ProtectedRoute allowedRoles={[ROLES.AUTHOR, ROLES.ADMIN]}>
                    <CategoryList />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.TAGS}
                element={
                  <ProtectedRoute allowedRoles={[ROLES.AUTHOR, ROLES.ADMIN]}>
                    <TagList />
                  </ProtectedRoute>
                }
              />

              {/* Author & Admin Routes */}
              <Route
                path={ROUTES.CREATE_POST}
                element={
                  <ProtectedRoute allowedRoles={[ROLES.AUTHOR, ROLES.ADMIN]}>
                    <CreatePost />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.EDIT_POST}
                element={
                  <ProtectedRoute allowedRoles={[ROLES.AUTHOR, ROLES.ADMIN]}>
                    <EditPost />
                  </ProtectedRoute>
                }
              />

              {/* Admin Only Routes */}
              <Route
                path={ROUTES.USERS}
                element={
                  <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                    <UserList />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
