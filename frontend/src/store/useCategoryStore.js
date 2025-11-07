import { create } from 'zustand';
import categoryService from '../services/categoryService';
import toast from 'react-hot-toast';

const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const { success, data } = await categoryService.getCategories();
      set({ categories: success ? data : [], loading: false });
    } catch (error) {
      set({ loading: false, error: error.message });
      toast.error('Failed to fetch categories');
    }
  },

  createCategory: async (categoryData) => {
    try {
      const { success, data } = await categoryService.createCategory(categoryData);
      if (success) {
        set((state) => ({ categories: [...state.categories, data] }));
        toast.success('Category created successfully');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create category');
      return { success: false };
    }
  },

  updateCategory: async (categoryId, categoryData) => {
    try {
      const { success, data } = await categoryService.updateCategory(categoryId, categoryData);
      if (success) {
        set((state) => ({
          categories: state.categories.map((c) => (c._id === categoryId ? data : c)),
        }));
        toast.success('Category updated successfully');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update category');
      return { success: false };
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      const { success } = await categoryService.deleteCategory(categoryId);
      if (success) {
        set((state) => ({
          categories: state.categories.filter((c) => c._id !== categoryId),
        }));
        toast.success('Category deleted successfully');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete category');
      return { success: false };
    }
  },
}));

export default useCategoryStore;