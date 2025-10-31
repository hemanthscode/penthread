import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import { useAuth } from '../../hooks';
import useComments from '../../hooks/useComments';
import Button from '../common/Button';
import Textarea from '../common/Textarea';
import EmptyState from '../common/EmptyState';
import CommentItem from './CommentItem';
import toast from 'react-hot-toast';

const CommentSection = ({ postId }) => {
  const { isAuthenticated } = useAuth();
  const { comments, loading, createComment, refetch } = useComments(postId);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      refetch();
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
        <MessageCircle className="h-6 w-6 mr-2" />
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
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
          <p className="text-gray-600 dark:text-gray-400">
            Please login to leave a comment
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="No comments yet"
          message="Be the first to share your thoughts!"
        />
      ) : (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <CommentItem comment={comment} postId={postId} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
