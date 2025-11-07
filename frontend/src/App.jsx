// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext'; // ✅ New Toast System
import { MainLayout, DashboardLayout, ProtectedRoute, PublicRoute } from './components/layout';

// ==================== AUTH PAGES ====================
import { Login, Register, ForgotPassword, ResetPassword } from './pages/auth';

// ==================== POSTS ====================
import {
  PostList,
  PostDetail,
  CreatePost,
  EditPost,
  LikedPosts,
  FavoritedPosts,
} from './pages/posts';

// ==================== DASHBOARD ====================
import { Dashboard } from './pages/dashboard';

// ==================== PROFILE & SETTINGS ====================
import { Profile } from './pages/profile';

// ==================== USER MANAGEMENT ====================
import { UserList } from './pages/users';

// ==================== NOTIFICATIONS & ACTIVITY ====================
import { Notifications } from './pages/notifications';
import { Activity } from './pages/activity';

// ==================== CATEGORIES & TAGS ====================
import { CategoryList } from './pages/categories';
import { TagList } from './pages/tags';

// ==================== ADMIN ====================
import { AdminPosts, AdminAnalytics, AdminSettings } from './pages/admin';

// ==================== AUTHOR ====================
import { MyPosts, AuthorAnalytics } from './pages/author';

// ==================== HOME & 404 ====================
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// ==================== CONSTANTS ====================
import { ROUTES, ROLES } from './utils/constants';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* ==================== PUBLIC ROUTES ==================== */}
              <Route element={<MainLayout />}>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.POSTS} element={<PostList />} />
                <Route path={ROUTES.POST_DETAIL} element={<PostDetail />} />
              </Route>

              {/* ==================== AUTH ROUTES (Redirect if authenticated) ==================== */}
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

              {/* ==================== PROTECTED ROUTES (Dashboard Layout) ==================== */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                {/* ===== COMMON ROUTES (All Authenticated Users) ===== */}
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                <Route path={ROUTES.PROFILE} element={<Profile />} />
                <Route path="/liked-posts" element={<LikedPosts />} />
                <Route path="/favorited-posts" element={<FavoritedPosts />} />
                <Route path="/activity" element={<Activity />} />

                {/* ===== AUTHOR & ADMIN ROUTES ===== */}
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
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.AUTHOR, ROLES.ADMIN]}>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
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

                {/* ===== AUTHOR SPECIFIC ROUTES ===== */}
                <Route
                  path="/my-posts"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.AUTHOR, ROLES.ADMIN]}>
                      <MyPosts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.AUTHOR, ROLES.ADMIN]}>
                      <AuthorAnalytics />
                    </ProtectedRoute>
                  }
                />

                {/* ===== ADMIN ONLY ROUTES ===== */}
                <Route
                  path={ROUTES.USERS}
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                      <UserList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/posts"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                      <AdminPosts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                      <AdminAnalytics />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                      <AdminSettings />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* ==================== 404 NOT FOUND ==================== */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
