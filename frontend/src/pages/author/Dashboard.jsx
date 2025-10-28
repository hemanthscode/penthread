import React from 'react';
import { useAuthorDashboard } from '../../hooks/useDashboard';
import DashboardStats from '../../components/dashboard/DashboardStats';
import PostsChart from '../../components/dashboard/PostsChart';
import Loader from '../../components/common/Loader';

const Dashboard = () => {
  const { summary, stats, loading } = useAuthorDashboard();

  if (loading) return <Loader />;

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Author Dashboard</h1>
      <DashboardStats summary={summary} />
      <PostsChart stats={stats} />
    </section>
  );
};

export default Dashboard;
