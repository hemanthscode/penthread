import { create } from 'zustand';
import tagService from '../services/tagService';
import toast from 'react-hot-toast';

const useTagStore = create((set) => ({
  tags: [],
  loading: false,
  error: null,

  fetchTags: async () => {
    set({ loading: true, error: null });
    try {
      const { success, data } = await tagService.getTags();
      set({ tags: success ? data : [], loading: false });
    } catch (error) {
      set({ loading: false, error: error.message });
      toast.error('Failed to fetch tags');
    }
  },

  createTag: async (tagData) => {
    try {
      const { success, data } = await tagService.createTag(tagData);
      if (success) {
        set((state) => ({ tags: [...state.tags, data] }));
        toast.success('Tag created successfully');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create tag');
      return { success: false };
    }
  },

  updateTag: async (tagId, tagData) => {
    try {
      const { success, data } = await tagService.updateTag(tagId, tagData);
      if (success) {
        set((state) => ({
          tags: state.tags.map((t) => (t._id === tagId ? data : t)),
        }));
        toast.success('Tag updated successfully');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update tag');
      return { success: false };
    }
  },

  deleteTag: async (tagId) => {
    try {
      const { success } = await tagService.deleteTag(tagId);
      if (success) {
        set((state) => ({
          tags: state.tags.filter((t) => t._id !== tagId),
        }));
        toast.success('Tag deleted successfully');
        return { success: true };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete tag');
      return { success: false };
    }
  },
}));

export default useTagStore;