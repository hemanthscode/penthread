// src/hooks/useComments.js
import { useEffect } from 'react';
import useCommentStore from '../store/useCommentStore';

const useComments = (postId) => {
  const {
    comments,
    loading,
    fetchComments,
    createComment,
    moderateComment,
    deleteComment,
    clearComments,
  } = useCommentStore();

  useEffect(() => {
    if (postId) {
      fetchComments(postId);
    }
    return () => clearComments();
  }, [postId, fetchComments, clearComments]);

  return {
    comments,
    loading,
    createComment: (content) => createComment(postId, content),
    moderateComment,
    deleteComment,
    refetch: () => fetchComments(postId),
  };
};

export default useComments;
