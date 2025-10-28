import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

const UserLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user || user.role !== 'user') return <Navigate to="/auth/login" />;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-indigo-700 text-white p-4 font-bold">User Dashboard Header</header>
      <main className="flex-grow p-6 bg-white">
        <Outlet />
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">© 2025 Blog Platform User</footer>
    </div>
  );
};

export default UserLayout;
