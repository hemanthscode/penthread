// src/components/posts/PostCard.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Star, Eye } from "lucide-react";
import { useAuthContext } from "../../contexts/AuthContext";
import { formatDate, truncate } from "../../utils";
import { likePost, favoritePost } from "../../services";

const PostCard = ({ post }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [likesCount, setLikesCount] = useState(post.likesCount ?? 0);
  const [favoritesCount, setFavoritesCount] = useState(post.favoritesCount ?? 0);
  const [liked, setLiked] = useState(post.isLiked || false);
  const [favorited, setFavorited] = useState(post.isFavorited || false);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);

  const showStatusBadge = user && (user.role === "admin" || user.role === "author");

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/auth/login");
    try {
      setLoadingLike(true);
      const res = await likePost(post._id);
      setLiked(res.liked);
      setLikesCount(res.likesCount);
    } catch (err) {
      console.error("Error liking post:", err);
    } finally {
      setLoadingLike(false);
    }
  };

  const handleFavorite = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/auth/login");
    try {
      setLoadingFav(true);
      const res = await favoritePost(post._id);
      setFavorited(res.favorited);
      setFavoritesCount(res.favoritesCount);
    } catch (err) {
      console.error("Error favoriting post:", err);
    } finally {
      setLoadingFav(false);
    }
  };

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
      className="group bg-white/90 backdrop-blur border border-gray-100 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
    >
      <div className="p-6 flex flex-col flex-grow">
        {/* Header */}
        <header className="flex justify-between items-start mb-3">
          <Link
            to={`/posts/${post._id}`}
            className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
            title={post.title}
          >
            {truncate(post.title, 70)}
          </Link>

          {showStatusBadge && (
            <span
              className={`text-xs font-semibold uppercase px-3 py-1 rounded-full ${
                post.status === "published"
                  ? "bg-green-100 text-green-700"
                  : post.status === "draft"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {post.status}
            </span>
          )}
        </header>

        {/* Content */}
        <p className="text-gray-600 mb-4 line-clamp-3">{truncate(post.content, 180)}</p>

        {/* Author */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <span>By</span>
          <span className="mx-1 font-medium text-gray-800">{post.author?.name || "Unknown"}</span>
          <span className="mx-1">•</span>
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
        </div>

        {/* Footer */}
        <footer className="mt-auto border-t pt-4 flex justify-between items-center text-gray-500">
          <div className="flex items-center space-x-6">
            {/* Like Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              disabled={loadingLike}
              className={`flex items-center space-x-1 ${
                liked ? "text-red-500" : "hover:text-red-500"
              }`}
              aria-label={liked ? "Unlike post" : "Like post"}
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-red-500" : ""}`} />
              <span>{likesCount}</span>
            </motion.button>

            {/* Favorite Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleFavorite}
              disabled={loadingFav}
              className={`flex items-center space-x-1 ${
                favorited ? "text-yellow-500" : "hover:text-yellow-500"
              }`}
              aria-label={favorited ? "Remove favorite" : "Add favorite"}
            >
              <Star className={`w-5 h-5 ${favorited ? "fill-yellow-400" : ""}`} />
              <span>{favoritesCount}</span>
            </motion.button>

            {/* Views */}
            <div className="flex items-center space-x-1">
              <Eye className="w-5 h-5 text-gray-400" />
              <span>{post.viewsCount ?? 0}</span>
            </div>
          </div>
        </footer>
      </div>
    </motion.article>
  );
};

export default PostCard;
