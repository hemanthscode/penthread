import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "../../components/common/Loader";
import { fetchPostById } from "../../services/postService";
import LikeButton from "../../components/interactions/LikeButton";
import FavoriteButton from "../../components/interactions/FavoriteButton";
import ViewCounter from "../../components/interactions/ViewCounter";
import CommentThread from "../../components/comments/CommentThread";
import CommentForm from "../../components/comments/CommentForm";
import * as commentService from "../../services/commentService";
import { useComments } from "../../hooks/useComments";
import { ArrowLeft } from "lucide-react";

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const { comments, loading: commentsLoading, fetchComments } = useComments(id);

  useEffect(() => {
    fetchPostById(id).then((res) => setPost(res.data));
    // Record view count async
    import("../../services/interactionService").then((mod) => mod.recordView(id));
  }, [id]);

  const addComment = async (content) => {
    await commentService.addComment(id, { content });
    fetchComments();
  };

  if (!post) return <Loader />;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto px-6 py-12"
    >
      {/* Back Navigation */}
      <Link
        to="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
      </Link>

      {/* Post Header */}
      <motion.header
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 text-center"
      >
        <h1 className="text-5xl font-extrabold mb-3 text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {post.title}
        </h1>
        <p className="text-gray-600 text-sm">
          By{" "}
          <span className="font-semibold text-gray-800">
            {post.author?.name || "Unknown"}
          </span>{" "}
          • {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </motion.header>

      {/* Post Content */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="prose prose-lg max-w-none mb-10 text-gray-800 leading-relaxed"
      >
        <div className="rounded-2xl p-6 bg-white/80 backdrop-blur border border-gray-100 shadow-md">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </motion.section>

      {/* Interactions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap gap-8 justify-center items-center mb-12 p-4 rounded-xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-gray-100 shadow-sm"
      >
        <LikeButton postId={id} likesCount={post.likesCount} />
        <FavoriteButton postId={id} favoritesCount={post.favoritesCount} />
        <ViewCounter postId={id} viewsCount={post.viewsCount} />
      </motion.div>

      {/* Comments Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="bg-white/80 backdrop-blur rounded-2xl border border-gray-100 shadow-md p-8"
      >
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Comments
        </h2>

        <CommentForm onSubmit={addComment} />
        <div className="mt-8">
          {commentsLoading ? (
            <div className="flex justify-center py-10">
              <Loader />
            </div>
          ) : comments.length > 0 ? (
            <CommentThread comments={comments} />
          ) : (
            <p className="text-gray-500 italic text-center py-6">
              No comments yet — be the first to share your thoughts!
            </p>
          )}
        </div>
      </motion.section>
    </motion.article>
  );
};

export default PostDetails;
