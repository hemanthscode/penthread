import React from 'react';
import CommentItem from './CommentItem';

const CommentThread = ({ comments, onModerate, onDelete }) => {
  if (!comments || comments.length === 0) return <p>No comments yet.</p>;

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          onModerate={onModerate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default CommentThread;
