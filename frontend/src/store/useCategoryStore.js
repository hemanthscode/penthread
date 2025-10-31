import { create } from 'zustand';
import categoryService from '../services/categoryService';
import toast from 'react-hot-toast';

const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,

  fetchCategories: async () => {
    set({ loading: true });
    try {
      const response = await categoryService.getCategories();
      if (response.success) {
        set({ categories: response.data, loading: false });
      }
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch categories');
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      if (response.success) {
        set((state) => ({ categories: [...state.categories, response.data] }));
        toast.success('Category created');
        return { success: true };
      }
    } catch (error) {
      toast.error('Failed to create category');
      return { success: false };
    }
  },

  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await categoryService.updateCategory(categoryId, categoryData);
      if (response.success) {
        set((state) => ({
          categories: state.categories.map((c) => (c._id === categoryId ? response.data : c)),
        }));
        toast.success('Category updated');
        return { success: true };
      }
    } catch (error) {
      toast.error('Failed to update category');
      return { success: false };
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      const response = await categoryService.deleteCategory(categoryId);
      if (response.success) {
        set((state) => ({
          categories: state.categories.filter((c) => c._id !== categoryId),
        }));
        toast.success('Category deleted');
        return { success: true };
      }
    } catch (error) {
      toast.error('Failed to delete category');
      return { success: false };
    }
  },
}));

export default useCategoryStore;
