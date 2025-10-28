import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

const AuthorLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user || user.role !== 'author') return <Navigate to="/auth/login" />;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-green-700 text-white p-4 font-bold">Author Dashboard Header</header>
      <main className="flex-grow p-6 bg-gray-100">
        <Outlet />
      </main>
      <footer className="text-center p-4 text-gray-500 text-sm">© 2025 Blog Platform Author</footer>
    </div>
  );
};

export default AuthorLayout;
