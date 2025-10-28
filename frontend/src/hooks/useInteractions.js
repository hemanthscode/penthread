// src/hooks/useInteractions.js
import { useState } from 'react';
import * as interactionService from '../services/interactionService';

export const useInteractions = () => {
  const [loading, setLoading] = useState(false);

  const likePost = async (postId) => {
    setLoading(true);
    try {
      return await interactionService.likePost(postId);
    } finally {
      setLoading(false);
    }
  };

  const unlikePost = async (postId) => {
    setLoading(true);
    try {
      return await interactionService.unlikePost(postId);
    } finally {
      setLoading(false);
    }
  };

  const favoritePost = async (postId) => {
    setLoading(true);
    try {
      return await interactionService.favoritePost(postId);
    } finally {
      setLoading(false);
    }
  };

  const unfavoritePost = async (postId) => {
    setLoading(true);
    try {
      return await interactionService.unfavoritePost(postId);
    } finally {
      setLoading(false);
    }
  };

  const recordView = async (postId) => {
    setLoading(true);
    try {
      return await interactionService.recordView(postId);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    likePost,
    unlikePost,
    favoritePost,
    unfavoritePost,
    recordView
  };
};
