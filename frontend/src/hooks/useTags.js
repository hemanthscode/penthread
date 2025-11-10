import { useEffect, useCallback } from 'react';
import useTagStore from '../store/useTagStore';

const useTags = (autoFetch = true) => {
  const { 
    tags, 
    popularTags,
    loading, 
    error, 
    fetchTags,
    fetchPopularTags, 
    createTag, 
    updateTag, 
    deleteTag 
  } = useTagStore();

  const refetch = useCallback(async (params) => {
    return await fetchTags(params);
  }, [fetchTags]);

  const refetchPopular = useCallback(async (limit) => {
    return await fetchPopularTags(limit);
  }, [fetchPopularTags]);

  useEffect(() => {
    if (autoFetch && tags.length === 0 && !loading) {
      fetchTags();
    }
  }, [autoFetch]); // Only depend on autoFetch to prevent infinite loops

  return {
    tags,
    popularTags,
    loading,
    error,
    createTag,
    updateTag,
    deleteTag,
    refetch,
    refetchPopular,
  };
};

export default useTags;