import { create } from 'zustand';
import postService from '../services/postService';
import toast from 'react-hot-toast';

const usePostStore = create((set, get) => ({
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },

  fetchPosts: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const response = await postService.getPosts(params);
      if (response.success) {
        set({ posts: response.data, loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error('Failed to fetch posts');
    }
  },

  fetchPost: async (postId) => {
    set({ loading: true, error: null });
    try {
      const response = await postService.getPost(postId);
      if (response.success) {
        set({ currentPost: response.data, loading: false });
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error('Failed to fetch post');
    }
  },

  createPost: async (postData) => {
    set({ loading: true, error: null });
    try {
      const response = await postService.createPost(postData);
      if (response.success) {
        set({ loading: false });
        toast.success('Post created successfully');
        return { success: true, data: response.data };
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error('Failed to create post');
      return { success: false, error: error.message };
    }
  },

  updatePost: async (postId, postData) => {
    set({ loading: true, error: null });
    try {
      const response = await postService.updatePost(postId, postData);
      if (response.success) {
        set({ loading: false });
        toast.success('Post updated successfully');
        return { success: true, data: response.data };
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error('Failed to update post');
      return { success: false, error: error.message };
    }
  },

  deletePost: async (postId) => {
    set({ loading: true, error: null });
    try {
      const response = await postService.deletePost(postId);
      if (response.success) {
        set((state) => ({
          posts: state.posts.filter((post) => post._id !== postId),
          loading: false,
        }));
        toast.success('Post deleted successfully');
        return { success: true };
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      toast.error('Failed to delete post');
      return { success: false, error: error.message };
    }
  },

  toggleLike: async (postId) => {
    try {
      const response = await postService.toggleLike(postId);
      if (response.success) {
        set((state) => ({
          posts: state.posts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  userInteractions: {
                    ...post.userInteractions,
                    liked: response.data.liked,
                  },
                  likesCount: response.data.liked ? post.likesCount + 1 : post.likesCount - 1,
                }
              : post
          ),
          currentPost:
            state.currentPost?._id === postId
              ? {
                  ...state.currentPost,
                  userInteractions: {
                    ...state.currentPost.userInteractions,
                    liked: response.data.liked,
                  },
                  likesCount: response.data.liked
                    ? state.currentPost.likesCount + 1
                    : state.currentPost.likesCount - 1,
                }
              : state.currentPost,
        }));
      }
    } catch (error) {
      toast.error('Failed to toggle like');
    }
  },

  toggleFavorite: async (postId) => {
    try {
      const response = await postService.toggleFavorite(postId);
      if (response.success) {
        set((state) => ({
          posts: state.posts.map((post) =>
            post._id === postId
              ? {
                  ...post,
                  userInteractions: {
                    ...post.userInteractions,
                    favorited: response.data.favorited,
                  },
                  favoritesCount: response.data.favorited
                    ? post.favoritesCount + 1
                    : post.favoritesCount - 1,
                }
              : post
          ),
          currentPost:
            state.currentPost?._id === postId
              ? {
                  ...state.currentPost,
                  userInteractions: {
                    ...state.currentPost.userInteractions,
                    favorited: response.data.favorited,
                  },
                  favoritesCount: response.data.favorited
                    ? state.currentPost.favoritesCount + 1
                    : state.currentPost.favoritesCount - 1,
                }
              : state.currentPost,
        }));
      }
    } catch (error) {
      toast.error('Failed to toggle favorite');
    }
  },

  clearCurrentPost: () => set({ currentPost: null }),
  clearError: () => set({ error: null }),
}));

export default usePostStore;
