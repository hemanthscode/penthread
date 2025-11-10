import { useEffect, useCallback } from 'react';
import useCategoryStore from '../store/useCategoryStore';

const useCategories = (autoFetch = true) => {
  const { 
    categories, 
    loading, 
    error, 
    fetchCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory 
  } = useCategoryStore();

  const refetch = useCallback(async (params) => {
    return await fetchCategories(params);
  }, [fetchCategories]);

  useEffect(() => {
    if (autoFetch && categories.length === 0 && !loading) {
      fetchCategories();
    }
  }, [autoFetch]); // Only depend on autoFetch to prevent infinite loops

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch,
  };
};

export default useCategories;