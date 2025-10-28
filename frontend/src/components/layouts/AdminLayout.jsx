import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

const AdminLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Simple role-based protection
  if (!user || user.role !== 'admin') return <Navigate to="/auth/login" />;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-700 text-white p-4 font-bold">Admin Dashboard Header</header>
      <main className="flex-grow p-6 bg-gray-50">
        <Outlet />
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">© 2025 Blog Platform Admin</footer>
    </div>
  );
};

export default AdminLayout;
