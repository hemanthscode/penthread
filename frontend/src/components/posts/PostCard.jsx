import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Eye, Calendar, Bookmark } from 'lucide-react';
import { useAuth } from '../../hooks';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Avatar from '../common/Avatar';
import interactionService from '../../services/interactionService';
import { formatRelativeTime, truncateText } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';
import toast from 'react-hot-toast';

const PostCard = ({ post: initialPost, onUpdate }) => {
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState(initialPost);
  const [actionLoading, setActionLoading] = useState(null);

  const postUrl = ROUTES.POST_DETAIL.replace(':id', post._id);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to like posts');
      return;
    }

    setActionLoading('like');

    // Optimistic update
    const previousState = { ...post };
    const wasLiked = post.userInteractions?.liked || false;

    const updatedPost = {
      ...post,
      userInteractions: {
        ...post.userInteractions,
        liked: !wasLiked,
      },
      likesCount: wasLiked ? post.likesCount - 1 : post.likesCount + 1,
    };

    setPost(updatedPost);

    try {
      const response = await interactionService.toggleLike(post._id);
      if (response.success) {
        // Update with server response
        const finalPost = {
          ...post,
          userInteractions: {
            ...post.userInteractions,
            liked: response.data.liked,
          },
          likesCount: response.data.liked ? post.likesCount + 1 : post.likesCount - 1,
        };
        setPost(finalPost);
        
        // Notify parent component
        if (onUpdate) {
          onUpdate(finalPost);
        }
      }
    } catch (error) {
      // Rollback on error
      setPost(previousState);
      toast.error('Failed to update like');
      console.error('Like error:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to save posts');
      return;
    }

    setActionLoading('favorite');

    // Optimistic update
    const previousState = { ...post };
    const wasFavorited = post.userInteractions?.favorited || false;

    const updatedPost = {
      ...post,
      userInteractions: {
        ...post.userInteractions,
        favorited: !wasFavorited,
      },
      favoritesCount: wasFavorited ? post.favoritesCount - 1 : post.favoritesCount + 1,
    };

    setPost(updatedPost);

    try {
      const response = await interactionService.toggleFavorite(post._id);
      if (response.success) {
        // Update with server response
        const finalPost = {
          ...post,
          userInteractions: {
            ...post.userInteractions,
            favorited: response.data.favorited,
          },
          favoritesCount: response.data.favorited
            ? post.favoritesCount + 1
            : post.favoritesCount - 1,
        };
        setPost(finalPost);
        
        // Notify parent component
        if (onUpdate) {
          onUpdate(finalPost);
        }
      }
    } catch (error) {
      // Rollback on error
      setPost(previousState);
      toast.error('Failed to update favorite');
      console.error('Favorite error:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const isLiked = post.userInteractions?.liked || false;
  const isFavorited = post.userInteractions?.favorited || false;

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
          {truncateText(post.content?.replace(/<[^>]*>/g, ''), 150)}
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

        {/* Stats and Actions */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
            <button
              onClick={handleLike}
              disabled={actionLoading === 'like' || !isAuthenticated}
              className={`flex items-center transition-colors ${
                isLiked ? 'text-red-500' : 'hover:text-red-500'
              } ${actionLoading === 'like' ? 'opacity-50' : ''} ${
                !isAuthenticated ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
              title={isAuthenticated ? (isLiked ? 'Unlike' : 'Like') : 'Login to like'}
            >
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-red-500' : ''}`} />
              {post.likesCount || 0}
            </button>

            <div className="flex items-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              {post.commentsCount || 0}
            </div>

            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {post.viewsCount || 0}
            </div>
          </div>

          {isAuthenticated && (
            <button
              onClick={handleFavorite}
              disabled={actionLoading === 'favorite'}
              className={`flex items-center transition-colors ${
                isFavorited ? 'text-primary-600' : 'text-gray-400 hover:text-primary-600'
              } ${actionLoading === 'favorite' ? 'opacity-50' : ''}`}
              title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Bookmark className={`h-4 w-4 ${isFavorited ? 'fill-primary-600' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default PostCard;
