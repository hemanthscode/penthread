import { useState } from 'react';
import { Trash2, Check, X } from 'lucide-react';
import { useAuth } from '../../hooks';
import useCommentStore from '../../store/useCommentStore';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { formatRelativeTime } from '../../utils/helpers';

const CommentItem = ({ comment, postId }) => {
  const { user, isAdmin, isAuthor } = useAuth();
  const { moderateComment, deleteComment } = useCommentStore();
  const [deleting, setDeleting] = useState(false);

  const isCommentAuthor = comment.author?._id === user?.id;
  const canModerate = isAdmin() || isAuthor();
  const canDelete = isCommentAuthor || canModerate;

  const handleApprove = async () => {
    await moderateComment(comment._id, 'approve');
  };

  const handleReject = async () => {
    await moderateComment(comment._id, 'reject');
  };

  const handleDelete = async () => {
    setDeleting(true);
    await deleteComment(comment._id);
    setDeleting(false);
  };

  const getStatusBadge = () => {
    switch (comment.status) {
      case 'pending':
        return <Badge variant="warning" size="sm">Pending</Badge>;
      case 'approved':
        return <Badge variant="success" size="sm">Approved</Badge>;
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

        {/* Moderation Actions */}
        {canModerate && comment.status === 'pending' && (
          <div className="flex items-center space-x-2 mt-2">
            <Button
              variant="success"
              size="sm"
              icon={Check}
              onClick={handleApprove}
            >
              Approve
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={X}
              onClick={handleReject}
            >
              Reject
            </Button>
          </div>
        )}

        {/* Delete Action */}
        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            icon={Trash2}
            onClick={handleDelete}
            loading={deleting}
            className="mt-2 text-red-600 hover:text-red-700"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
