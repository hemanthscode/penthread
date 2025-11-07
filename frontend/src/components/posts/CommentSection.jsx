import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import { useAuth } from '../../hooks';
import useComments from '../../hooks/useComments';
import Button from '../common/Button';
import Textarea from '../common/Textarea';
import EmptyState from '../common/EmptyState';
import CommentItem from './CommentItem';
import toast from 'react-hot-toast';

const CommentSection = ({ postId, postAuthorId, showModeration = false }) => {
  const { isAuthenticated } = useAuth();
  const {
    comments,
    pendingComments,
    loading,
    createComment,
    moderateComment,
    deleteComment,
    clearComments,
    fetchComments,
    fetchPendingComments,
  } = useComments(postId);

  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!postId) return;

    fetchComments(postId); // Always fetch approved comments
    if (showModeration) {
      fetchPendingComments(); // Fetch pending only if moderation is enabled
    }
    return () => clearComments();
  }, [postId, showModeration]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!isAuthenticated) {
      toast.error('Please login to comment');
      return;
    }
    setSubmitting(true);
    const result = await createComment(commentText);
    if (result.success) {
      setCommentText('');
      fetchComments(postId);
      if (showModeration) {
        fetchPendingComments(); // Refresh pending comments for moderators
      }
    } else {
      toast.error(result.error || 'Failed to post comment');
    }
    setSubmitting(false);
  };

  // Show approved + pending (without duplication) if moderating, else just approved
  const allComments = showModeration
    ? [
        ...pendingComments,
        ...comments.filter(
          (c) => !pendingComments.some((p) => p._id === c._id || p.id === c._id)
        ),
      ]
    : comments;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
        <MessageCircle className="h-6 w-6 mr-2" />
        Comments ({allComments.length})
      </h2>

      {/* Show comment form for non-moderators or admins who want to comment */}
      {isAuthenticated && (
        <form onSubmit={handleSubmit} className="mb-8">
          <Textarea
            name="comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="mb-3"
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={Send}
              loading={submitting}
              disabled={!commentText.trim() || submitting}
            >
              Post Comment
            </Button>
          </div>
        </form>
      )}

      {!isAuthenticated && (
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
          <p className="text-gray-600 dark:text-gray-400">Please login to leave a comment</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading comments...</p>
        </div>
      ) : allComments.length === 0 ? (
        <EmptyState icon={MessageCircle} title="No comments yet" message="Be the first to share your thoughts!" />
      ) : (
        <div className="space-y-4">
          {allComments.map((comment, idx) => (
            <motion.div
              key={comment.id || comment._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <CommentItem 
                comment={comment} 
                postAuthorId={postAuthorId}
                showModeration={showModeration} 
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;