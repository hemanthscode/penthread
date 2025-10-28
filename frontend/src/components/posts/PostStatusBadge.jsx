import React from 'react';

const statusColors = {
  draft: 'bg-gray-300 text-gray-700',
  pending: 'bg-yellow-300 text-yellow-900',
  approved: 'bg-green-300 text-green-900',
  rejected: 'bg-red-300 text-red-900',
  published: 'bg-blue-300 text-blue-900',
  unpublished: 'bg-gray-300 text-gray-700',
};

const PostStatusBadge = ({ status }) => {
  if (!status) return null;

  const classes = statusColors[status.toLowerCase()] || statusColors.draft;

  return (
    <span className={`px-2 py-1 rounded text-xs font-semibold uppercase ${classes}`}>
      {status}
    </span>
  );
};

export default PostStatusBadge;
