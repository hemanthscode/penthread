import React, { useState, useEffect } from 'react';
import { useInteractions } from '../../hooks';

const FavoriteButton = ({ postId, favoritesCount = 0 }) => {
  const { favoritePost, unfavoritePost } = useInteractions();
  const [favorited, setFavorited] = useState(false);
  const [count, setCount] = useState(favoritesCount);

  useEffect(() => {
    setCount(favoritesCount);
  }, [favoritesCount]);

  const toggleFavorite = async () => {
    if (favorited) {
      await unfavoritePost(postId);
      setCount((prev) => prev - 1);
      setFavorited(false);
    } else {
      await favoritePost(postId);
      setCount((prev) => prev + 1);
      setFavorited(true);
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`flex items-center space-x-1 ${favorited ? 'text-yellow-500' : 'text-gray-600'}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={favorited ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
      </svg>
      <span>{count}</span>
    </button>
  );
};

export default FavoriteButton;
