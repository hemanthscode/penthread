import { create } from 'zustand';
import commentService from '../services/commentService';
import toast from 'react-hot-toast';

const useCommentStore = create((set, get) => ({
  comments: [],
  pendingComments: [],
  loading: false,

  fetchComments: async (postId) => {
    set({ loading: true });
    try {
      const response = await commentService.getComments(postId);
      if (response.success) {
        set({ comments: response.data, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch comments:', error);
    }
  },

  fetchPendingComments: async () => {
    set({ loading: true });
    try {
      const response = await commentService.getPendingComments();
      if (response.success) {
        set({ pendingComments: response.data, loading: false });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch pending comments:', error);
    }
  },

  createComment: async (postId, content) => {
    try {
      const response = await commentService.createComment(postId, content);
      if (response.success) {
        toast.success('Comment submitted for approval');
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error || 'Failed to add comment' };
      }
    } catch (error) {
      console.error('Failed to create comment:', error);
      return { success: false, error: error.message || 'Failed to add comment' };
    }
  },

  moderateComment: async (commentId, action) => {
    try {
      const response = await commentService.moderateComment(commentId, action);
      if (response.success) {
        // Update both comments and pendingComments arrays
        set((state) => ({
          comments: state.comments.map((c) =>
            (c._id === commentId || c.id === commentId)
              ? { ...c, status: response.data.status }
              : c
          ),
          pendingComments: state.pendingComments.filter(
            (c) => c._id !== commentId && c.id !== commentId
          ),
        }));

        // Add to comments list if approved
        if (action === 'approve' && response.data) {
          set((state) => ({
            comments: [...state.comments.filter(c => c._id !== commentId && c.id !== commentId), response.data],
          }));
        }

        toast.success(`Comment ${action}d successfully`);
        return { success: true, data: response.data };
      } else {
        toast.error(response.error || 'Failed to moderate comment');
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Failed to moderate comment:', error);
      toast.error('Failed to moderate comment');
      return { success: false, error: error.message };
    }
  },

  deleteComment: async (commentId) => {
    try {
      const response = await commentService.deleteComment(commentId);
      if (response.success) {
        set((state) => ({
          comments: state.comments.filter(
            (c) => c._id !== commentId && c.id !== commentId
          ),
          pendingComments: state.pendingComments.filter(
            (c) => c._id !== commentId && c.id !== commentId
          ),
        }));
        toast.success('Comment deleted successfully');
        return { success: true };
      } else {
        toast.error(response.error || 'Failed to delete comment');
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error('Failed to delete comment');
      return { success: false, error: error.message };
    }
  },

  clearComments: () => set({ comments: [], pendingComments: [] }),
}));

export default useCommentStore;