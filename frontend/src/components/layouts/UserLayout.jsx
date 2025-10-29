// src/components/layouts/UserLayout.jsx
import React from 'react';
import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

const navLinkClass = ({ isActive }) =>
  `px-4 py-2 rounded-md font-medium transition-colors ${
    isActive ? 'bg-indigo-800 text-white' : 'text-indigo-600 hover:bg-indigo-700 hover:text-white'
  }`;

const UserLayout = () => {
  const { user, loading, logout } = useAuthContext();
  const navigate = useNavigate();

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!user || user.role !== 'user') return <Navigate to="/auth/login" replace />;

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-indigo-50">
      <header className="bg-indigo-700 text-white p-4 flex justify-between items-center shadow-lg">
        <div className="text-2xl font-extrabold">User Dashboard</div>
        <nav className="space-x-3 hidden md:flex items-center">
          <NavLink to="/user" end className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/user/posts" className={navLinkClass}>
            Posts
          </NavLink>
          <NavLink to="/user/profile" className={navLinkClass}>
            Profile
          </NavLink>
          <NavLink to="/user/notifications" className={navLinkClass}>
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
      <main className="flex-grow p-6 max-w-4xl mx-auto w-full">
        <Outlet />
      </main>
      <footer className="text-center p-4 text-gray-300 bg-indigo-900">
        © 2025 Blog Platform User
      </footer>
    </div>
  );
};

export default UserLayout;
