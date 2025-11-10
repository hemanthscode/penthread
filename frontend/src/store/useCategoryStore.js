import { create } from 'zustand';
import categoryService from '../services/categoryService';
import toast from 'react-hot-toast';

const useCategoryStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await categoryService.getCategories(params);
      set({ 
        categories: response.success ? response.data : [], 
        loading: false 
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch categories';
      set({ loading: false, error: errorMsg, categories: [] });
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await categoryService.createCategory(categoryData);
      if (response.success && response.data) {
        set((state) => ({ 
          categories: [...state.categories, response.data] 
        }));
        toast.success(response.message || 'Category created successfully');
        return { success: true, data: response.data };
      }
      throw new Error(response.message || 'Failed to create category');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to create category';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  },

  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await categoryService.updateCategory(categoryId, categoryData);
      if (response.success && response.data) {
        set((state) => ({
          categories: state.categories.map((c) => 
            c._id === categoryId ? response.data : c
          ),
        }));
        toast.success(response.message || 'Category updated successfully');
        return { success: true, data: response.data };
      }
      throw new Error(response.message || 'Failed to update category');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update category';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  },

  deleteCategory: async (categoryId) => {
    try {
      const response = await categoryService.deleteCategory(categoryId);
      if (response.success) {
        set((state) => ({
          categories: state.categories.filter((c) => c._id !== categoryId),
        }));
        toast.success(response.message || 'Category deleted successfully');
        return { success: true };
      }
      throw new Error(response.message || 'Failed to delete category');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to delete category';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  },

  resetCategories: () => {
    set({ categories: [], loading: false, error: null });
  },
}));

export default useCategoryStore;