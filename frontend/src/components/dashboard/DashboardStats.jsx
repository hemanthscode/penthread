// src/components/dashboard/DashboardStats.jsx
import React from 'react';

const DashboardStats = ({ summary, role }) => {
  if (!summary) return null;

  // Define summary fields to show per role, with label and value from summary
  const statsMap = {
    admin: [
      { label: 'Total Users', value: summary.totalUsers ?? 0 },
      { label: 'Total Posts', value: summary.totalPosts ?? 0 },
      { label: 'Total Comments', value: summary.totalComments ?? 0 },
    ],
    author: [
      { label: 'Your Posts', value: summary.userPosts ?? 0 },
      { label: 'Your Comments', value: summary.userComments ?? 0 },
      { label: 'Pending Approvals', value: summary.pendingApprovals ?? 0 },
    ],
    user: [
      { label: 'Favorite Posts', value: summary.favoritePostsCount ?? 0 },
      { label: 'Comments Made', value: summary.commentsMade ?? 0 },
    ],
  };

  const statsToDisplay = statsMap[role] || [];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
      {statsToDisplay.map(({ label, value }) => (
        <div
          key={label}
          className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center"
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-2">{label}</h3>
          <p className="text-5xl font-extrabold text-indigo-600">{value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
