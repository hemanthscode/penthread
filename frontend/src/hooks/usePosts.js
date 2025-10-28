// src/hooks/usePosts.js
import { useState, useEffect } from 'react';
import * as postService from '../services/postService';

export const usePosts = (initialFilters = {}) => {
  const [posts, setPosts] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (customFilters = filters) => {
    setLoading(true);
    try {
      const response = await postService.fetchPosts(customFilters);
      setPosts(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filters]);

  return { posts, loading, filters, setFilters, fetchPosts };
};
