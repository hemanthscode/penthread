import React, { useEffect, useState } from 'react';
import { useComments } from '../../hooks/useComments';
import CommentThread from '../../components/comments/CommentThread';
import Loader from '../../components/common/Loader';
import * as commentService from '../../services/commentService';

const CommentsModeration = () => {
  const { comments, loading, fetchComments } = useComments(null); // Fetch all comments not filtered by post in production

  useEffect(() => {
    fetchComments(); // In production, replace with API to fetch comments needing moderation
  }, []);

  const moderateComment = async (id, action) => {
    await commentService.moderateComment(id, action);
    await fetchComments();
  };

  const deleteComment = async (id) => {
    await commentService.deleteComment(id);
    await fetchComments();
  };

  if (loading) return <Loader />;

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Moderate Comments</h1>
      <CommentThread comments={comments} onModerate={moderateComment} onDelete={deleteComment} />
    </section>
  );
};

export default CommentsModeration;
