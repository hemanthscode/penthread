// src/components/layouts/AdminLayout.jsx
import React from 'react';
import { Outlet, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

const navLinkClass = ({ isActive }) =>
  `px-4 py-2 rounded-md font-medium transition-colors ${
    isActive ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-700 hover:text-white'
  }`;

const AdminLayout = () => {
  const { user, loading, logout } = useAuthContext();
  const navigate = useNavigate();

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/auth/login" replace />;

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-50">
      <header className="bg-blue-700 text-white p-4 flex justify-between items-center shadow-lg">
        <div className="text-2xl font-extrabold">Admin Dashboard</div>
        <nav className="space-x-3 hidden md:flex items-center">
          <NavLink to="/admin" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/admin/users" className={navLinkClass}>
            Users
          </NavLink>
          <NavLink to="/admin/categories" className={navLinkClass}>
            Categories
          </NavLink>
          <NavLink to="/admin/tags" className={navLinkClass}>
            Tags
          </NavLink>
          <NavLink to="/admin/posts" className={navLinkClass}>
            Posts
          </NavLink>
          <NavLink to="/admin/notifications" className={navLinkClass}>
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
      <main className="flex-grow p-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
      <footer className="text-center p-4 text-gray-300 bg-blue-900">
        © 2025 Blog Platform Admin
      </footer>
    </div>
  );
};

export default AdminLayout;
