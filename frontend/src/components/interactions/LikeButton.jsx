// src/components/interactions/LikeButton.jsx
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useInteractions } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

const LikeButton = ({ postId, likesCount = 0 }) => {
  const { likePost, unlikePost } = useInteractions();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likesCount);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    setCount(likesCount);
  }, [likesCount]);

  const toggleLike = async () => {
    if (!user) return navigate('/auth/login');
    if (loading) return;
    setLoading(true);

    try {
      if (liked) {
        await unlikePost(postId);
        setCount((prev) => Math.max(prev - 1, 0));
        setLiked(false);
      } else {
        await likePost(postId);
        setCount((prev) => prev + 1);
        setLiked(true);
      }
    } catch (err) {
      console.error('Like action failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleLike}
      disabled={loading}
      className={`flex items-center gap-1.5 text-sm font-medium transition-all ${
        liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
      } ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      aria-label={liked ? 'Unlike post' : 'Like post'}
    >
      <Heart
        size={18}
        className={`transition-transform duration-300 ${
          liked ? 'fill-current scale-110' : 'scale-100'
        }`}
      />
      <span>{count}</span>
    </button>
  );
};

export default LikeButton;
