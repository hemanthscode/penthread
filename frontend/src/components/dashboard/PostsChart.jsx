import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const PostsChart = ({ stats }) => {
  if (!stats) return null;

  const labels = Object.keys(stats.postsPerStatus || {});
  const data = {
    labels,
    datasets: [
      {
        label: 'Posts Count',
        data: labels.map((label) => stats.postsPerStatus[label]),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Posts by Status</h3>
      <Bar data={data} />
    </div>
  );
};

export default PostsChart;
