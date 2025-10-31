import { useEffect } from 'react';
import usePostStore from '../store/usePostStore';
import interactionService from '../services/interactionService';

const usePost = (postId) => {
  const { currentPost, loading, error, fetchPost, clearCurrentPost } = usePostStore();

  useEffect(() => {
    if (postId) {
      fetchPost(postId);
      // Record view
      interactionService.recordView(postId).catch(console.error);
    }

    return () => clearCurrentPost();
  }, [postId]);

  return {
    post: currentPost,
    loading,
    error,
    refetch: () => fetchPost(postId),
  };
};

export default usePost;
