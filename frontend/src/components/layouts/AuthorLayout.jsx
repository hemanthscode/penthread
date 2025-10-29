// src/components/layouts/AuthorLayout.jsx
import React from 'react';
import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

const navLinkClass = ({ isActive }) =>
  `px-4 py-2 rounded-md font-medium transition-colors ${
    isActive ? 'bg-green-800 text-white' : 'text-green-200 hover:bg-green-700 hover:text-white'
  }`;

const AuthorLayout = () => {
  const { user, loading, logout } = useAuthContext();
  const navigate = useNavigate();

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!user || user.role !== 'author') return <Navigate to="/auth/login" replace />;

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-green-50">
      <header className="bg-green-700 text-white p-4 flex justify-between items-center shadow-md">
        <div className="text-2xl font-extrabold">Author Dashboard</div>
        <nav className="space-x-3 hidden md:flex items-center">
          <NavLink to="/author" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/author/posts" className={navLinkClass}>
            My Posts
          </NavLink>
          <NavLink to="/author/posts/new" className={navLinkClass}>
            New Post
          </NavLink>
          <NavLink to="/author/comments" className={navLinkClass}>
            Comments Moderation
          </NavLink>
          <NavLink to="/author/notifications" className={navLinkClass}>
            Notifications
          </NavLink>
          <button
            onClick={handleLogout}
            className="ml-6 px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 transition-colors font-semibold"
          >
            Logout
          </button>
        </nav>
      </header>
      <main className="flex-grow p-6 max-w-5xl mx-auto w-full">
        <Outlet />
      </main>
      <footer className="text-center p-4 text-gray-300 bg-green-900">
        © 2025 Blog Platform Author
      </footer>
    </div>
  );
};

export default AuthorLayout;
