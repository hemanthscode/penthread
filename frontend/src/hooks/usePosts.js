import { useEffect } from 'react';
import usePostStore from '../store/usePostStore';

const usePosts = (params = {}) => {
  const {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    toggleFavorite,
  } = usePostStore();

  useEffect(() => {
    fetchPosts(params);
  }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    toggleFavorite,
  };
};

export default usePosts;
