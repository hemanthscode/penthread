import { useEffect } from 'react';
import useTagStore from '../store/useTagStore';

const useTags = () => {
  const { tags, loading, error, fetchTags, createTag, updateTag, deleteTag } = useTagStore();

  useEffect(() => {
    if (!tags.length && !loading) {
      fetchTags();
    }
  }, []);

  return {
    tags,
    loading,
    error,
    createTag,
    updateTag,
    deleteTag,
    refetch: fetchTags,
  };
};

export default useTags;