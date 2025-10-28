import React from 'react';

const CommentItem = ({ comment, onModerate, onDelete }) => {
  return (
    <div className="border rounded p-3 shadow-sm bg-white">
      <div className="flex justify-between mb-2 text-sm text-gray-600">
        <span>@{comment.author?.name || 'Anonymous'}</span>
        <div className="flex space-x-2">
          <button
            className="text-blue-500 hover:underline"
            onClick={() => onModerate(comment._id, 'approve')}
          >
            Approve
          </button>
          <button
            className="text-red-500 hover:underline"
            onClick={() => onModerate(comment._id, 'reject')}
          >
            Reject
          </button>
          <button
            className="text-gray-400 hover:text-red-500"
            onClick={() => onDelete(comment._id)}
          >
            Delete
          </button>
        </div>
      </div>
      <p className="text-gray-800">{comment.content}</p>
      <div className="mt-2 text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</div>
    </div>
  );
};

export default CommentItem;
