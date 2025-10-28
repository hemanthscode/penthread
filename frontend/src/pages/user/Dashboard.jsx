import React from 'react';
import { useUserDashboard } from '../../hooks/useDashboard';
import DashboardStats from '../../components/dashboard/DashboardStats';
import Loader from '../../components/common/Loader';

const Dashboard = () => {
  const { summary, loading } = useUserDashboard();

  if (loading) return <Loader />;

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      <DashboardStats summary={summary} />
    </section>
  );
};

export default Dashboard;
