import { create } from 'zustand';
import tagService from '../services/tagService';
import toast from 'react-hot-toast';

const useTagStore = create((set) => ({
  tags: [],
  loading: false,

  fetchTags: async () => {
    set({ loading: true });
    try {
      const response = await tagService.getTags();
      if (response.success) {
        set({ tags: response.data, loading: false });
      }
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch tags');
    }
  },

  createTag: async (tagData) => {
    try {
      const response = await tagService.createTag(tagData);
      if (response.success) {
        set((state) => ({ tags: [...state.tags, response.data] }));
        toast.success('Tag created');
        return { success: true };
      }
    } catch (error) {
      toast.error('Failed to create tag');
      return { success: false };
    }
  },

  updateTag: async (tagId, tagData) => {
    try {
      const response = await tagService.updateTag(tagId, tagData);
      if (response.success) {
        set((state) => ({
          tags: state.tags.map((t) => (t._id === tagId ? response.data : t)),
        }));
        toast.success('Tag updated');
        return { success: true };
      }
    } catch (error) {
      toast.error('Failed to update tag');
      return { success: false };
    }
  },

  deleteTag: async (tagId) => {
    try {
      const response = await tagService.deleteTag(tagId);
      if (response.success) {
        set((state) => ({
          tags: state.tags.filter((t) => t._id !== tagId),
        }));
        toast.success('Tag deleted');
        return { success: true };
      }
    } catch (error) {
      toast.error('Failed to delete tag');
      return { success: false };
    }
  },
}));

export default useTagStore;
