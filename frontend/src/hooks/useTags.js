// src/hooks/useTags.js
import { useState, useEffect } from 'react';
import * as tagService from '../services/tagService';

export const useTags = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const response = await tagService.fetchTags();
      setTags(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return { tags, loading, fetchTags };
};
