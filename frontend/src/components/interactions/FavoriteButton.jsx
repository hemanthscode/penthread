// src/components/interactions/FavoriteButton.jsx
import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useInteractions } from '../../hooks';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';

const FavoriteButton = ({ postId, favoritesCount = 0 }) => {
  const { favoritePost, unfavoritePost } = useInteractions();
  const [favorited, setFavorited] = useState(false);
  const [count, setCount] = useState(favoritesCount);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    setCount(favoritesCount);
  }, [favoritesCount]);

  const toggleFavorite = async () => {
    if (!user) return navigate('/auth/login');
    if (loading) return;
    setLoading(true);

    try {
      if (favorited) {
        await unfavoritePost(postId);
        setCount((prev) => Math.max(prev - 1, 0));
        setFavorited(false);
      } else {
        await favoritePost(postId);
        setCount((prev) => prev + 1);
        setFavorited(true);
      }
    } catch (err) {
      console.error('Favorite action failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`flex items-center gap-1.5 text-sm font-medium transition-all ${
        favorited ? 'text-yellow-500' : 'text-gray-600 hover:text-yellow-500'
      } ${loading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      aria-label={favorited ? 'Remove favorite' : 'Add favorite'}
    >
      <Star
        size={18}
        className={`transition-transform duration-300 ${
          favorited ? 'fill-current scale-110' : 'scale-100'
        }`}
      />
      <span>{count}</span>
    </button>
  );
};

export default FavoriteButton;
