// src/hooks/useComments.js
import { useState, useEffect } from 'react';
import * as commentService from '../services/commentService';

export const useComments = (postId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    if (!postId) return;
    setLoading(true);
    try {
      const response = await commentService.fetchCommentsByPost(postId);
      setComments(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return { comments, loading, fetchComments, setComments };
};
