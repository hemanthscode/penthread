import React, { useState, useEffect } from 'react';
import { useInteractions } from '../../hooks';

const LikeButton = ({ postId, likesCount = 0 }) => {
  const { likePost, unlikePost } = useInteractions();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likesCount);

  useEffect(() => {
    setCount(likesCount);
  }, [likesCount]);

  const toggleLike = async () => {
    if (liked) {
      await unlikePost(postId);
      setCount((prev) => prev - 1);
      setLiked(false);
    } else {
      await likePost(postId);
      setCount((prev) => prev + 1);
      setLiked(true);
    }
  };

  return (
    <button onClick={toggleLike} className={`flex items-center space-x-1 ${liked ? 'text-red-600' : 'text-gray-600'}`}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
      </svg>
      <span>{count}</span>
    </button>
  );
};

export default LikeButton;
