import { create } from 'zustand';
import commentService from '../services/commentService';
import toast from 'react-hot-toast';

const useCommentStore = create((set) => ({
  comments: [],
  loading: false,

  fetchComments: async (postId) => {
    set({ loading: true });
    try {
      const response = await commentService.getComments(postId);
      if (response.success) {
        set({ comments: response.data, loading: false });
      }
    } catch (error) {
      set({ loading: false });
      toast.error('Failed to fetch comments');
    }
  },

  createComment: async (postId, content) => {
    try {
      const response = await commentService.createComment(postId, content);
      if (response.success) {
        toast.success('Comment added (pending approval)');
        return { success: true, data: response.data };
      }
    } catch (error) {
      toast.error('Failed to add comment');
      return { success: false, error: error.message };
    }
  },

  moderateComment: async (commentId, action) => {
    try {
      const response = await commentService.moderateComment(commentId, action);
      if (response.success) {
        set((state) => ({
          comments: state.comments.map((c) =>
            c._id === commentId ? { ...c, status: response.data.status } : c
          ),
        }));
        toast.success(`Comment ${action}d`);
        return { success: true };
      }
    } catch (error) {
      toast.error('Failed to moderate comment');
      return { success: false };
    }
  },

  deleteComment: async (commentId) => {
    try {
      const response = await commentService.deleteComment(commentId);
      if (response.success) {
        set((state) => ({
          comments: state.comments.filter((c) => c._id !== commentId),
        }));
        toast.success('Comment deleted');
        return { success: true };
      }
    } catch (error) {
      toast.error('Failed to delete comment');
      return { success: false };
    }
  },

  clearComments: () => set({ comments: [] }),
}));

export default useCommentStore;
