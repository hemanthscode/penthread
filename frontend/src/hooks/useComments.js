import { useEffect } from 'react';
import useCommentStore from '../store/useCommentStore';

const useComments = (postId) => {
  const {
    comments,
    pendingComments,
    loading,
    fetchComments,
    fetchPendingComments,
    createComment: storeCreateComment,
    moderateComment,
    deleteComment,
    clearComments,
  } = useCommentStore();

  // Fetch approved comments when postId changes
  useEffect(() => {
    if (!postId) return;
    fetchComments(postId);
  }, [postId, fetchComments]);

  // Wrapper for createComment to bind postId
  const createComment = (content) => storeCreateComment(postId, content);

  return {
    comments,
    pendingComments,
    loading,
    createComment,
    moderateComment,
    deleteComment,
    refetch: () => fetchComments(postId),
    refetchPending: () => fetchPendingComments(),
    fetchComments,
    fetchPendingComments,
    clearComments,
  };
};

export default useComments;