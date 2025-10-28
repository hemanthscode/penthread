import React from 'react';
import { useAdminDashboard } from '../../hooks';
import DashboardStats from '../../components/dashboard/DashboardStats';
import PostsChart from '../../components/dashboard/PostsChart';
import Loader from '../../components/common/Loader';

const Dashboard = () => {
  const { summary, stats, loading } = useAdminDashboard();

  if (loading) return <Loader />;

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <DashboardStats summary={summary} />
      <PostsChart stats={stats} />
    </section>
  );
};

export default Dashboard;
