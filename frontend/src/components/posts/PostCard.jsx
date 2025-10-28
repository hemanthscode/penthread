import React from 'react';
import { Link } from 'react-router-dom';
import { truncate, formatDate } from '../../utils';
import PostStatusBadge from './PostStatusBadge';
import LikeButton from '../interactions/LikeButton';
import FavoriteButton from '../interactions/FavoriteButton';

const PostCard = ({ post }) => {
  if (!post) return null;

  return (
    <article className="border rounded p-4 shadow-md hover:shadow-lg transition flex flex-col">
      <header className="flex justify-between items-center mb-2">
        <Link to={`/posts/${post._id}`} className="text-xl font-semibold text-blue-700 hover:underline">
          {post.title}
        </Link>
        <PostStatusBadge status={post.status} />
      </header>
      <p className="text-gray-700 mb-3">{truncate(post.content, 150)}</p>
      <footer className="flex justify-between items-center text-sm text-gray-500">
        <span>By {post.author?.name || 'Unknown'}</span>
        <span>{formatDate(post.createdAt)}</span>
      </footer>
      <div className="mt-3 flex gap-4 items-center">
        <LikeButton postId={post._id} likesCount={post.likesCount || 0} />
        <FavoriteButton postId={post._id} favoritesCount={post.favoritesCount || 0} />
      </div>
    </article>
  );
};

export default PostCard;
