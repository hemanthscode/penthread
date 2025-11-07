import { useState } from 'react';
import { Trash2, Check, X } from 'lucide-react';
import { useAuth } from '../../hooks';
import useCommentStore from '../../store/useCommentStore';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { formatRelativeTime } from '../../utils/helpers';

const CommentItem = ({ comment, postAuthorId, showModeration = false }) => {
  const { user, isAdmin } = useAuth();
  const { moderateComment, deleteComment } = useCommentStore();
  const [deleting, setDeleting] = useState(false);
  const [moderating, setModerating] = useState(false);
  const [commentStatus, setCommentStatus] = useState(comment.status);

  const isCommentAuthor = comment.author?.id === user?.id || comment.author?._id === user?.id;
  
  // Check if current user is the post author
  const isPostAuthor = postAuthorId && (postAuthorId === user?.id || postAuthorId === user?._id);
  
  // Moderation is allowed if:
  // 1. showModeration is true (passed from parent)
  // 2. Comment is pending
  // 3. User is admin OR user is the post author
  const canModerate =
    showModeration && 
    commentStatus === 'pending' && 
    (isAdmin() || isPostAuthor);
  
  // Deletion is allowed if:
  // User is the comment author OR user is admin OR user is the post author
  const canDelete = isCommentAuthor || isAdmin() || isPostAuthor;

  const handleApprove = async () => {
    setModerating(true);
    const previousStatus = commentStatus;
    setCommentStatus('approved'); // optimistic update
    const result = await moderateComment(comment.id || comment._id, 'approve');
    if (!result.success) {
      setCommentStatus(previousStatus); // revert on failure
    }
    setModerating(false);
  };

  const handleReject = async () => {
    setModerating(true);
    const previousStatus = commentStatus;
    setCommentStatus('rejected'); // optimistic update
    const result = await moderateComment(comment.id || comment._id, 'reject');
    if (!result.success) {
      setCommentStatus(previousStatus); // revert on failure
    }
    setModerating(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    setDeleting(true);
    await deleteComment(comment.id || comment._id);
    setDeleting(false);
  };

  const getStatusBadge = () => {
    switch (commentStatus) {
      case 'pending':
        return <Badge variant="warning" size="sm">Pending</Badge>;
      case 'approved':
        return showModeration ? <Badge variant="success" size="sm">Approved</Badge> : null;
      case 'rejected':
        return <Badge variant="danger" size="sm">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="flex space-x-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <Avatar name={comment.author?.name} size="md" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {comment.author?.name}
            </p>
            {getStatusBadge()}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatRelativeTime(comment.createdAt)}
          </p>
        </div>

        <p className="text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>

        <div className="flex items-center space-x-2 mt-2">
          {canModerate && (
            <>
              <Button
                variant="success"
                size="sm"
                icon={Check}
                onClick={handleApprove}
                loading={moderating}
                disabled={moderating}
              >
                Approve
              </Button>
              <Button
                variant="danger"
                size="sm"
                icon={X}
                onClick={handleReject}
                loading={moderating}
                disabled={moderating}
              >
                Reject
              </Button>
            </>
          )}

          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={handleDelete}
              loading={deleting}
              disabled={deleting}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;