// src/pages/user/Dashboard.jsx (UserDashboard)
import React from 'react';
import { useUserDashboard } from '../../hooks/useDashboard';
import DashboardStats from '../../components/dashboard/DashboardStats';
import Loader from '../../components/common/Loader';

const UserDashboard = () => {
  const { summary, loading } = useUserDashboard();

  if (loading) return <Loader />;

  return (
    <section className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Your Dashboard</h1>
      <DashboardStats summary={summary} role="user" />
    </section>
  );
};

export default UserDashboard;
