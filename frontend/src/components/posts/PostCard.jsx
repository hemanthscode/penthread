// src/components/posts/PostCard.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Eye, Calendar } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Avatar from '../common/Avatar';
import { formatRelativeTime, truncateText } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

const PostCard = ({ post }) => {
  const postUrl = ROUTES.POST_DETAIL.replace(':id', post._id);

  return (
    <Card hover className="h-full flex flex-col">
      {/* Post Image */}
      {post.image && (
        <div className="w-full h-48 overflow-hidden rounded-t-lg">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}

      <div className="flex-1 flex flex-col p-6">
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.slice(0, 2).map((category) => (
              <Badge key={category._id} variant="primary" size="sm">
                {category.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <Link to={postUrl}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1 line-clamp-3">
          {truncateText(post.content, 150)}
        </p>

        {/* Author and Date */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Avatar name={post.author?.name} size="sm" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {post.author?.name}
              </p>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="h-3 w-3 mr-1" />
                {formatRelativeTime(post.createdAt)}
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Heart
                className={`h-4 w-4 mr-1 ${
                  post.userInteractions?.liked ? 'fill-red-500 text-red-500' : ''
                }`}
              />
              {post.likesCount || 0}
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.commentsCount || 0}
            </div>
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {post.viewsCount || 0}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
