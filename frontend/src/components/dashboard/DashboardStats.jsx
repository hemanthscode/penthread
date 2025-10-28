import React from 'react';

const DashboardStats = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-white p-4 rounded shadow text-center">
        <h3 className="text-xl font-semibold">Users</h3>
        <p className="text-3xl">{summary.totalUsers}</p>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <h3 className="text-xl font-semibold">Posts</h3>
        <p className="text-3xl">{summary.totalPosts}</p>
      </div>
      <div className="bg-white p-4 rounded shadow text-center">
        <h3 className="text-xl font-semibold">Comments</h3>
        <p className="text-3xl">{summary.totalComments}</p>
      </div>
    </div>
  );
};

export default DashboardStats;
