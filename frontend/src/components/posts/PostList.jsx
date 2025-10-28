import React from 'react';
import PostCard from './PostCard';

const PostList = ({ posts, onLikeToggle, onFavoriteToggle, userLikes, userFavorites }) => {
  if (!posts.length) {
    return <p className="text-center text-gray-500 mt-8">No posts found.</p>;
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          onLikeToggle={onLikeToggle}
          onFavoriteToggle={onFavoriteToggle}
          userLiked={userLikes.includes(post._id)}
          userFavorited={userFavorites.includes(post._id)}
        />
      ))}
    </section>
  );
};

export default PostList;
