// src/components/comments/CommentForm.jsx
import React, { useState } from 'react';

const CommentForm = ({ onSubmit, placeholder = 'Write a comment...', disabled }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
      <textarea
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y min-h-[80px]"
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={disabled}
        required
        aria-label="Write a comment"
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        disabled={disabled}
      >
        Comment
      </button>
    </form>
  );
};

export default CommentForm;
