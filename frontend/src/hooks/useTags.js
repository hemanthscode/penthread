import { useEffect } from 'react';
import useTagStore from '../store/useTagStore';

const useTags = () => {
  const { tags, loading, fetchTags, createTag, updateTag, deleteTag } = useTagStore();

  useEffect(() => {
    if (tags.length === 0) {
      fetchTags();
    }
  }, []);

  return {
    tags,
    loading,
    createTag,
    updateTag,
    deleteTag,
    refetch: fetchTags,
  };
};

export default useTags;
