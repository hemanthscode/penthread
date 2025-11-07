import { useEffect } from 'react';
import useCategoryStore from '../store/useCategoryStore';

const useCategories = () => {
  const { categories, loading, error, fetchCategories, createCategory, updateCategory, deleteCategory } =
    useCategoryStore();

  useEffect(() => {
    if (!categories.length && !loading) {
      fetchCategories();
    }
  }, []);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
};

export default useCategories;