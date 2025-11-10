import { create } from 'zustand';
import tagService from '../services/tagService';
import toast from 'react-hot-toast';

const useTagStore = create((set, get) => ({
  tags: [],
  popularTags: [],
  loading: false,
  error: null,

  fetchTags: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await tagService.getTags(params);
      set({ 
        tags: response.success ? response.data : [], 
        loading: false 
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch tags';
      set({ loading: false, error: errorMsg, tags: [] });
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  },

  fetchPopularTags: async (limit = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await tagService.getPopularTags(limit);
      set({ 
        popularTags: response.success ? response.data : [], 
        loading: false 
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch popular tags';
      set({ loading: false, error: errorMsg });
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  },

  createTag: async (tagData) => {
    try {
      const response = await tagService.createTag(tagData);
      if (response.success && response.data) {
        set((state) => ({ 
          tags: [...state.tags, response.data] 
        }));
        toast.success(response.message || 'Tag created successfully');
        return { success: true, data: response.data };
      }
      throw new Error(response.message || 'Failed to create tag');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to create tag';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  },

  updateTag: async (tagId, tagData) => {
    try {
      const response = await tagService.updateTag(tagId, tagData);
      if (response.success && response.data) {
        set((state) => ({
          tags: state.tags.map((t) => 
            t._id === tagId ? response.data : t
          ),
        }));
        toast.success(response.message || 'Tag updated successfully');
        return { success: true, data: response.data };
      }
      throw new Error(response.message || 'Failed to update tag');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update tag';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  },

  deleteTag: async (tagId) => {
    try {
      const response = await tagService.deleteTag(tagId);
      if (response.success) {
        set((state) => ({
          tags: state.tags.filter((t) => t._id !== tagId),
        }));
        toast.success(response.message || 'Tag deleted successfully');
        return { success: true };
      }
      throw new Error(response.message || 'Failed to delete tag');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to delete tag';
      toast.error(errorMsg);
      return { success: false, error: errorMsg };
    }
  },

  resetTags: () => {
    set({ tags: [], popularTags: [], loading: false, error: null });
  },
}));

export default useTagStore;